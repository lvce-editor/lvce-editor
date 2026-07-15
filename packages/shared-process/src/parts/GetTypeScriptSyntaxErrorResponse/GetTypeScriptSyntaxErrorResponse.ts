import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

const message = 'TypeScript file has a syntax error'

export const getTypeScriptSyntaxErrorResponse = (): any => {
  return {
    body: message,
    init: {
      headers: {},
      status: HttpStatusCode.UnprocessableContent,
      statusText: message,
    },
  }
}
