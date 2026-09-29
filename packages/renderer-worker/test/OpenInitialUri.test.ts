import { beforeEach, expect, jest, test } from '@jest/globals'

const Command = await import('../src/parts/Command/Command.js')
const OpenInitialUri = await import('../src/parts/OpenInitialUri/OpenInitialUri.js')
const openUri = jest.fn()

Command.register('Main.openUri', openUri)

beforeEach(() => {
  jest.clearAllMocks()
})

test('openInitialUri opens the file supplied in the application URL', async () => {
  const uri = 'file:///tmp/example file.txt'
  const url = new URL('lvce-oss://-/')
  url.searchParams.set('openUri', uri)

  await OpenInitialUri.openInitialUri(url.href)

  expect(openUri).toHaveBeenCalledTimes(1)
  expect(openUri).toHaveBeenCalledWith(uri)
})

test('openInitialUri does nothing when no file was supplied', async () => {
  await OpenInitialUri.openInitialUri('lvce-oss://-/')

  expect(openUri).not.toHaveBeenCalled()
})
