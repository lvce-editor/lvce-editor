import { expect, jest, test } from '@jest/globals'
import { Writable } from 'node:stream'
import * as HttpServerResponse from '../src/parts/HttpServerResponse/HttpServerResponse.js'
import { setTimeout } from 'node:timers/promises'

test('send', () => {
  const request = {}
  let output = ''
  const socket = new Writable({
    write(chunk, encoding, callback) {
      output += chunk
      callback()
    },
  })
  const result = {
    init: {
      status: 200,
      headers: {},
    },
  }
  HttpServerResponse.send(request, socket, result)
  expect(output).toContain(`HTTP/1.1 200 OK`)
  expect(output).toContain('Connection: close')
})

test('send - error response', () => {
  const request = {}
  let output = ''
  const socket = new Writable({
    write(chunk, encoding, callback) {
      output += chunk
      callback()
    },
  })
  const result = {
    init: {
      status: 404,
      headers: {},
    },
  }
  HttpServerResponse.send(request, socket, result)
  expect(output).toContain(`HTTP/1.1 404 Not Found`)
  expect(output).toContain('Connection: close')
})

test('send - epipe error', async () => {
  const request = {}
  let output = ''
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  const socket = new Writable({
    write(chunk, encoding, callback) {
      const error = new Error('write EPIPE')
      // @ts-ignore
      error.code = 'EPIPE'
      callback(error)
    },
  })
  const result = {
    init: {
      status: 200,
      headers: {},
    },
  }
  HttpServerResponse.send(request, socket, result)
  expect(output).toBe(``)
  await setTimeout(0)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(`[shared-process] Failed to send response Error: write EPIPE`)
})
