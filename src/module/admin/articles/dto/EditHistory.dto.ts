import { UpdateArticleDto } from "src/module/articles/dto/create-article.dto";

export class EditHistoryDto {
  id: string;
  editorId: string;
  timestamp: string;
  changes: Partial<UpdateArticleDto>;
  changesApproved?: boolean;
}
