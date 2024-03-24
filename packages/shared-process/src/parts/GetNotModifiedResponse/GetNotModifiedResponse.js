import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'

export const getNotModifiedResponse = async () => {
  return {
    body: '',
    init: {
      status: HttpStatusCode.NotModifed,
      headers: {},
    },
  }
}
