export const isMessagePort = (value) => {
  return value && value.constructor && value.constructor.name === 'MessagePortMain'
}
