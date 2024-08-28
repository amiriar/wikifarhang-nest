import { ApiProperty } from '@nestjs/swagger';

export class RejectChangeDto {
  @ApiProperty({
    description: 'The reason for rejecting the change.',
    example: 'The changes do not meet the required standards.',
  })
  reason: string;
}
