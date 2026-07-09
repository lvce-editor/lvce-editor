import { Socket } from 'node:net'

export const isSocket = (value) => {
  return value instanceof Socket
}
