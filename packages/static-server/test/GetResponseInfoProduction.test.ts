import { expect, test } from '@jest/globals'
import * as GetResponseInfoProduction from '../src/parts/GetResponseInfoProduction/GetResponseInfoProduction.ts'
import * as HttpHeader from '../src/parts/HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.ts'

const normalizePath = (path: string): string => path.replaceAll('\\', '/')
const staticIndexHtmlPattern = /\/static\/(?:chat|board)\/index\.html$/

test('returns config etag for head request in production', () => {
  const response = GetResponseInfoProduction.getResponseInfoProduction({
    headers: {},
    method: 'HEAD',
    url: '/',
  })

  expect(response).toEqual({
    absolutePath: expect.any(String),
    headers: {
      'Content-Type': 'abc',
      Etag: 'W/123',
    },
    status: HttpStatusCode.Ok,
  })
})

test('returns 304 with config etag header for conditional head request in production', () => {
  const response = GetResponseInfoProduction.getResponseInfoProduction({
    headers: {
      [HttpHeader.IfNotMatch]: 'W/123',
    },
    method: 'HEAD',
    url: '/',
  })

  expect(response).toEqual({
    absolutePath: '',
    headers: {
      [HttpHeader.Etag]: 'W/123',
    },
    status: HttpStatusCode.NotModifed,
  })
})

test('returns 200 for oauth callback route with query params in production', () => {
  const response = GetResponseInfoProduction.getResponseInfoProduction({
    headers: {},
    method: 'GET',
    url: '/auth/callback?code=code-1&state=state-1',
  })

  expect(normalizePath(response.absolutePath)).toContain('/static/auth/callback.html')
  expect(response).toEqual({
    absolutePath: expect.any(String),
    headers: {
      'Content-Type': 'abc',
      Etag: 'W/123',
    },
    status: HttpStatusCode.Ok,
  })
})

test.each(['/board', '/prefix/board/', '/chat'])('returns 200 for app route %s in production', (url) => {
  const response = GetResponseInfoProduction.getResponseInfoProduction({
    headers: {},
    method: 'GET',
    url,
  })

  expect(response.status).toBe(HttpStatusCode.Ok)
  expect(normalizePath(response.absolutePath)).toMatch(staticIndexHtmlPattern)
})
