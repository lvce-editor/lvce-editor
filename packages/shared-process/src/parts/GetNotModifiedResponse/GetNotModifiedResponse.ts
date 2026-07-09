import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const getNotModifiedResponse = async (headers = {}) => {
  return {
    body: '',
    init: {
      status: HttpStatusCode.NotModifed,
      headers,
    },
  }
}
