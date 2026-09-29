import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/AuthWorker/AuthWorker.js', () => {
  return {
    initialize: jest.fn(() => {
      throw new Error('not implemented')
    }),
    signIn: jest.fn(() => {
      throw new Error('not implemented')
    }),
    signOut: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/ActivityBarWorker/ActivityBarWorker.js', () => {
  return {
    invoke: jest.fn(async (command) => {
      switch (command) {
        case 'ActivityBar.diff2':
          return [1]
        case 'ActivityBar.render2':
          return [['ActivityBar.rendered']]
        default:
          return undefined
      }
    }),
  }
})

jest.unstable_mockModule('../src/parts/ChatViewWorker/ChatViewWorker.js', () => {
  return {
    invoke: jest.fn(async (command) => {
      switch (command) {
        case 'Chat.diff2':
          return [1]
        case 'Chat.render2':
          return [['Chat.rendered']]
        default:
          return undefined
      }
    }),
  }
})

jest.unstable_mockModule('../src/parts/Location/Location.js', () => {
  return {
    getHref: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Command = await import('../src/parts/Command/Command.js')
const AuthWorker = await import('../src/parts/AuthWorker/AuthWorker.js')
const ActivityBarWorker = await import('../src/parts/ActivityBarWorker/ActivityBarWorker.js')
const ChatViewWorker = await import('../src/parts/ChatViewWorker/ChatViewWorker.js')
const Location = await import('../src/parts/Location/Location.js')
const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('create initializes auth state', () => {
  const state = ViewletLayout.create(1)

  expect(ViewletLayout.getAuthState(state)).toEqual({
    accessToken: '',
    signInState: 'loggedOut',
    userName: '',
  })
})

test('setAuthState merges startup auth state into layout state', async () => {
  const state = ViewletLayout.create(1)

  const result = await ViewletLayout.setAuthState(state, {
    authAccessToken: 'token-1',
    authErrorMessage: '',
    userName: 'Test User',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 42,
  })

  expect(result).toEqual({
    commands: [],
    newState: {
      ...state,
      authErrorMessage: '',
      userName: 'Test User',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 42,
    },
  })
})

test('setAuthState accepts public auth state shape', async () => {
  const state = ViewletLayout.create(1)

  const result = await ViewletLayout.setAuthState(state, {
    accessToken: 'token-2',
    signInState: 'loggedIn',
    userName: 'Another User',
  })

  expect(result).toEqual({
    commands: [],
    newState: {
      ...state,
      authErrorMessage: '',
      userName: 'Another User',
      userState: 'loggedIn',
      userSubscriptionPlan: '',
      userUsedTokens: 0,
    },
  })
})

test('getUserInfo returns the public auth snapshot without the access token', () => {
  const state = {
    ...ViewletLayout.create(1),
    authErrorMessage: 'error',
    userName: 'Test User',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 42,
  }

  expect(ViewletLayout.getUserInfo(state)).toEqual({
    authErrorMessage: 'error',
    userName: 'Test User',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 42,
  })
})

test('getUserInfo can omit auth access token and token usage', () => {
  const state = {
    ...ViewletLayout.create(1),
    authErrorMessage: 'error',
    userName: 'Test User',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 42,
  }

  expect(
    ViewletLayout.getUserInfo(state, {
      includeAccessToken: false,
      includeTokenUsage: false,
    }),
  ).toEqual({
    authErrorMessage: 'error',
    userName: 'Test User',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
  })
})

test('openCommandPalette delegates to QuickPick.showCommands', async () => {
  const state = ViewletLayout.create(1)
  // @ts-ignore
  Command.execute.mockResolvedValue(undefined)

  const result = await ViewletLayout.openCommandPalette(state)

  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('QuickPick.showCommands')
  expect(result).toEqual({
    commands: [],
    newState: state,
  })
})

test('setAuthState fans auth changes out to activity bar and chat when visible', async () => {
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 2,
    secondarySideBarId: 3,
    secondarySideBarView: 'Chat',
  }

  const result = await ViewletLayout.setAuthState(state, {
    authAccessToken: 'token-1',
    authErrorMessage: '',
    userName: 'Test User',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 42,
  })

  expect(ActivityBarWorker.invoke).toHaveBeenCalledWith('ActivityBar.setUserLoginState', 2, 'logged in', {
    authErrorMessage: '',
    userName: 'Test User',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 42,
  })
  expect(ChatViewWorker.invoke).toHaveBeenCalledWith('Chat.handleAuthStateChange', 3, {
    authAccessToken: 'token-1',
    authErrorMessage: '',
    userName: 'Test User',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 42,
  })
  expect(Array.isArray(result.commands)).toBe(true)
})

test('refreshAuthState initializes auth on demand and merges the result', async () => {
  // @ts-ignore
  Location.getHref.mockResolvedValue('https://app.example/')
  // @ts-ignore
  AuthWorker.initialize.mockResolvedValue({
    authAccessToken: 'token-1',
    authErrorMessage: '',
    userName: 'Test User',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 42,
  })
  const state = {
    ...ViewletLayout.create(1),
    backendUrl: 'https://example.com/',
    platform: 1,
  }

  const result = await ViewletLayout.refreshAuthState(state)

  expect(Location.getHref).toHaveBeenCalledTimes(1)
  expect(AuthWorker.initialize).toHaveBeenCalledTimes(1)
  expect(AuthWorker.initialize).toHaveBeenCalledWith('https://example.com/', 1, 'https://app.example/')
  expect(result).toEqual({
    commands: [],
    newState: {
      ...state,
      authErrorMessage: '',
      userName: 'Test User',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 42,
    },
  })
})

test('signIn merges auth worker state into layout state', async () => {
  // @ts-ignore
  AuthWorker.signIn.mockResolvedValue({
    authAccessToken: 'token-1',
    authErrorMessage: '',
    userName: 'Test User',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 42,
  })

  const state = {
    ...ViewletLayout.create(1),
    backendUrl: 'https://example.com/',
    platform: 1,
  }

  const result = await ViewletLayout.signIn(state)

  expect(AuthWorker.signIn).toHaveBeenCalledTimes(1)
  expect(AuthWorker.signIn).toHaveBeenCalledWith('https://example.com/', 1)
  expect(result).toEqual({
    commands: [],
    newState: {
      ...state,
      authErrorMessage: '',
      userName: 'Test User',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 42,
    },
  })
})

test('signIn immediately explains the external browser flow on Electron', async () => {
  const authResult = Promise.withResolvers<any>()
  // @ts-ignore
  AuthWorker.signIn.mockReturnValue(authResult.promise)
  // @ts-ignore
  Command.execute.mockResolvedValue(undefined)
  const state = {
    ...ViewletLayout.create(1),
    backendUrl: 'https://example.com/',
    platform: PlatformType.Electron,
  }

  const signInPromise = ViewletLayout.signIn(state)
  await Promise.resolve()
  await Promise.resolve()

  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'Notification.create',
    'info',
    'Continue signing in in your browser. If it did not open, check your system default browser settings.',
  )
  expect(AuthWorker.signIn).toHaveBeenCalledWith('https://example.com/', PlatformType.Electron)

  authResult.resolve({
    authErrorMessage: '',
    userState: 'loggedOut',
  })
  await signInPromise
})

test('signIn shows an auth worker error', async () => {
  // @ts-ignore
  AuthWorker.signIn.mockResolvedValue({
    authErrorMessage: 'Could not open the browser.',
    userState: 'loggedOut',
  })
  // @ts-ignore
  Command.execute.mockResolvedValue(undefined)
  const state = {
    ...ViewletLayout.create(1),
    backendUrl: 'https://example.com/',
    platform: PlatformType.Web,
  }

  await ViewletLayout.signIn(state)

  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('Notification.create', 'error', 'Could not open the browser.')
})

test('signOut merges logged out auth state into layout state', async () => {
  // @ts-ignore
  AuthWorker.signOut.mockResolvedValue({
    authAccessToken: '',
    authErrorMessage: '',
    userName: '',
    userState: 'loggedOut',
    userSubscriptionPlan: '',
    userUsedTokens: 0,
  })

  const state = {
    ...ViewletLayout.create(1),
    backendUrl: 'https://example.com/',
    authErrorMessage: '',
    userName: 'Test User',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 42,
  }

  const result = await ViewletLayout.signOut(state)

  expect(AuthWorker.signOut).toHaveBeenCalledTimes(1)
  expect(AuthWorker.signOut).toHaveBeenCalledWith('https://example.com/')
  expect(result).toEqual({
    commands: [],
    newState: {
      ...state,

      authErrorMessage: '',
      userName: '',
      userState: 'loggedOut',
      userSubscriptionPlan: '',
      userUsedTokens: 0,
    },
  })
})

test('signIn dismisses its browser notification only after authentication completes', async () => {
  const authResult = Promise.withResolvers<any>()
  jest.mocked(AuthWorker.signIn).mockReturnValue(authResult.promise)
  jest.mocked(Command.execute).mockResolvedValue('Notification-42' as never)
  const state = { ...ViewletLayout.create(1), platform: PlatformType.Electron }

  const pending = ViewletLayout.signIn(state)
  await Promise.resolve()
  await Promise.resolve()
  expect(Command.execute).not.toHaveBeenCalledWith('Notification.dispose', expect.anything())

  authResult.resolve({ userState: 'loggedIn', userName: 'Test User', authErrorMessage: '' })
  const result = await pending

  expect(result.newState.userState).toBe('loggedIn')
  expect(Command.execute).toHaveBeenLastCalledWith('Notification.dispose', 'Notification-42')
})

test('signIn removes the browser prompt before showing an authentication error', async () => {
  jest.mocked(AuthWorker.signIn).mockResolvedValue({ authErrorMessage: 'Login failed', userState: 'loggedOut' } as never)
  jest.mocked(Command.execute).mockResolvedValue('Notification-42' as never)

  await ViewletLayout.signIn({ ...ViewletLayout.create(1), platform: PlatformType.Electron })

  expect(Command.execute).toHaveBeenNthCalledWith(2, 'Notification.dispose', 'Notification-42')
  expect(Command.execute).toHaveBeenNthCalledWith(3, 'Notification.create', 'error', 'Login failed')
})

test('signIn cleans up the browser prompt when the auth worker rejects', async () => {
  jest.mocked(AuthWorker.signIn).mockRejectedValue(new Error('Worker closed') as never)
  jest.mocked(Command.execute).mockResolvedValue('Notification-42' as never)

  await expect(ViewletLayout.signIn({ ...ViewletLayout.create(1), platform: PlatformType.Electron })).rejects.toThrow('Worker closed')

  expect(Command.execute).toHaveBeenLastCalledWith('Notification.dispose', 'Notification-42')
})

test('notification cleanup failure does not discard successful authentication', async () => {
  jest.mocked(AuthWorker.signIn).mockResolvedValue({ userState: 'loggedIn', authErrorMessage: '' } as never)
  jest
    .mocked(Command.execute)
    .mockResolvedValueOnce('Notification-42' as never)
    .mockRejectedValueOnce(new Error('Renderer closed') as never)

  const result = await ViewletLayout.signIn({ ...ViewletLayout.create(1), platform: PlatformType.Electron })

  expect(result.newState.userState).toBe('loggedIn')
})

test('signIn continues when the browser notification cannot be created', async () => {
  jest.mocked(AuthWorker.signIn).mockResolvedValue({ userState: 'loggedIn', authErrorMessage: '' } as never)
  jest.mocked(Command.execute).mockRejectedValue(new Error('Notifications unavailable') as never)

  const result = await ViewletLayout.signIn({ ...ViewletLayout.create(1), platform: PlatformType.Electron })

  expect(result.newState.userState).toBe('loggedIn')
  expect(Command.execute).toHaveBeenCalledTimes(1)
})
