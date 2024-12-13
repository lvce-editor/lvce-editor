import * as Connection from '../Connection/Connection.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'

export const notModifiedResponse = {
  absolutePath: '',
  status: HttpStatusCode.NotModifed,
  headers: {
    [HttpHeader.Connection]: Connection.Close,
  },
}
