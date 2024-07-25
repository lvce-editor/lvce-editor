import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetModules()
})

jest.unstable_mockModule('../src/parts/GetElectronFileResponse/GetElectronFileResponse', () => {
  return {
    getElectronFileResponse: jest.fn(),
  }
})
jest.unstable_mockModule('../src/parts/HttpServerResponse/HttpServerResponse', () => {
  return {
    send: jest.fn(),
  }
})

const HandleRemoteRequest = await import('../src/parts/HandleRemoteRequest/HandleRemoteRequest.js')
const HandleSocketError = await import('../src/parts/HandleSocketError/HandleSocketError.js')

test('handleRemoteRequest - add socket error event listener', async () => {
  const socket = {
    isSocket: true,
    on: jest.fn(),
  }
  const request = {
    isRequest: true,
  }
  HandleRemoteRequest.handleRemoteRequest(socket, request)
  expect(socket.on).toHaveBeenCalledTimes(1)
  expect(socket.on).toHaveBeenCalledWith('error', HandleSocketError.handleSocketError)
})
