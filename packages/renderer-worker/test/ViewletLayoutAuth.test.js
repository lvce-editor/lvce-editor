import { beforeEach, expect, jest, test } from '@jest/globals'

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

const Command = await import('../src/parts/Command/Command.js')
const AuthWorker = await import('../src/parts/AuthWorker/AuthWorker.js')
const ActivityBarWorker = await import('../src/parts/ActivityBarWorker/ActivityBarWorker.js')
const ChatViewWorker = await import('../src/parts/ChatViewWorker/ChatViewWorker.js')
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
      authAccessToken: 'token-1',
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
      authAccessToken: 'token-2',
      authErrorMessage: '',
      userName: 'Another User',
      userState: 'loggedIn',
      userSubscriptionPlan: '',
      userUsedTokens: 0,
    },
  })
})

test('getUserInfo returns the full auth snapshot from layout state', () => {
  const state = {
    ...ViewletLayout.create(1),
    authAccessToken: 'token-1',
    authErrorMessage: 'error',
    userName: 'Test User',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 42,
  }

  expect(ViewletLayout.getUserInfo(state)).toEqual({
    authAccessToken: 'token-1',
    authErrorMessage: 'error',
    userName: 'Test User',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 42,
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

  expect(ActivityBarWorker.invoke).toHaveBeenCalledWith('ActivityBar.setUserLoginState', 2, 'logged in')
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
      authAccessToken: 'token-1',
      authErrorMessage: '',
      userName: 'Test User',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 42,
    },
  })
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
    authAccessToken: 'token-1',
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
      authAccessToken: '',
      authErrorMessage: '',
      userName: '',
      userState: 'loggedOut',
      userSubscriptionPlan: '',
      userUsedTokens: 0,
    },
  })
})
