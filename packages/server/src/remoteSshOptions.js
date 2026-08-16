const defaultIdleTimeout = 3 * 60 * 60 * 1000

const getArgument = (argv, name) => {
  const prefix = `${name}=`
  const argument = argv.find((value) => value.startsWith(prefix))
  return argument ? argument.slice(prefix.length) : undefined
}

const parseInteger = (value, fallback, name) => {
  if (value === undefined) {
    return fallback
  }
  const parsed = Number.parseInt(value, 10)
  if (!Number.isSafeInteger(parsed)) {
    throw new TypeError(`${name} must be an integer`)
  }
  return parsed
}

export const getRemoteSshOptions = (argv, env = process.env) => {
  const enabled = argv.includes('--as-remote-ssh-server')
  if (!enabled) {
    return {
      enabled: false,
      host: env.HOST || 'localhost',
      idleTimeout: defaultIdleTimeout,
      port: parseInteger(env.PORT, 3000, 'PORT'),
      token: '',
    }
  }
  const token = getArgument(argv, '--connection-token') || env.LVCE_REMOTE_SSH_CONNECTION_TOKEN || ''
  if (!token) {
    throw new TypeError('Remote SSH server requires --connection-token')
  }
  const port = parseInteger(getArgument(argv, '--port') || env.PORT, 0, '--port')
  if (port < 0 || port > 65_535) {
    throw new RangeError('--port must be between 0 and 65535')
  }
  const idleTimeout = parseInteger(getArgument(argv, '--idle-timeout') || env.LVCE_REMOTE_SSH_IDLE_TIMEOUT, defaultIdleTimeout, '--idle-timeout')
  if (idleTimeout < 0) {
    throw new RangeError('--idle-timeout must not be negative')
  }
  return {
    enabled: true,
    host: '127.0.0.1',
    idleTimeout,
    port,
    token,
  }
}

export const isAuthenticatedRemoteRequest = (request, options) => {
  if (!options.enabled) {
    return false
  }
  try {
    const url = new URL(request.url || '/', 'http://127.0.0.1')
    return url.searchParams.get('token') === options.token
  } catch {
    return false
  }
}
