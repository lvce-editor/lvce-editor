import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'

export const getMultipleChoiceResponse = async (content, headers = {}) => {
  return {
    body: content,
    init: {
      status: HttpStatusCode.MultipleChoices,
      headers,
    },
  }
}
