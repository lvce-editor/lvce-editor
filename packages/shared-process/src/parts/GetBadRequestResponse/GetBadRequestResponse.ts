import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const getBadRequestResponse = (): any => {
  return {
    body: 'bad-request',
    init: {
      headers: {},
      status: HttpStatusCode.BadRequest,
      statusText: 'bad-request',
    },
  }
}
