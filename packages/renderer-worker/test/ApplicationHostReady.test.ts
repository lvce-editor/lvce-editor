import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Application/Application.ts', () => {
  throw new Error('Application services must not load before runtime configuration')
})

test('host readiness can be requested before runtime configuration without loading application services', async () => {
  const { commandMap } = await import('../src/parts/CommandMap/CommandMap.js')
  const { initialize } = await import('../src/parts/RuntimeConfig/RuntimeConfig.ts')
  const { markHostReady } = await import('../src/parts/ApplicationHostReady/ApplicationHostReady.ts')
  let completed = false
  const waiting = commandMap['Application.waitForHost']().then(() => {
    completed = true
  })
  await Promise.resolve()
  expect(completed).toBe(false)
  initialize({ assetDir: '/runtime/test', platform: 'web' })
  const { assetDir } = await import('../src/parts/AssetDir/AssetDir.js')
  expect(assetDir).toBe('/runtime/test')
  markHostReady()
  await expect(waiting).resolves.toBeUndefined()
  expect(completed).toBe(true)
})
