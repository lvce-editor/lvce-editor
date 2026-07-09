import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'

export const getMultipleChoiceResponse = async (content, headers = {}) => {
  return {
    body: content,
    init: {
      status: HttpStatusCode.MultipleChoices,
      headers,
    },
  }
}
