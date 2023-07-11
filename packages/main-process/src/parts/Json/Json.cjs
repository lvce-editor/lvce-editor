const Assert = require('../Assert/Assert.cjs')

exports.parse = async (string, filePath = '') => {
  try {
    Assert.string(string)
    return JSON.parse(string)
  } catch (error) {
    const JsonError = await import('../JsonError/JsonError.js')
    const errorProps = JsonError.getErrorPropsFromError(error, string, filePath)
    const { JsonParsingError } = await import('../JsonParsingError/JsonParsingError.js')
    throw new JsonParsingError(errorProps.message, errorProps.codeFrame, errorProps.stack)
  }
}

exports.stringify = (value) => {
  return JSON.stringify(value, null, 2) + '\n'
}
