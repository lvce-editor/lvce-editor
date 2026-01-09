import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as RemoveSourceMaps from '../RemoveSourceMaps/RemoveSourceMaps.js'

const getNodePtyIgnoreFiles = (platform) => {
  const files = ['typings', 'README.md', 'scripts', 'src']
  if (platform !== 'win32') {
    files.push('deps')
  }
  return files
}

export const removeNodePtyFiles = async (to, platform) => {
  const nodePtyIgnoreFiles = getNodePtyIgnoreFiles(platform)
  for (const file of nodePtyIgnoreFiles) {
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/${file}`))
  }
  await Remove.remove(Path.absolute(`${to}/node_modules/nan`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-addon-api`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/bin`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/binding.gyp`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/node_gyp_bins`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/Release/.deps`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/Release/obj.target`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/Release/.forge-meta`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/Release/node-addon-api`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/binding.Makefile`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/config.gypi`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/Makefile`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/pty.target.mk`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/lib/types.js`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/lib/types.js.map`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/lib/interfaces.js`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/lib/interfaces.js.map`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/node-addon-api`))
  await Remove.remove(Path.absolute(`${to}/node_modules/node-addon-api`))
  await Remove.remove(`${to}/node_modules/@lvce-editor/ipc/dist/browser.js`)
  await Remove.removeMatching(`${to}/node_modules/node-pty`, '**/*.test.js')
  await Remove.removeMatching(`${to}/node_modules/node-pty`, '**/*.test.js.map')
  await RemoveSourceMaps.removeSourceMaps(`${to}/node_modules/node-pty`)
  if (platform === 'win32') {
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/deps`))
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/deps`))
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/build/Release/obj`))
    await Remove.removeMatching(Path.absolute(`${to}/node_modules/node-pty/build/Release`), '*.iobj')
    await Remove.removeMatching(Path.absolute(`${to}/node_modules/node-pty/build/Release`), '*.ipdb')
    await Remove.removeMatching(Path.absolute(`${to}/node_modules/node-pty/build/Release`), '*.lib')
    await Remove.removeMatching(Path.absolute(`${to}/node_modules/node-pty/build/Release`), '*.pdb')
    await Remove.removeMatching(Path.absolute(`${to}/node_modules/node-pty/build/`), '*.sln')
    await Remove.removeMatching(Path.absolute(`${to}/node_modules/node-pty/build/`), '*.vcxproj')
    await Remove.removeMatching(Path.absolute(`${to}/node_modules/node-pty/build/`), '*.filters')
  } else {
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/lib/shared`))
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/lib/worker`))
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/lib/conpty_console_list_agent.js`))
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/lib/windowsPtyAgent.js`))
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/lib/windowsTerminal.js`))
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/lib/windowsConoutConnection.js`))
  }

  // Remove unused prebuilds based on platform
  const prebuildsPath = Path.absolute(`${to}/node_modules/node-pty/prebuilds`)
  if (platform === 'linux') {
    // Remove darwin and win32 prebuilds, and all conpty
    await Remove.remove(`${prebuildsPath}/darwin-arm64`)
    await Remove.remove(`${prebuildsPath}/darwin-x64`)
    await Remove.remove(`${prebuildsPath}/win32-arm64`)
    await Remove.remove(`${prebuildsPath}/win32-x64`)
  } else if (platform === 'darwin') {
    // Remove win32 prebuilds and all conpty
    await Remove.remove(`${prebuildsPath}/win32-arm64`)
    await Remove.remove(`${prebuildsPath}/win32-x64`)
  } else if (platform === 'win32') {
    // Remove darwin prebuilds
    await Remove.remove(`${prebuildsPath}/darwin-arm64`)
    await Remove.remove(`${prebuildsPath}/darwin-x64`)
  }
}
