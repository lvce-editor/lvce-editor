import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const getContentResponse = async (content: any, headers: any = {}, status = HttpStatusCode.Ok): Promise<any> => {
  return {
    body: content,
    init: {
      headers,
      status,
    },
  }
}
