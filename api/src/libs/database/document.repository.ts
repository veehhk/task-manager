import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, SchemaTypes, Types, UpdateQuery } from 'mongoose'
import { PaginationOptions } from '../database/pagination.options'
import { PaginatedResponse } from '../database/paginated.response'
import { BaseDocument } from "../document/base.document"

@Injectable()
export abstract class DocumentRepository<TDocument extends BaseDocument> {
  constructor(
    @InjectModel('TDocument') private readonly model: Model<TDocument>,
  ) {}

  private preparePipeline(
    options?: PaginationOptions,
    filter?: FilterQuery<TDocument>,
    groupBy?: keyof TDocument | Array<keyof TDocument>,
  ): any[] {
    const pipeline: any[] = [{ $match: filter }]

    if (options) {
      const { page, limit, sortBy, sortOrder } = options
      const skip = (page - 1) * limit

      pipeline.push(
        { $sort: { [sortBy]: sortOrder } },
        { $skip: skip },
        { $limit: limit },
      )
    }

    if (groupBy) {
      const groupFields = Array.isArray(groupBy) ? groupBy : [groupBy]
      const group: {
        [K in keyof TDocument & keyof Record<string, TDocument>]: string[]
      } = {} as {
        [K in keyof TDocument & keyof Record<string, TDocument>]: string[]
      }

      groupFields.forEach((field) => {
        group[String(field)] = `$${String(field)}`
      })
      pipeline.push({ $group: { _id: group, data: { $push: `$$ROOT` } } })
    }

    return pipeline
  }

  public async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    return await new this.model({
      ...document,
      _id: undefined,
    }).save()
  }

  async findOne(filter: FilterQuery<TDocument>): Promise<TDocument> {
    return this.model.findOne(filter).exec()
  }

  public async findOneOrCreate(
    filter: FilterQuery<TDocument>,
    document: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    return this.model
      .findOneAndUpdate(filter, document, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      })
      .exec()
  }

  public async findById(_id: string): Promise<TDocument> {
    return this.model.findById(_id).exec()
  }

  public async findAll(
    filter?: FilterQuery<TDocument>,
    groupBy?: keyof TDocument | Array<keyof TDocument>,
  ): Promise<TDocument[]> {
    return this.model
      .aggregate(this.preparePipeline(undefined, filter, groupBy))
      .exec()
  }

  public async findAllPaginated(
    options: PaginationOptions,
    filter?: FilterQuery<TDocument>,
    groupBy?: keyof TDocument | Array<keyof TDocument>,
  ): Promise<PaginatedResponse<TDocument>> {
    const { page, limit, sortBy, sortOrder } = options

    const [totalCount, data] = await Promise.all([
      this.model.countDocuments(filter),
      this.model
        .aggregate(this.preparePipeline(options, filter, groupBy))
        .exec(),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return {
      data,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        sortBy,
        sortOrder,
      },
    }
  }

  public async findDistinct(
    field: keyof TDocument,
    filter?: FilterQuery<TDocument>,
  ): Promise<any[]> {
    return this.model.distinct(field.toString(), filter).exec()
  }

  async findOneRandom(filter: FilterQuery<TDocument>): Promise<TDocument> {
    const count = await this.model.countDocuments(filter).exec()
    const randomIndex = Math.floor(Math.random() * count)
    return this.model.findOne(filter).skip(randomIndex).exec()
  }

  public async findOneAndUpdate(
    filter: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    return this.model
      .findOneAndUpdate(filter, update, { upsert: true, new: true })
      .exec()
  }

  public async update(document: UpdateQuery<TDocument>): Promise<TDocument> {
    return this.model
      .findByIdAndUpdate(document._id, document, { new: true })
      .exec()
  }

  public async updateOneOrCreate(
    filter: FilterQuery<TDocument>,
    document: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    return this.model
      .findOneAndUpdate(filter, document, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      })
      .exec()
  }

  public async activate(_id: string): Promise<void> {
    await this.model.findByIdAndUpdate(_id, { active: false }).exec()
  }

  public async deactivate(_id: string): Promise<void> {
    await this.model.findByIdAndUpdate(_id, { active: true }).exec()
  }

  public async delete(_id: string): Promise<TDocument> {
    return this.model.findByIdAndDelete(_id).exec()
  }

  public async deleteMany(filter: FilterQuery<TDocument>): Promise<void> {
    await this.model.deleteMany(filter).exec()
  }

  public async count(filter: FilterQuery<TDocument>): Promise<number> {
    return this.model.countDocuments(filter)
  }

  public async exists(filter: FilterQuery<TDocument>): Promise<boolean> {
    return (await this.model.countDocuments(filter).exec()) > 0
  }
}
