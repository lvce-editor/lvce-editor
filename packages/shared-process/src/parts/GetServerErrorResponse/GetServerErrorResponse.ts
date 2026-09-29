import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const getServerErrorResponse = (): any => {
  return {
    body: 'server-error',
    init: {
      headers: {},
      status: HttpStatusCode.ServerError,
      statusText: 'server-error',
    },
  }
}
