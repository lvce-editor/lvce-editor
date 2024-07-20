import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'

export const getNotModifiedResponse = async (headers = {}) => {
  return {
    body: '',
    init: {
      status: HttpStatusCode.NotModifed,
      headers,
    },
  }
}
