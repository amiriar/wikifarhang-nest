import { ApiProperty } from '@nestjs/swagger';

export class ApproveChangeDto {
  @ApiProperty({
    description: 'The reason for approving the change.',
    example: 'The changes have been reviewed and are correct.',
  })
  reason: string;
}
