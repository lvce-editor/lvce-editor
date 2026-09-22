import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'workspace.remote-local-services'

export const test: Test = async ({ Command, Editor, Extension, FileSystem, Locator, Workspace, expect }) => {
  await Workspace.openTmpDir()
  const localUri = await Command.execute('Workspace.getUri')
  await FileSystem.writeFile(`${localUri}/local.txt`, 'local file content')
  await Command.execute('FileSystem.writeFile', 'app:///settings.json', JSON.stringify({ 'editor.fontSize': 17 }))
  await Command.execute('Preferences.openSettingsJson')
  if (JSON.parse(await Editor.getText())['editor.fontSize'] !== 17) throw new Error('Settings editor must open the application settings URI')
  await Command.execute('RecentlyOpened.clearRecentlyOpened')
  await Command.execute('RecentlyOpened.addToRecentlyOpened', `${localUri}/local.txt`)
  const extensionUri = new URL('../fixtures/sample.remote-local-services', import.meta.url).href
  await Extension.addWebExtension(extensionUri)
  await Extension.enableWorkspace('sample.remote-local-services')
  await Command.execute('Workspace.setUri', 'remote-test://host/work', {
    command: 'sample.remote-local-services.getWebSocketUrl',
    webSocketUrl: 'ws://127.0.0.1:1/websocket/file-system-process',
  })
  const localContent = await Command.execute('FileSystem.readFile', `${localUri}/local.txt`)
  if (localContent !== 'local file content') throw new Error('Local files must remain local in a remote workspace')
  const settings = JSON.parse(await Command.execute('FileSystem.readFile', 'app:///settings.json'))
  if (settings['editor.fontSize'] !== 17) throw new Error('User settings must remain local in a remote workspace')
  const remoteContent = await Command.execute('FileSystem.readFile', 'remote-test://host/work/remote.txt')
  if (remoteContent !== 'remote provider content') throw new Error('Remote files must use the extension provider')
  await Command.execute('QuickPick.showRecent')
  await expect(Locator('.QuickPick')).toContainText('local.txt')
}
