import { UpdateArticleDto } from "src/module/articles/dto/create-article.dto";

export interface EditHistoryDto {
  id: string;
  editorId: string;
  timestamp: string;
  changes: Partial<UpdateArticleDto>;
  changesApproved: boolean;
  approvalReason?: string; // Add this line
  rejectionReason?: string; // Add this line
}
