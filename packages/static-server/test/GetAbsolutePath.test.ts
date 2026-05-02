import { expect, test } from '@jest/globals'
import * as GetAbsolutePath from '../src/parts/GetAbsolutePath/GetAbsolutePath.js'
import * as GetResponseInfo from '../src/parts/GetResponseInfo/GetResponseInfo.js'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.js'

const normalizePath = (path) => path.replaceAll('\\', '/')

test('maps /icons requests to renderer-worker vscode icons package', () => {
  const absolutePath = GetAbsolutePath.getAbsolutePath('/icons/chevron-right.svg')

  expect(normalizePath(absolutePath)).toContain('/@vscode/codicons/src/icons/chevron-right.svg')
})

test('maps /static/icons requests to renderer-worker vscode icons package', () => {
  const absolutePath = GetAbsolutePath.getAbsolutePath('/static/icons/chevron-right.svg')

  expect(normalizePath(absolutePath)).toContain('/@vscode/codicons/src/icons/chevron-right.svg')
})

test('falls back to static/icons for non-codicon assets', () => {
  const absolutePath = GetAbsolutePath.getAbsolutePath('/icons/squiggly-error.svg')

  expect(normalizePath(absolutePath)).toContain('/static/icons/squiggly-error.svg')
})

test('maps oauth callback route to index html', () => {
  const absolutePath = GetAbsolutePath.getAbsolutePath('/auth/callback')

  expect(normalizePath(absolutePath)).toContain('/static/index.html')
})

test('returns 200 for oauth callback route with query params', async () => {
  const response = await GetResponseInfo.getResponseInfo({
    request: {
      headers: {},
      method: 'GET',
      url: '/auth/callback?code=code-1&state=state-1',
    },
    isImmutable: false,
  })

  expect(response.status).toBe(HttpStatusCode.Ok)
})

test('returns 404 for missing vscode icon in development', async () => {
  const response = await GetResponseInfo.getResponseInfo({
    request: {
      method: 'GET',
      url: '/icons/__missing__.svg',
    },
    isImmutable: false,
  })

  expect(response).toEqual({
    absolutePath: '',
    status: HttpStatusCode.NotFound,
    headers: {},
  })
})
