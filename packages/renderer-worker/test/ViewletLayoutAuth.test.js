import { beforeEach, expect, jest, test } from '@jest/globals'

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

const AuthWorker = await import('../src/parts/AuthWorker/AuthWorker.js')
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
