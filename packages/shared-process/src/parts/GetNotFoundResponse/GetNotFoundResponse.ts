import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const getNotFoundResponse = (): any => {
  return {
    body: 'not-found',
    init: {
      status: HttpStatusCode.NotFound,
      statusText: 'not-found',
      headers: {},
    },
  }
}
