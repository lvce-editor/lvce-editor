export const stringify = (value) => {
  return JSON.stringify(value, null, 2) + '\n'
}

export const parse = (content) => {
  // TODO use better json parse to throw more helpful error messages if json is invalid
  try {
    return JSON.parse(content)
  } catch (error) {
    throw new Error('failed to parse json', { cause: error })
  }
}
