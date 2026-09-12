export const getRemoteHomepage = (remote, hosts = { 'github.com': 'https://github.com' }) => {
  const value = remote.trim()
  const scp = value.match(/^(?:[^@/]+@)?([^/:]+):([^/].*)$/) || value.match(/^[^@/]+@([^/:]+)\/(.+)$/)
  let host
  let path
  if (!value.includes('://') && scp) {
    host = scp[1].toLowerCase()
    path = scp[2]
  } else {
    try {
      const url = new URL(value)
      if (!['https:', 'http:', 'ssh:', 'git:'].includes(url.protocol)) return ''
      host = url.hostname
      path = url.pathname.slice(1)
    } catch {
      return ''
    }
  }
  if (!hosts || typeof hosts !== 'object' || !Object.hasOwn(hosts, host)) return ''
  const base = hosts[host]
  if (typeof base !== 'string') return ''
  try {
    const url = new URL(base)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return ''
    const repository = path.replace(/\/$/, '').replace(/\.git$/, '')
    if (!repository || repository.split('/').some((part) => !part || part === '.' || part === '..')) return ''
    url.pathname = `${url.pathname.replace(/\/$/, '')}/${repository}`
    url.search = ''
    url.hash = ''
    return url.href
  } catch {
    return ''
  }
}
