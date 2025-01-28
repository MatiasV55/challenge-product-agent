import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';

export class MessageDto {
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
  @IsOptional()
  sessionId?: string;
}
