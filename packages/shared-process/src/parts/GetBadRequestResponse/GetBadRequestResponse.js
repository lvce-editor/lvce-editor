import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'

export const getBadRequestResponse = () => {
  return {
    body: 'bad-request',
    init: {
      status: HttpStatusCode.BadRequest,
      statusText: 'bad-request',
      headers: {},
    },
  }
}
