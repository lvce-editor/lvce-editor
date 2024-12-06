import { expect, test } from '@jest/globals'
import { Writable } from 'node:stream'
import * as HttpServerResponse from '../src/parts/HttpServerResponse/HttpServerResponse.js'

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
