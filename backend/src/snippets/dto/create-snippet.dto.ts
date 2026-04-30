import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SnippetType } from '../enums/snippet-type.enum';

export class CreateSnippetDto {
  @ApiProperty({ example: 'Mongo text index for snippets' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @ApiProperty({ example: 'db.snippets.createIndex({ title: "text" })' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;

  @ApiProperty({
    required: false,
    type: [String],
    example: ['mongodb', 'index'],
    default: [],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ enum: SnippetType, example: SnippetType.COMMAND })
  @IsEnum(SnippetType)
  type: SnippetType;
}
