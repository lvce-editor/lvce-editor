exports.isMessagePortMain = (value) => {
  return value && value.constructor && value.constructor.name === 'MessagePortMain'
}
