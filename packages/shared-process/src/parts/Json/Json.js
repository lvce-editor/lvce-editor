// parsing error handling based on https://github.com/sindresorhus/parse-json/blob/main/index.js

export const parse = async (string, filePath) => {
  try {
    return JSON.parse(string)
  } catch (error) {
    const JsonError = await import('../JsonError/JsonError.js')
    const errorProps = JsonError.getErrorPropsFromError(error, string, filePath)
    const jsonError = new Error(errorProps.message)
    jsonError.stack = errorProps.stack
    // @ts-ignore
    jsonError.codeFrame = errorProps.codeFrame
    throw jsonError
  }
}

export const stringify = (value) => {
  return JSON.stringify(value, null, 2) + '\n'
}
