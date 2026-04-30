import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { QuerySnippetsDto } from './dto/query-snippets.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { SnippetsService } from './snippets.service';

@ApiTags('snippets')
@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create snippet' })
  @ApiCreatedResponse({ description: 'Snippet created' })
  create(@Body() createSnippetDto: CreateSnippetDto) {
    return this.snippetsService.create(createSnippetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get snippets list with pagination/search/filter' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @ApiOkResponse({ description: 'Snippets list' })
  findAll(@Query() query: QuerySnippetsDto) {
    return this.snippetsService.findAll(query);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Get unique snippet tags' })
  @ApiOkResponse({ description: 'Tags list' })
  listTags() {
    return this.snippetsService.listTags();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get snippet by id' })
  @ApiOkResponse({ description: 'Snippet found' })
  @ApiNotFoundResponse({ description: 'Snippet not found' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.snippetsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update snippet by id' })
  @ApiOkResponse({ description: 'Snippet updated' })
  @ApiNotFoundResponse({ description: 'Snippet not found' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateSnippetDto: UpdateSnippetDto,
  ) {
    return this.snippetsService.update(id, updateSnippetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete snippet by id' })
  @ApiNoContentResponse({ description: 'Snippet deleted' })
  @ApiNotFoundResponse({ description: 'Snippet not found' })
  async remove(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    await this.snippetsService.remove(id);
  }
}
