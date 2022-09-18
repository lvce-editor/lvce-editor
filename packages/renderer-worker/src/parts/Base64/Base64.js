import * as JsBase64 from '../../../../../static/js/js-base64.js'

export const decode = (encoded) => {
  const decoded = JsBase64.decode(encoded)
  return decoded
}

// TODO figure out if btoa could be a faster alternative to this
export const encode = (content) => {
  const encoded = JsBase64.encode(content)
  return encoded
}
