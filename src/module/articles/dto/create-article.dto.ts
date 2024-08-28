import { IsOptional, IsString, IsArray, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty({ message: 'عنوان حتما باید وارد شود' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'توضیحات حتما باید وارد شود' })
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  moreInformation?: MoreInformationItem[];

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsArray()
  resources?: string[];

  @IsOptional()
  @IsArray()
  gotTo?: string[];

  @IsOptional()
  @IsArray()
  extras?: string[];

  @IsOptional()
  @IsString()
  author: string;
  
  @IsOptional()
  @IsString()
  date: string;
  
  @IsOptional()
  @IsBoolean()
  approved: boolean;
  
  @IsOptional()
  @IsBoolean()
  approvedBySuperAdmin: boolean;

  @IsOptional()
  @IsBoolean()
  isVisible: boolean;
}

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  moreInformation?: MoreInformationItem[];

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsArray()
  resources?: string[];

  @IsOptional()
  @IsArray()
  gotTo?: string[];

  @IsOptional()
  @IsArray()
  extras?: string[];

  // @IsBoolean()
  // approved: boolean;

  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  date: string;

  // @IsBoolean()
  // approvedBySuperAdmin: boolean;
}

export class MoreInformationItem {
  @IsNotEmpty({ message: 'عنوان حتما باید وارد شود' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'توضیحات حتما باید وارد شود' })
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image?: string;
}
