import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Message content cannot be empty' })
  @MaxLength(2000, { message: 'Message cannot exceed 2000 characters' })
  content!: string;
}
