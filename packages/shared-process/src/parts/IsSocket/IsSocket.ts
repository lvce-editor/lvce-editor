import { Socket } from 'node:net'

export const isSocket = (value: any): any => {
  return value instanceof Socket
}
