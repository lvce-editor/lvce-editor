import * as Connection from '../Connection/Connection.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'

export const notFoundResponse = {
  absolutePath: '',
  status: HttpStatusCode.NotFound,
  headers: {
    [HttpHeader.Connection]: Connection.Close,
  },
}
