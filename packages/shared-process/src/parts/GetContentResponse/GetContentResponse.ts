import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const getContentResponse = async (content, headers = {}) => {
  return {
    body: content,
    init: {
      status: HttpStatusCode.Ok,
      headers,
    },
  }
}
