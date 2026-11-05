import { beforeEach, expect, jest, test } from '@jest/globals'

const Command = await import('../src/parts/Command/Command.js')
const getAccounts = jest.fn<() => Promise<unknown[]>>()
const connect = jest.fn<(...args: readonly unknown[]) => Promise<void>>()
const notify = jest.fn<(...args: readonly unknown[]) => Promise<void>>()
const signIn = jest.fn<() => Promise<void>>()
const OpenInitialUri = await import('../src/parts/OpenInitialUri/OpenInitialUri.js')
const openUri = jest.fn()

Command.register('Main.openUri', openUri)
Command.register('Layout.signIn', signIn)
Command.register('Authentication.getAccounts', getAccounts)
Command.register('ExtensionHost.executeCommand', connect)
Command.register('Notification.create', notify)

beforeEach(() => {
  jest.resetAllMocks()
  getAccounts.mockResolvedValue([{ active: true, signedIn: true }])
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

test('launches the selected remote machine instead of opening a file tab', async () => {
  await OpenInitialUri.openInitialUri('https://example.com/editor/?remoteServer=second.test&openUri=file:///ignored.txt')
  expect(connect).toHaveBeenCalledWith('remote-server.connectAccount', 'second.test')
  expect(openUri).not.toHaveBeenCalled()
  expect(signIn).not.toHaveBeenCalled()
})

test('continues to the selected machine after signing in', async () => {
  getAccounts.mockResolvedValueOnce([])
  await OpenInitialUri.openInitialUri('https://example.com/editor/?remoteServer=second.test')
  expect(signIn).toHaveBeenCalledTimes(1)
  expect(connect).toHaveBeenCalledWith('remote-server.connectAccount', 'second.test')
})

test('cancelled sign-in explains how to retry the retained launch URL', async () => {
  getAccounts.mockResolvedValue([])
  await OpenInitialUri.openInitialUri('https://example.com/editor/?remoteServer=second.test')
  expect(connect).not.toHaveBeenCalled()
  expect(notify).toHaveBeenCalledWith('error', expect.stringContaining('reload this page'))
})

test.each(['', 'user@host.test', 'host.test/path', 'host.test?token=secret'])(
  'rejects invalid remote target %s before signing in',
  async (hostname) => {
    const url = new URL('https://example.com/editor/')
    url.searchParams.set('remoteServer', hostname)
    await OpenInitialUri.openInitialUri(url.href)
    expect(connect).not.toHaveBeenCalled()
    expect(signIn).not.toHaveBeenCalled()
    expect(notify).toHaveBeenCalledWith('error', expect.stringContaining('Invalid remote hostname'))
  },
)

test('remote failures are visible and do not abort startup', async () => {
  connect.mockRejectedValue(new Error('Update and restart this remote server'))
  await OpenInitialUri.openInitialUri('https://example.com/editor/?remoteServer=second.test')
  expect(notify).toHaveBeenCalledWith('error', expect.stringContaining('Update and restart'))
})
