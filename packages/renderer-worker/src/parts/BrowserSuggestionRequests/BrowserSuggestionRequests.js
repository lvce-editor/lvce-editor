const sessions = new Map()
const sequence = { value: 0 }

export const cancel = (uid) => {
  const session = sessions.get(uid)
  if (session?.timer !== undefined) clearTimeout(session.timer)
  if (session) session.active = false
}

export const dispose = (uid) => {
  cancel(uid)
  sessions.delete(uid)
}

export const isCurrent = (uid, id, tabId) => {
  const session = sessions.get(uid)
  return session?.active === true && session.id === id && session.tabId === tabId
}

export const beginUpdate = (uid, id, provider) => {
  const session = sessions.get(uid)
  if (!session?.active || session.id !== id || (!provider && session.providerStarted)) return undefined
  if (provider) session.providerStarted = true
  return ++session.updateId
}

export const isCurrentUpdate = (uid, id, updateId) => {
  const session = sessions.get(uid)
  return session?.active === true && session.id === id && session.updateId === updateId
}

export const begin = (uid, tabId, query, request, apply) => {
  cancel(uid)
  const session = { active: true, id: ++sequence.value, tabId, timer: undefined, updateId: 0, providerStarted: false }
  sessions.set(uid, session)
  if (request) {
    session.timer = setTimeout(async () => {
      session.timer = undefined
      let results = []
      try {
        results = await request(query)
      } catch {
        // Local matches and typed navigation remain available when the provider fails.
      }
      if (!isCurrent(uid, session.id, tabId)) return
      try {
        await apply(session.id, results)
      } catch (error) {
        console.error('[renderer-worker] Failed to apply browser suggestions', error)
      }
    }, 150)
  }
  return session.id
}
