import { afterEach, expect, jest, test } from '@jest/globals'
import { openConnections } from '../src/parts/Cloudflare/Cloudflare.ts'
import * as PreferencesState from '../src/parts/PreferencesState/PreferencesState.js'
import * as Product from '../src/parts/Product/Product.js'
import * as RendererFrameScheduler from '../src/parts/RendererFrameScheduler/RendererFrameScheduler.js'
afterEach(() => {
  PreferencesState.setAll({})
  RendererFrameScheduler.reset(undefined)
})
test('opens Cloudflare account settings on the configured backend', async () => {
  const invoke = jest.fn<(...args: unknown[]) => Promise<void>>(async () => undefined)
  RendererFrameScheduler.reset({ invoke })
  PreferencesState.set('layout.backendUrl', 'https://custom.example')
  await openConnections()
  expect(invoke).toHaveBeenLastCalledWith('Open.openUrl', 'https://custom.example/cloudflare', false)
  PreferencesState.setAll({})
  await openConnections()
  expect(invoke).toHaveBeenLastCalledWith('Open.openUrl', new URL('/cloudflare', Product.getBackendUrl()).href, false)
})
test('rejects insecure public backend and embedded credentials', async () => {
  const insecure = new URL('https://custom.example')
  insecure.protocol = 'http:'
  PreferencesState.set('layout.backendUrl', insecure.href)
  await expect(openConnections()).rejects.toThrow('HTTPS')
  PreferencesState.set('layout.backendUrl', 'https://user:secret@custom.example')
  await expect(openConnections()).rejects.toThrow('credentials')
})
