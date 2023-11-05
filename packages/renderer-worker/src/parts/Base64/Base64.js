import * as LoadJsBase64 from '../LoadJsBase64/LoadJsBase64.js'

export const decode = async (encoded) => {
  const JsBase64 = await LoadJsBase64.loadJsBase64()
  const decoded = JsBase64.decode(encoded)
  return decoded
}

// TODO figure out if btoa could be a faster alternative to this
export const encode = async (content) => {
  const JsBase64 = await LoadJsBase64.loadJsBase64()
  const encoded = JsBase64.encode(content)
  return encoded
}
