const { JsonParsingError } = require('../JsonParsingError/JsonParsingError.js')
const Assert = require('../Assert/Assert.js')

exports.parse = async (string, filePath = '') => {
  try {
    Assert.string(string)
    return JSON.parse(string)
  } catch (error) {
    const JsonError = require('../JsonError/JsonError.js')
    const errorProps = JsonError.getErrorPropsFromError(error, string, filePath)
    throw new JsonParsingError(errorProps.message, errorProps.codeFrame, errorProps.stack)
  }
}

exports.stringify = (value) => {
  return JSON.stringify(value, null, 2) + '\n'
}
