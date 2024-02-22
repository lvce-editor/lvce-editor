import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'

export const getNotFoundResponse = () => {
  return {
    body: 'not-found',
    init: {
      status: HttpStatusCode.NotFound,
      statusText: 'not-found',
      headers: {},
    },
  }
}
