import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const getMultipleChoiceResponse = async (content: any, headers: any = {}): Promise<any> => {
  return {
    body: content,
    init: {
      status: HttpStatusCode.MultipleChoices,
      headers,
    },
  }
}
