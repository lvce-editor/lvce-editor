const commandQueues = new Map()

export const enqueue = async (uid, command) => {
  const previous = commandQueues.get(uid) || Promise.resolve()
  const run = async () => {
    try {
      await previous
    } catch {
      // The previous caller receives its error; later commands must still run.
    }
    return command()
  }
  const current = run()
  commandQueues.set(uid, current)
  try {
    return await current
  } finally {
    if (commandQueues.get(uid) === current) {
      commandQueues.delete(uid)
    }
  }
}
