import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateConversationDto {
  @IsUUID('4')
  @IsNotEmpty()
  product_id!: string;
}
