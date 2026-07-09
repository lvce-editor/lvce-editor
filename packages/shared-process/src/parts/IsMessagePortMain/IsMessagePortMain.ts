export const isMessagePortMain = (value: any): any => {
  return value && value.constructor && value.constructor.name === 'MessagePortMain'
}
