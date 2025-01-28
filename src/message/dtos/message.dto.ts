import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['user', 'assistant'], {
    message: 'Role must be either "user" or "assistant"',
  })
  role: string;

  @IsString()
  @IsNotEmpty()
  sessionId: string;
}

export class StructuredMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['user', 'assistant'], {
    message: 'Role must be either "user" or "assistant"',
  })
  role: string;
}
