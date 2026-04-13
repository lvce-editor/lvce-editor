import { expect, test } from '@jest/globals'
import * as GetAbsolutePath from '../src/parts/GetAbsolutePath/GetAbsolutePath.js'
import * as GetResponseInfo from '../src/parts/GetResponseInfo/GetResponseInfo.js'
import * as HttpStatusCode from '../src/parts/HttpStatusCode/HttpStatusCode.js'

test('maps /icons requests to renderer-worker vscode icons package', () => {
  const absolutePath = GetAbsolutePath.getAbsolutePath('/icons/chevron-right.svg')

  expect(absolutePath).toContain('/@vscode/codicons/src/icons/chevron-right.svg')
})

test('maps /static/icons requests to renderer-worker vscode icons package', () => {
  const absolutePath = GetAbsolutePath.getAbsolutePath('/static/icons/chevron-right.svg')

  expect(absolutePath).toContain('/@vscode/codicons/src/icons/chevron-right.svg')
})

test('falls back to static/icons for non-codicon assets', () => {
  const absolutePath = GetAbsolutePath.getAbsolutePath('/icons/squiggly-error.svg')

  expect(absolutePath).toContain('/static/icons/squiggly-error.svg')
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
