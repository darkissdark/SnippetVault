import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Model, type ProjectionType, type SortOrder } from 'mongoose';
import { SNIPPET_LIMITS } from '../lib/constants/snippets';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { QuerySnippetsDto } from './dto/query-snippets.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { Snippet, SnippetDocument } from './schemas/snippet.schema';

@Injectable()
export class SnippetsService {
  constructor(
    @InjectModel(Snippet.name)
    private readonly snippetModel: Model<SnippetDocument>,
    @InjectPinoLogger(SnippetsService.name)
    private readonly logger: PinoLogger,
  ) {}

  async create(createSnippetDto: CreateSnippetDto): Promise<Snippet> {
    const snippet = await this.snippetModel.create(createSnippetDto);
    const obj = snippet.toObject();

    this.logger.info(
      { snippetId: String(snippet.id), snippetType: obj.type },
      'Snippet created',
    );

    return obj;
  }

  async findAll(query: QuerySnippetsDto) {
    const { page = 1, limit = 10, q, tag } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      ...(q ? { $text: { $search: q } } : {}),
      ...(tag ? { tags: tag } : {}),
    };

    const baseProjection: ProjectionType<SnippetDocument> = {
      title: 1,
      tags: 1,
      type: 1,
      createdAt: 1,
      updatedAt: 1,
      content: 1,
    };
    const projection: ProjectionType<SnippetDocument> = q
      ? {
          ...baseProjection,
          score: { $meta: 'textScore' },
        }
      : baseProjection;
    const sort: Record<string, SortOrder | { $meta: 'textScore' }> = q
      ? { score: { $meta: 'textScore' }, createdAt: -1 }
      : { createdAt: -1 };

    const [items, total] = await Promise.all([
      this.snippetModel
        .find(filter, projection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .then((docs) =>
          docs.map((doc) => ({
            ...doc,
            content: (doc.content ?? '').slice(0, SNIPPET_LIMITS.PREVIEW_CHARS),
          })),
        ),
      this.snippetModel.countDocuments(filter),
    ]);

    this.logger.debug(
      {
        page,
        limit,
        hasSearch: Boolean(query.q),
        tag: query.tag ?? null,
        resultCount: items.length,
        total,
      },
      'Listed snippets',
    );

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async listTags(): Promise<string[]> {
    const tags = await this.snippetModel.distinct('tags');
    return tags.filter(Boolean).sort((a, b) => a.localeCompare(b));
  }

  async findOne(id: string): Promise<Snippet> {
    const snippet = await this.snippetModel.findById(id).lean();
    if (!snippet) {
      throw new NotFoundException('Snippet not found');
    }

    this.logger.info({ snippetId: id }, 'Snippet fetched by id');

    return snippet;
  }

  async update(
    id: string,
    updateSnippetDto: UpdateSnippetDto,
  ): Promise<Snippet> {
    const snippet = await this.snippetModel
      .findByIdAndUpdate(id, updateSnippetDto, { new: true })
      .lean();

    if (!snippet) {
      throw new NotFoundException('Snippet not found');
    }

    this.logger.info({ snippetId: id }, 'Snippet updated');

    return snippet;
  }

  async remove(id: string): Promise<void> {
    const result = await this.snippetModel.findByIdAndDelete(id).lean();

    if (!result) {
      throw new NotFoundException('Snippet not found');
    }

    this.logger.info({ snippetId: id }, 'Snippet deleted');
  }
}
