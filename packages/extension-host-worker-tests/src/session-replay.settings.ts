import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'session-replay.settings'

export const test: Test = async ({ Command, Settings }) => {
  const assertDisabled = async () => {
    try {
      await Command.execute('FileSystem.readFile', 'app://session.json')
    } catch (error) {
      if (String(error).includes('Session replay is disabled in settings')) return
      throw error
    }
    throw new Error('Session replay must be disabled until the user opts in')
  }

  await assertDisabled()
  await Settings.update({ 'sessionReplay.enabled': true })
  try {
    if (await Command.execute('Preferences.get', 'sessionReplay.uploadEnabled')) {
      throw new Error('Enabling local replay must not enable uploads')
    }
    const session = JSON.parse(await Command.execute('FileSystem.readFile', 'app://session.json'))
    if (session.version !== 1 || !session.id || !session.events.some((event) => event.type === 'frame')) {
      throw new Error('Local session replay must capture a versioned recording with a visual frame')
    }
  } finally {
    await Settings.update({ 'sessionReplay.enabled': false })
  }
  await assertDisabled()
}
