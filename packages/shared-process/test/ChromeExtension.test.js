import * as ChromeExtension from '../src/parts/ChromeExtension/ChromeExtension.js'

test('install - error - url is not of type string', async () => {
  await expect(ChromeExtension.install('abc', undefined)).rejects.toThrow(
    new Error(`Failed to install chrome extension abc: AssertionError: expected value to be of type string`),
  )
})

test('uninstall - error - name is not of type string', async () => {
  await expect(ChromeExtension.uninstall(undefined)).rejects.toThrow(
    new Error(`Failed to uninstall chrome extension undefined: AssertionError: expected value to be of type string`),
  )
})
