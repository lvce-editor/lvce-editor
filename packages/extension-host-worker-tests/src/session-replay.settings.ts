import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'session-replay.settings'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings }) => {
  const assertDisabled = async () => {
    try {
      await Command.execute('FileSystem.readFile', 'app://session.json')
    } catch (error) {
      if (String(error).includes('Session replay is disabled in settings')) return
      throw error
    }
    throw new Error('Session replay must be disabled until recording starts on reload')
  }

  if (await Command.execute('Preferences.get', 'sessionReplay.enabled')) {
    const uri = `${await FileSystem.getTmpDir()}/replay.txt`
    await FileSystem.writeFile(uri, 'before')
    await Main.openUri(uri)
    await Editor.setCursor(0, 6)
    await Editor.type(' proxied edit')
    await expect(Locator('.Editor')).toHaveText('before proxied edit')
    const session = JSON.parse(await Command.execute('FileSystem.readFile', 'app://session.json'))
    const frames = session.events.filter((event) => event.type === 'frame')
    if (frames.length !== 1 || !frames[0].data.commandReplay) throw new Error('Proxy recording must contain exactly one initial frame')
    if (session.events.every((event) => !(event.type === 'message' && event.data.renderer) || event.data.label === 'renderer')) {
      throw new Error('Direct view worker messages must pass through the recording proxy')
    }
    // Load the published worker used by the renderer, independently of the running recording.
    const workerUrl = new URL('/packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/sessionReplayWorkerMain.js', import.meta.url)
    const worker = new Worker(workerUrl, { type: 'module' })
    let id = 0
    const invoke = (method: string, ...params: unknown[]): Promise<any> =>
      new Promise((resolve, reject) => {
        const requestId = ++id
        worker.onmessage = ({ data }) => {
          if (data.id !== requestId) return
          if (data.error) reject(new Error(data.error))
          else resolve(data.result)
        }
        worker.onerror = (event) => reject(new Error(event.message))
        worker.postMessage({ id: requestId, method, params })
      })
    try {
      await invoke('load', { session })
      const result = await invoke('seek', session.events.at(-1).timestamp)
      const textContent = (node): string => (node.text || '') + (node.children || []).map(textContent).join('')
      if (!textContent(result.frame.dom).includes('before proxied edit')) throw new Error('Replayed virtual DOM must contain the real editor edit')
      const initial = await invoke('seek', 0)
      if (textContent(initial.frame.dom).includes('before proxied edit')) throw new Error('Seeking backwards must restore the initial DOM')
    } finally {
      worker.terminate()
    }
    await Settings.update({ 'sessionReplay.enabled': false })
    await assertDisabled()
    await Editor.type(' after stop')
    await expect(Locator('.Editor')).toHaveText('before proxied edit after stop')
    return
  }

  await assertDisabled()
  await Settings.update({ 'sessionReplay.enabled': true })
  try {
    if (await Command.execute('Preferences.get', 'sessionReplay.uploadEnabled')) throw new Error('Enabling local replay must not enable uploads')
    await assertDisabled()
    await expect(Locator('.NotificationMessage')).toHaveText('Reload the window to start session replay')
  } finally {
    await Settings.update({ 'sessionReplay.enabled': false })
  }
  await assertDisabled()
}
