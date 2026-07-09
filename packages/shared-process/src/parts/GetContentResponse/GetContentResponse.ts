import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const getContentResponse = async (content: any, headers: any = {}): Promise<any> => {
  return {
    body: content,
    init: {
      status: HttpStatusCode.Ok,
      headers,
    },
  }
}
