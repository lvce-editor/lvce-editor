import { expect, jest, test } from '@jest/globals'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as GetConfigJsonPath from '../src/parts/GetConfigJsonPath/GetConfigJsonPath.js'

test('development', () => {
  const getStaticPath = jest.fn<() => string>()
  const result = GetConfigJsonPath.getConfigJsonPath({
    getStaticPath,
    isBuiltServer: false,
    isProduction: false,
    root: '/test/app',
  })
  expect(result).toBe(pathToFileURL('/test/app/static/config.json').toString())
  expect(getStaticPath).not.toHaveBeenCalled()
})

test('electron production', () => {
  const getStaticPath = jest.fn<() => string>()
  const result = GetConfigJsonPath.getConfigJsonPath({
    getStaticPath,
    isBuiltServer: false,
    isProduction: true,
    root: '/test/app',
  })
  expect(result).toBe(pathToFileURL('/test/app/config.json').toString())
  expect(getStaticPath).not.toHaveBeenCalled()
})

test('server production', () => {
  const staticPath = join('/test', 'node_modules', '@lvce-editor', 'static-server', 'static')
  const getStaticPath = jest.fn(() => staticPath)
  const result = GetConfigJsonPath.getConfigJsonPath({
    getStaticPath,
    isBuiltServer: true,
    isProduction: true,
    root: '/test/node_modules/@lvce-editor/shared-process',
  })
  expect(result).toBe(pathToFileURL('/test/node_modules/@lvce-editor/static-server/config.json').toString())
  expect(getStaticPath).toHaveBeenCalledTimes(1)
})
