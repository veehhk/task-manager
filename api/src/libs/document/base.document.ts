/**
 * @description Import directives
 */
import { Prop } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'
import { v4 as uuid } from 'uuid'

/**
 * @author Harihara Krishnan
 * @class BaseDocument
 * @description Defines the must have fields for all the MongoDB document
 */
export abstract class BaseDocument {
  /**
   * @description UUID of any document
   * @type UUIDV4 string
   */
  @Prop({ type: SchemaTypes.UUID, default: () => uuid(), required: true })
  public _id: string

  /**
   * @description Unique code
   * @type string
   */
  @Prop({ type: SchemaTypes.String, default: undefined, required: false })
  public code?: string

  /**
   * @description Public visibility
   * @type boolean
   */
  @Prop({ type: SchemaTypes.Boolean, default: true, required: true })
  public draft: boolean

  /**
   * @description Active record
   * @type boolean
   */
  @Prop({ type: SchemaTypes.Boolean, default: true, required: true })
  public active: boolean

  /**
   * @description Initializer
   * @param _id
   * @param draft
   * @param active
   * @param code
   */
  constructor(_id: string, draft: boolean, active: boolean, code?: string) {
    this._id = _id
    this.code = code
    this.draft = draft
    this.active = active
  }
}
