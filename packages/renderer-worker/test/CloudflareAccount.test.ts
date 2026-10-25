import { afterEach, expect, jest, test } from '@jest/globals'
import { createAccountClient } from '../src/parts/Cloudflare/RemoteAccountClient.ts'
const invoke = jest.fn<(...args: readonly unknown[]) => Promise<string>>()
const getAccounts = jest.fn<() => Promise<readonly { active: boolean; signedIn: boolean; id: string }[]>>()
const fetchRequest = jest.fn<typeof fetch>()
const Cloudflare = createAccountClient({ backendUrl: () => settings.backendUrl, fetch: fetchRequest, getAccounts, getToken: invoke })
const settings = { backendUrl: 'https://backend.test' }
afterEach(() => {
  Cloudflare.resume()
  jest.restoreAllMocks()
  jest.resetAllMocks()
  settings.backendUrl = 'https://backend.test'
})
const signedIn = (): void => {
  settings.backendUrl = 'https://backend.test'
  invoke.mockResolvedValue('lvce-access-token')
  getAccounts.mockResolvedValue([{ active: true, id: 'owner', signedIn: true }])
}
test('account authorization uses the signed-in identity without sending its access token to the gateway', async () => {
  signedIn()
  const fetchSpy = fetchRequest.mockResolvedValue(Response.json({ authorization: 'one-use-grant', publicUrl: 'https://remote.test' }))
  await expect(Cloudflare.authorizeBrowser('remote.test')).resolves.toEqual({
    accountId: 'owner',
    authorization: 'one-use-grant',
    publicUrl: 'https://remote.test',
  })
  expect(fetchSpy).toHaveBeenCalledTimes(1)
  expect(fetchSpy).toHaveBeenCalledWith(
    new URL('https://backend.test/cloudflare/browser-session'),
    expect.objectContaining({
      body: JSON.stringify({ hostname: 'remote.test' }),
      headers: { Authorization: 'Bearer lvce-access-token', 'Content-Type': 'application/json' },
      method: 'POST',
      redirect: 'error',
    }),
  )
})
test('signed-out, wrong-owner and outdated-server errors are actionable', async () => {
  signedIn()
  const fetchSpy = fetchRequest
  invoke.mockResolvedValue('')
  await expect(Cloudflare.getMachines()).rejects.toThrow('Sign in')
  expect(fetchSpy).not.toHaveBeenCalled()
  invoke.mockResolvedValue('lvce-access-token')
  fetchSpy.mockResolvedValue(new Response(null, { status: 403 }))
  await expect(Cloudflare.authorizeBrowser('remote.test')).rejects.toThrow('does not belong')
  fetchSpy.mockResolvedValue(Response.json({ error: 'Insufficient scope' }, { status: 403 }))
  await expect(Cloudflare.authorizeBrowser('remote.test')).rejects.toThrow('Sign out of LVCE')
  fetchSpy.mockResolvedValue(new Response(null, { status: 409 }))
  await expect(Cloudflare.authorizeBrowser('remote.test')).rejects.toThrow('restart')
})
test('switching accounts during authorization discards the response', async () => {
  signedIn()
  fetchRequest.mockImplementation(async () => {
    invoke.mockResolvedValue('different-account-token')
    return Response.json({ authorization: 'old-user-grant' })
  })
  await expect(Cloudflare.authorizeBrowser('remote.test')).rejects.toThrow('account changed')
})
test('rejects unsafe backend URLs before accessing account secrets', async () => {
  signedIn()
  settings.backendUrl = new URL('https://public.test').href.replace('https:', 'http:')
  await expect(Cloudflare.getMachines()).rejects.toThrow('HTTPS')
  expect(invoke).not.toHaveBeenCalled()
})

test('network failures cross the worker boundary as a plain actionable error', async () => {
  signedIn()
  fetchRequest.mockRejectedValue(new DOMException('failed', 'NetworkError'))
  await expect(Cloudflare.getMachines()).rejects.toThrow('Could not reach the LVCE account backend')
})

test('account changes block authorization but still allow identifying a saved session for revocation', async () => {
  signedIn()
  Cloudflare.suspend()
  await expect(Cloudflare.getMachines()).rejects.toThrow('account is changing')
  await expect(Cloudflare.authorizeBrowser('remote.test')).rejects.toThrow('account is changing')
  await expect(Cloudflare.getAccountId()).resolves.toBe('owner')
  expect(fetchRequest).not.toHaveBeenCalled()
  Cloudflare.resume()
  fetchRequest.mockResolvedValue(Response.json({ machines: [] }))
  await expect(Cloudflare.getMachines()).resolves.toEqual({ machines: [] })
})

test('an authorization cannot outlive an account change even when the same account is selected again', async () => {
  signedIn()
  const entered = Promise.withResolvers<void>()
  const response = Promise.withResolvers<Response>()
  fetchRequest.mockImplementation(() => {
    entered.resolve()
    return response.promise
  })
  const pending = Cloudflare.authorizeBrowser('remote.test')
  await entered.promise
  Cloudflare.suspend()
  Cloudflare.resume()
  response.resolve(Response.json({ authorization: 'old-grant', publicUrl: 'https://remote.test' }))
  await expect(pending).rejects.toThrow('account is changing')
})

test('overlapping account operations keep authorization suspended until both finish', async () => {
  signedIn()
  Cloudflare.suspend()
  Cloudflare.suspend()
  try {
    Cloudflare.resume()
    await expect(Cloudflare.getMachines()).rejects.toThrow('account is changing')
  } finally {
    Cloudflare.resume()
  }
  fetchRequest.mockResolvedValue(Response.json({ machines: [] }))
  await expect(Cloudflare.getMachines()).resolves.toEqual({ machines: [] })
})

test('never sends an account token when its authentication backend changes while obtaining the token', async () => {
  signedIn()
  const entered = Promise.withResolvers<void>()
  const token = Promise.withResolvers<string>()
  invoke.mockImplementation(() => {
    entered.resolve()
    return token.promise
  })
  const pending = Cloudflare.getMachines()
  await entered.promise
  settings.backendUrl = 'https://different.test'
  token.resolve('original-backend-token')
  await expect(pending).rejects.toThrow('backend changed')
  expect(fetchRequest).not.toHaveBeenCalled()
})
