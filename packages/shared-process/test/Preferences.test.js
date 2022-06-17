import { mkdtemp, readFile, writeFile, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as Platform from '../src/parts/Platform/Platform.js'
import * as Preferences from '../src/parts/Preferences/Preferences.js'

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

// test.skip('getAll - no preferences exist', async () => {
//   const tmpDir = await getTmpDir()
//   Platform.state.getConfigDir = () => {
//     return tmpDir
//   }
//   expect(await Preferences.getAll()).toEqual({
//     'editor.fontFamily': "'Fira Code'",
//     'editor.fontSize': 14,
//     'extensions.autoUpdate': true,
//     'workbench.activityBar.visible': true,
//     'workbench.colorTheme': 'slime',
//     'workbench.iconTheme': 'vscode-icons',
//     'workbench.sideBar.visible': true,
//   })
// })

// test('set - no preferences exist', async () => {
//   const tmpDir = await getTmpDir()
//   Platform.state.getConfigDir = () => {
//     return tmpDir
//   }
//   await Preferences.set('sample-key', 'sample-value')
//   expect(await readFile(join(tmpDir, 'settings.json'), 'utf-8')).toBe(`{
//   \"sample-key\": \"sample-value\"
// }
// `)
// })

// test('set - no preferences exist in nested folder', async () => {
//   const tmpDir = await getTmpDir()
//   Platform.state.getConfigDir = () => {
//     return join(tmpDir, 'my-app', 'nested')
//   }
//   await Preferences.set('sample-key', 'sample-value')
//   expect(
//     await readFile(join(tmpDir, 'my-app', 'nested', 'settings.json'), 'utf-8')
//   ).toBe(`{
//   \"sample-key\": \"sample-value\"
// }
// `)
// })

// test('set - preferences exist', async () => {
//   const tmpDir = await getTmpDir()
//   Platform.state.getConfigDir = () => {
//     return tmpDir
//   }
//   await writeFile(
//     join(tmpDir, 'settings.json'),
//     JSON.stringify({
//       'key-0': '0',
//     }) + '\n'
//   )
//   await Preferences.set('sample-key', 'sample-value')
//   expect(await readFile(join(tmpDir, 'settings.json'), 'utf-8')).toBe(`{
//   \"key-0\": \"0\",
//   \"sample-key\": \"sample-value\"
// }
// `)
// })

// test.skip('set - preferences exist but are invalid json', async () => {
//   const tmpDir = await getTmpDir()
//   Platform.state.getConfigDir = () => {
//     return tmpDir
//   }
//   const settingsPath = join(tmpDir, 'settings.json')
//   await writeFile(settingsPath, `"`)
//   // TODO should handle error gracefully
//   await expect(
//     Preferences.set('sample-key', 'sample-value')
//   ).rejects.toThrowError(
//     new Error(
//       `Unexpected end of JSON input while parsing "\\"" in ${settingsPath}`
//     )
//   )
// })

test('getAll - error', async () => {
  const tmpDir = await getTmpDir()
  Platform.state.getAppDir = () => {
    return tmpDir
  }
  await expect(Preferences.getAll()).rejects.toThrowError(
    /^Failed to get all preferences: Failed to load default preferences: ENOENT/
  )
})

// test('getDefaultPreferences - error', async () => {
//   const tmpDir = await getTmpDir()
//   Platform.state.getAppDir = () => {
//     return tmpDir
//   }
//   await expect(Preferences.getDefaultPreferences()).rejects.toThrowError(
//     /^Failed to load default preferences: ENOENT/
//   )
// })

// test('set - error', async () => {
//   const tmpDir = await getTmpDir()
//   await mkdir(join(tmpDir, 'settings.json'))
//   Platform.state.getConfigDir = () => {
//     return tmpDir
//   }
//   await expect(Preferences.set('x', 42)).rejects.toThrowError(
//     /^Failed to set key in user settings: failed to get user preferences: EISDIR/
//   )
// })

// test('getUserSettingsContent - error', async () => {
//   const tmpDir = await getTmpDir()
//   await mkdir(join(tmpDir, 'settings.json'))
//   Platform.state.getConfigDir = () => {
//     return tmpDir
//   }
//   await expect(Preferences.getUserSettingsContent()).rejects.toThrowError(
//     /^Failed to load user settings: EISDIR/
//   )
// })

// test('setUserSettingsContent - error', async () => {
//   const tmpDir = await getTmpDir()
//   await mkdir(join(tmpDir, 'settings.json'))
//   Platform.state.getConfigDir = () => {
//     return tmpDir
//   }
//   await expect(Preferences.setUserSettingsContent('')).rejects.toThrowError(
//     /^Failed to write to user settings file: EISDIR/
//   )
// })
