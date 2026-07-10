import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const getNotModifiedResponse = async (headers: any = {}): Promise<any> => {
  return {
    body: '',
    init: {
      headers,
      status: HttpStatusCode.NotModifed,
    },
  }
}
