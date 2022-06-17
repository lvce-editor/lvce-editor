import * as JsBase64 from '../../../../../static/js/js-base64.js'

export const decode = (encoded) => {
  const decoded = JsBase64.decode(encoded)
  return decoded
}
