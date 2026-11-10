import { readFile } from 'node:fs/promises'
import { expect, test } from '@jest/globals'

const rendererSettingsUrl = new URL('../settings.json', import.meta.url)
const defaultSettingsUrl = new URL('../../../static/config/defaultSettings.json', import.meta.url)

test('cache cleanup is available as a boolean setting enabled by default', async () => {
  const rendererSettings = JSON.parse(await readFile(rendererSettingsUrl, 'utf8'))
  const cleanupSetting = rendererSettings.find(({ id }) => id === 'cache.cleanupEnabled')

  expect(cleanupSetting).toMatchObject({
    id: 'cache.cleanupEnabled',
    type: 'boolean',
    value: true,
  })

  const defaultSettings = JSON.parse(await readFile(defaultSettingsUrl, 'utf8'))
  expect(defaultSettings['cache.cleanupEnabled']).toBe(true)
})
