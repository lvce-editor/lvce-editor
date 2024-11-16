import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'

export const getContentResponse = async (content, headers = {}) => {
  return {
    body: content,
    init: {
      status: HttpStatusCode.Ok,
      headers,
    },
  }
}
