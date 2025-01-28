import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

import { MessageDto } from '../dtos/agent.dto';
import { MessageService } from 'src/message/services/message.service';
import { OrderService } from 'src/order/services/order.service';
import { ProductService } from 'src/product/services/product.service';
import { OrderStatus } from 'src/order/entities/order.entity';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { SessionStatus } from 'src/message/entities/session.entity';

const UserIntentSchema = z.object({
  intent: z.enum([
    'report_order_status',
    'offer_product',
    'refer_to_human',
    'off_topic',
  ]),
  details: z.object({
    orderId: z.string().optional(),
    productQuery: z.string().optional(),
    message: z.string(),
  }),
});

type UserIntentSchema = z.infer<typeof UserIntentSchema>;

@Injectable()
export class AgentService {
  private openai: OpenAI;

  constructor(
    private readonly messageService: MessageService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
  }

  async getUserIntent(
    conversation: ChatCompletionMessageParam[],
  ): Promise<UserIntentSchema> {
    try {
      const completion = await this.openai.beta.chat.completions.parse({
        model: 'gpt-4o-2024-08-06',
        messages: [
          {
            role: 'system',
            content: `
            You are a structured intent detection assistant designed to classify user intents based on the provided conversation. Follow these strict guidelines to determine the correct intent:
            
            1. **Inform Order Status (\`report_order_status\`)**:
               - Identify if the user is asking about the status of a specific order. Examples include: "Hola, quería saber el estado de mi pedido".
               - Extract any relevant order identifiers (e.g., order ID) if mentioned.
               - If the user has already received a response about their order and requests additional details, the intent must be classified as \`refer_to_human\`.

            2. **Refer to Human (\`refer_to_human\`)**:
               - If the user asks for additional information about a product or order after receiving a response (e.g., clarification, further details, or next steps), classify the intent as \`refer_to_human\`.
               - If the user requests to make a purchase, file a claim, or seeks any information beyond the agent’s capabilities, classify the intent as \`refer_to_human\`.
            
            3. **Off-topic (\`off_topic\`)**:
               - Detect when the user’s query is unrelated to products or orders, or when the requested information is beyond the scope of the agent.
            
            4. **Offer Product (\`offer_product\`)**:
               - Identify if the user is requesting to view or purchase a product.
               - Extract any product details if specified.
               - If the user has already received a response about their order or product and requests additional details, the intent must be classified as \`refer_to_human\`.
            
            ### Response Output:
            - Classify the user's intent as one of the following options: \`report_order_status\`, \`refer_to_human\`, \`off_topic\`, or \`offer_product\`.
            - Provide detailed information to clarify the intent:
              - For \`report_order_status\`, include any extracted order ID.
              - For \`offer_product\`, include any extracted product details.
            
            ### Critical Notes:
            - If the user has already received a response about their order or product and requests additional details, the intent must be classified as \`refer_to_human\`.
            - The agent is only authorized to check order statuses and offer products. All other queries must be referred to a human or logged as off-topic.
            - Ensure every intent is classified accurately and includes sufficient context for human review.
            `,
          },
          ...conversation,
        ],
        response_format: zodResponseFormat(
          UserIntentSchema,
          'user_intent_detection',
        ),
      });

      const userIntent = completion.choices[0].message.parsed;

      return userIntent;
    } catch (error) {
      throw new InternalServerErrorException('Error getting user intent');
    }
  }

  async reportOrderStatus(orderId: string): Promise<string> {
    try {
      const order = await this.orderService.getOrderByTrackingId(orderId);
      if (!order) {
        return 'Lo siento, no he encontrado el pedido con el Tracking ID proporcionado.';
      }

      const statusMap: { [key in OrderStatus]: string } = {
        [OrderStatus.PENDING]: 'pending',
        [OrderStatus.IN_PROGRESS]: 'in progress',
        [OrderStatus.COMPLETED]: 'completed',
        [OrderStatus.CANCELLED]: 'cancelled',
      };

      const orderStatus = statusMap[order.status as OrderStatus] || 'unknown';

      const userMessage = `The user wants to know the status of their order. Here is the order data in JSON format:

      Order status: ${orderStatus}
      Order JSON:
      ${JSON.stringify(order, null, 2)}
      
      The order status can have the following meanings:
      - "pending": The order is pending shipment and has not yet been sent to its destination.
      - "in progress": The order is currently being shipped to its destination.
      - "completed": The order has arrived at its destination successfully.
      - "cancelled": The order was cancelled for some reason and will not be delivered.
      
      Using this information, explain the status of the order to the user clearly, and include details about the products in the order. Respond in Spanish.`;

      const completions = await this.openai.chat.completions.create({
        model: 'gpt-4o-2024-08-06',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that explains the status of orders to users. Always respond in Spanish.',
          },
          { role: 'user', content: userMessage },
        ],
      });

      return completions.choices[0].message.content;
    } catch (error) {
      throw new InternalServerErrorException('Error getting order status');
    }
  }

  async offerAvailableProducts(userQuery: string): Promise<string> {
    try {
      const products = await this.productService.getAllProducts();

      const userMessage = `
      User's query:
      ${userQuery}
      
      Available product information from the company:
      
      ${JSON.stringify(products, null, 2)}
      
      Please provide a detailed response to the user in Spanish, taking into account the following:
      - Summarize the user's query to ensure understanding.
      - Provide a list of products related to the user's query, based on the available product data.
      - If no products match the query, inform the user that no relevant products were found and suggest refining the query or browsing other categories.
      - Ensure that your response follows the context of the user's query and continues the conversation smoothly, guiding them to the next logical step (for example, asking if they need more information or offering other products).`;

      const completions = await this.openai.chat.completions.create({
        model: 'gpt-4o-2024-08-06',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant responsible for offering products related to an automotive dealership based on the provided details. Always respond in Spanish. Follow the conversation based on the user’s query and keep it engaging.',
          },
          { role: 'user', content: userMessage },
        ],
      });

      return completions.choices[0].message.content;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error generating product offering',
      );
    }
  }

  async referToHuman(sessionId: string): Promise<null> {
    await this.messageService.updateSessionStatus(
      sessionId,
      SessionStatus.REFERRED_TO_HUMAN,
    );
    return null;
  }

  async offTopic(sessionId: string): Promise<null> {
    await this.messageService.updateSessionStatus(
      sessionId,
      SessionStatus.ENDED_OFF_TOPIC,
    );
    return null;
  }

  async getAgentResponse(payload: MessageDto): Promise<MessageDto> {
    try {
      const sessionId =
        payload.sessionId ?? (await this.messageService.createSession());

      await this.messageService.createMessage({
        content: payload.content,
        role: 'user',
        sessionId,
      });

      const conversation =
        await this.messageService.getStructuredMessagesBySessionId(sessionId);

      const userIntent = await this.getUserIntent(
        conversation as ChatCompletionMessageParam[],
      );
      let response: string = '';
      switch (userIntent.intent) {
        case 'report_order_status':
          if (!userIntent.details.orderId) {
            response =
              'Por favor proporcione el Tracking ID de su pedido para poder ayudarle.';
          } else {
            console.log('ORDER ID: ', userIntent.details.orderId);
            response = await this.reportOrderStatus(userIntent.details.orderId);
          }
          await this.messageService.createMessage({
            content: response,
            role: 'assistant',
            sessionId,
          });
          return {
            content: response,
            role: 'assistant',
            sessionId,
          };
        case 'offer_product':
          response = await this.offerAvailableProducts(payload.content);
          await this.messageService.createMessage({
            content: response,
            role: 'assistant',
            sessionId,
          });
          return {
            content: response,
            role: 'assistant',
            sessionId,
          };
        case 'refer_to_human':
          this.referToHuman(sessionId);
          break;
        default:
          this.offTopic(sessionId);
      }
    } catch (error) {
      throw new InternalServerErrorException('Error getting agent response');
    }
  }
}
