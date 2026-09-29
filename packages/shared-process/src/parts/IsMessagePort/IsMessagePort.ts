export const isMessagePort = (value: any): any => {
  return value && value instanceof MessagePort
}
