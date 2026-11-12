import { expect, jest, test } from '@jest/globals'

const getCommands = jest
  .fn<(assetDir: string, platform: number, applicationId?: string) => Promise<{ id: string }[]>>()
  .mockResolvedValue([{ id: 'chat2.toggleAiNativeLayout' }, { id: 'chat2.showBoardLayout' }, { id: 'chat2.showAiNativeLayout' }])
jest.unstable_mockModule('../src/parts/ExtensionHost/ExtensionHostCommands.js', () => ({ getCommands }))
const execute = jest.fn<(...args: unknown[]) => Promise<void>>().mockResolvedValue(undefined)
jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute }))
const AiNativeLayout = await import('../src/parts/AiNativeLayout/AiNativeLayout.ts')
const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')

test('activity bar wheel only enters upwards and exits downwards, suppressing repeated gesture events', async () => {
  const state = ViewletLayout.create(1)
  jest.useFakeTimers({ now: 10000 })
  try {
    await AiNativeLayout.handleActivityBarWheel(state, 10)
    expect(execute).not.toHaveBeenCalled()
    await AiNativeLayout.handleActivityBarWheel(state, -10)
    await AiNativeLayout.handleActivityBarWheel(state, -10)
    expect(execute).toHaveBeenCalledTimes(1)
    expect(getCommands).toHaveBeenCalledWith(state.assetDir, state.platform, state.applicationId)
    jest.advanceTimersByTime(100)
    await AiNativeLayout.handleActivityBarWheel({ ...state, aiNativeLayout: true }, -10)
    expect(execute).toHaveBeenCalledTimes(1)
    await AiNativeLayout.handleActivityBarWheel({ ...state, aiNativeLayout: true }, 10)
    expect(execute).toHaveBeenCalledTimes(2)
    expect(execute).toHaveBeenLastCalledWith('ExtensionHost.executeCommand', 'chat2.toggleAiNativeLayout')
  } finally {
    jest.useRealTimers()
  }
})

test('ignores layout gestures when the extension does not contribute the toggle', async () => {
  getCommands.mockResolvedValueOnce([])
  execute.mockClear()
  const state = ViewletLayout.create(2)
  jest.useFakeTimers({ now: 20000 })
  try {
    expect(await AiNativeLayout.handleActivityBarWheel(state, -100)).toBe(state)
    expect(execute).not.toHaveBeenCalled()
  } finally {
    jest.useRealTimers()
  }
})

test('two upward gestures reach boards and downward gestures return through chat to IDE', async () => {
  const state = ViewletLayout.create(3)
  execute.mockClear()
  jest.useFakeTimers({ now: 30000 })
  try {
    await AiNativeLayout.handleActivityBarWheel(state, -20)
    expect(execute).toHaveBeenLastCalledWith('ExtensionHost.executeCommand', 'chat2.toggleAiNativeLayout')
    const chat = { ...state, aiNativeLayout: true, sideBarView: 'chat2.views.chat' }
    jest.advanceTimersByTime(100)
    await AiNativeLayout.handleActivityBarWheel(chat, -20)
    expect(execute).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(700)
    await AiNativeLayout.handleActivityBarWheel(chat, -20)
    expect(execute).toHaveBeenLastCalledWith('ExtensionHost.executeCommand', 'chat2.showBoardLayout')
    const board = { ...chat, sideBarView: 'chat2.views.board' }
    jest.advanceTimersByTime(800)
    await AiNativeLayout.handleActivityBarWheel(board, -20)
    expect(execute).toHaveBeenCalledTimes(2)
    await AiNativeLayout.handleActivityBarWheel(board, 20)
    expect(execute).toHaveBeenLastCalledWith('ExtensionHost.executeCommand', 'chat2.showAiNativeLayout')
    jest.advanceTimersByTime(800)
    await AiNativeLayout.handleActivityBarWheel(chat, 20)
    expect(execute).toHaveBeenLastCalledWith('ExtensionHost.executeCommand', 'chat2.toggleAiNativeLayout')
  } finally {
    jest.useRealTimers()
  }
})

test('continuous wheel bursts require a quiet gap before the next layout', async () => {
  execute.mockClear()
  const state = ViewletLayout.create(4)
  const chat = { ...state, aiNativeLayout: true, sideBarView: 'chat2.views.chat' }
  jest.useFakeTimers({ now: 40000 })
  try {
    await AiNativeLayout.handleActivityBarWheel(state, -10)
    for (let index = 0; index < 4; index++) {
      jest.advanceTimersByTime(400)
      await AiNativeLayout.handleActivityBarWheel(chat, -10)
    }
    expect(execute).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(700)
    await AiNativeLayout.handleActivityBarWheel(chat, -10)
    expect(execute).toHaveBeenCalledTimes(2)
    expect(execute).toHaveBeenLastCalledWith('ExtensionHost.executeCommand', 'chat2.showBoardLayout')
  } finally {
    jest.useRealTimers()
  }
})
