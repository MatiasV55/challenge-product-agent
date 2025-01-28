import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MessageDto } from '../dtos/agent.dto';
import { AgentService } from '../services/agent.service';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('get-response')
  async getAgentResponse(@Body() payload: MessageDto) {
    try {
      const response = await this.agentService.getAgentResponse(payload);
      return response;
    } catch (error) {
      console.error('Error en getAgentResponse:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
