/**========================================================================
 *                             IMPORTS
 *========================================================================**/
import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common'
  import { Observable, map } from 'rxjs'
  import {
    MESSAGE_BAD_REQUEST,
    MESSAGE_CONFLICT,
    MESSAGE_CREATED,
    MESSAGE_DELETED,
    MESSAGE_FAILED,
    MESSAGE_FORBIDDEN,
    MESSAGE_FOUND,
    MESSAGE_INTERNAL_SERVER_ERROR,
    MESSAGE_NOT_FOUND,
    MESSAGE_NOT_MODIFIED,
    MESSAGE_NO_CONTENT,
    MESSAGE_SERVICE_UNAVAILABLE,
    MESSAGE_SUCCESS,
    MESSAGE_UNAUTHORIZED,
    MESSAGE_UPDATED,
  } from '../literals/message.constant'
  /*============================ END OF IMPORTS ============================*/
  
  /**========================================================================
   * *                     Response Interface Type
   *   1. status - HTTP status code
   *   2. message - Response message from the message.constant
   *   3. error - Error object caught from the service
   *   4. data - Response data from the service
   *========================================================================**/
  export interface TMResponse<T> {
    status: number
    message: string
    error?: string
    data: T
  }
  /*============================ END OF INTERFACE ==========================*/
  
  /**========================================================================
   * ?                                ABOUT
   * @author         :  Harihara Krishnan
   * @email          :  hariharakrishnen@gmail.com
   * @repo           :  task-manager
   * @description    :  Response interceptor to prepare the response
   *========================================================================**/
  @Injectable()
  export class TMResponseInterceptor<T>
    implements NestInterceptor<T, TMResponse<T>>
  {
    /**========================================================================
     * *                            INTERCEPTOR
     *   1. Intercepts the response from the service
     *   2. Calls the prepareResponse() to rewrite the response
     *   3. Returns the TMResponse<T> object
     *========================================================================**/
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<TMResponse<T>> {
      return next
        .handle()
        .pipe(map((data) => this.prepareResponse(data, context)))
    }
    /*============================ END OF INTERCEPTOR =======================*/
  
    /**========================================================================
     * *                          RESPONSE REWRITER
     *   1. Rewrites the response based on the message from the service
     *   2. Returns the TMResponse object
     *   3. The TMResponse object is then intercepted by the ResponseInterceptor
     *   4. The ResponseInterceptor prepares the final response
     *========================================================================**/
    prepareResponse(data: any, context: ExecutionContext): TMResponse<T> {
      let computedStatus: any
      //* INFO: Rewrites the response based on the message from the service
      switch (data.message) {
        case MESSAGE_SUCCESS:
          computedStatus = HttpStatus.OK
          break
        case MESSAGE_CONFLICT:
          computedStatus = HttpStatus.CONFLICT
          break
        case MESSAGE_CREATED:
          computedStatus = HttpStatus.CREATED
          break
        case MESSAGE_UPDATED:
          computedStatus = HttpStatus.OK
          break
        case MESSAGE_DELETED:
          computedStatus = HttpStatus.OK
          break
        case MESSAGE_NOT_MODIFIED:
          computedStatus = HttpStatus.NOT_MODIFIED
          break
        case MESSAGE_FOUND:
          computedStatus = HttpStatus.FOUND
          break
        case MESSAGE_NO_CONTENT:
          computedStatus = HttpStatus.NO_CONTENT
          break
        case MESSAGE_NOT_FOUND:
          computedStatus = HttpStatus.NOT_FOUND
          break
        case MESSAGE_BAD_REQUEST:
          computedStatus = HttpStatus.BAD_REQUEST
          break
        case MESSAGE_UNAUTHORIZED:
          computedStatus = HttpStatus.UNAUTHORIZED
          break
        case MESSAGE_FORBIDDEN:
          computedStatus = HttpStatus.FORBIDDEN
          break
        case MESSAGE_INTERNAL_SERVER_ERROR:
          computedStatus = HttpStatus.INTERNAL_SERVER_ERROR
          break
        case MESSAGE_SERVICE_UNAVAILABLE:
          computedStatus = HttpStatus.SERVICE_UNAVAILABLE
          break
        default:
          computedStatus = HttpStatus.INTERNAL_SERVER_ERROR
          data.message = MESSAGE_FAILED
          break
      }
  
      //* INFO: Sets the response status code
      context.switchToHttp().getResponse().status(computedStatus)
  
      //* INFO: Returns the TMResponse object
      return {
        status: computedStatus,
        message: data.message,
        data: data.data,
        error: data.error,
      }
    }
    //============================ END OF RESPONSE REWRITER ==================
  }
  