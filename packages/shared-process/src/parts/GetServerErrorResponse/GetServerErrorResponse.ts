import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const getServerErrorResponse = () => {
  return {
    body: 'server-error',
    init: {
      status: HttpStatusCode.ServerError,
      statusText: 'server-error',
      headers: {},
    },
  }
}
