exports.parse = (string) => {
  return JSON.parse(string)
}

exports.stringify = (value) => {
  return JSON.stringify(value, null, 2) + '\n'
}
