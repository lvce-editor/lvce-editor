import { expect, test } from '@jest/globals'
import * as GetResponseInfoProduction from '../src/parts/GetResponseInfoProduction/GetResponseInfoProduction.ts'
import * as HttpHeader from '../src/parts/HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'

const normalizePath = (path: string): string => path.replaceAll('\\', '/')

test('returns config etag for head request in production', () => {
  const response = GetResponseInfoProduction.getResponseInfoProduction({
    method: 'HEAD',
    headers: {},
    url: '/',
  })

  expect(response).toEqual({
    absolutePath: expect.any(String),
    status: HttpStatusCode.Ok,
    headers: {
      'Content-Type': 'abc',
      Etag: 'W/123',
    },
  })
})

test('returns 304 with config etag header for conditional head request in production', () => {
  const response = GetResponseInfoProduction.getResponseInfoProduction({
    method: 'HEAD',
    headers: {
      [HttpHeader.IfNotMatch]: 'W/123',
    },
    url: '/',
  })

  expect(response).toEqual({
    absolutePath: '',
    status: HttpStatusCode.NotModifed,
    headers: {
      [HttpHeader.Etag]: 'W/123',
    },
  })
})

test('returns 200 for oauth callback route with query params in production', () => {
  const response = GetResponseInfoProduction.getResponseInfoProduction({
    method: 'GET',
    headers: {},
    url: '/auth/callback?code=code-1&state=state-1',
  })

  expect(normalizePath(response.absolutePath)).toContain('/static/auth/callback.html')
  expect(response).toEqual({
    absolutePath: expect.any(String),
    status: HttpStatusCode.Ok,
    headers: {
      'Content-Type': 'abc',
      Etag: 'W/123',
    },
  })
})
