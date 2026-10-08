import { expect, jest, test } from '@jest/globals'

const userInfo = {
  authAccessToken: 'selected-account-token',
  authErrorMessage: '',
  userName: 'User A',
  userState: 'loggedIn',
}

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(async () => userInfo),
}))

const Command = await import('../src/parts/Command/Command.js')
const WorkerViewletAdapterMap = await import('../src/parts/WorkerViewletAdapterMap/WorkerViewletAdapterMap.js')

test('chat view uses the selected account and initializes its auth state on load', async () => {
  const adapter = WorkerViewletAdapterMap.getWorkerViewletAdapter('chatView')
  const worker = { invoke: jest.fn(async (..._args) => undefined) }

  await adapter.afterLoadContent({ state: { uid: 19 }, worker })

  expect(worker.invoke).toHaveBeenNthCalledWith(1, 'Chat.setUseAuthWorker', 19, true, false)
  expect(Command.execute).toHaveBeenCalledWith('Layout.getUserInfo', { includeAccessToken: true })
  expect(worker.invoke).toHaveBeenNthCalledWith(2, 'Chat.handleAuthStateChange', 19, userInfo)
})
