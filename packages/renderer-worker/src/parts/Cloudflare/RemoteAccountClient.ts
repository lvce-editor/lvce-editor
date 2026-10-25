interface AccountSummary {
  readonly active: boolean
  readonly id: string
  readonly signedIn: boolean
}
interface AccountClientOptions {
  readonly backendUrl: () => string
  readonly fetch: typeof fetch
  readonly getAccounts: () => Promise<readonly AccountSummary[]>
  readonly getToken: (refresh?: boolean) => Promise<string>
}
interface AccountClient {
  readonly authorizeBrowser: (hostname: string) => Promise<unknown>
  readonly getAccountId: () => Promise<string>
  readonly getMachines: () => Promise<unknown>
}
const hostnamePattern = /^[a-z0-9.-]+$/
const getAccountError = async (response: { readonly status: number; readonly json: () => Promise<unknown> }): Promise<Error> => {
  if (response.status === 403) {
    let details: { readonly error?: string } = {}
    try {
      details = (await response.json()) as { readonly error?: string }
    } catch {
      /* Non-JSON errors have the generic ownership message. */
    }
    if (details.error === 'Insufficient scope')
      return new Error('Sign out of LVCE and sign in again to enable remote-machine access for your account.')
    return new Error('This remote machine does not belong to your active LVCE account, or tunnel access was removed.')
  }
  if (response.status === 409) return new Error('Update and restart the remote server to enable account connections.')
  if (response.status === 401) return new Error('Your LVCE sign-in expired. Sign in again.')
  return new Error(`Could not authorize the remote connection (HTTP ${response.status}). Retry when the backend is available.`)
}
export const createAccountClient = (options: AccountClientOptions): AccountClient => {
  const accountRequest = async (path: string, body?: unknown): Promise<unknown> => {
    const backendUrl = options.backendUrl()
    const endpoint = new URL(path, backendUrl)
    if (endpoint.protocol !== 'https:' && !(endpoint.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(endpoint.hostname)))
      throw new Error('Remote account connections require an HTTPS backend')
    if (endpoint.username || endpoint.password) throw new Error('Invalid authentication backend URL')
    const token = await options.getToken(true)
    if (!token) throw new Error('Sign in to your LVCE account in this browser, then run Remote Server: Connect from LVCE Account.')
    let response: Response
    try {
      response = await options.fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        method: body === undefined ? 'GET' : 'POST',
        ...(body !== undefined && { body: JSON.stringify(body) }),
        redirect: 'error',
        signal: AbortSignal.timeout(15_000),
      })
    } catch {
      throw new Error('Could not reach the LVCE account backend. Check your network and retry connecting.')
    }
    if (!response.ok) throw await getAccountError(response)
    // Account switches during a request must not install the previous identity's session.
    if ((await options.getToken()) !== token) throw new Error('Active LVCE account changed. Connect again.')
    return response.json()
  }

  const getMachines = async (): Promise<unknown> => accountRequest('/cloudflare/status')
  const authorizeBrowser = async (hostname: string): Promise<unknown> => {
    if (typeof hostname !== 'string' || hostname.length > 253 || !hostnamePattern.test(hostname)) throw new Error('Invalid remote hostname')
    const accountId = await getAccountId()
    const grant = (await accountRequest('/cloudflare/browser-session', { hostname })) as object
    if (!accountId || (await getAccountId()) !== accountId) throw new Error('Active LVCE account changed. Connect again.')
    return { ...grant, accountId }
  }
  const getAccountId = async (): Promise<string> => {
    if (!(await options.getToken(true))) return ''
    const accounts = await options.getAccounts()
    return accounts.find((account) => account.active && account.signedIn)?.id || ''
  }

  return { authorizeBrowser, getAccountId, getMachines }
}
