import { expect, test } from '@jest/globals'
import * as ViewletAbout from '../src/parts/ViewletAbout/ViewletAbout.ipc.ts'
import * as ViewletActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.ipc.ts'
import * as ViewletChat from '../src/parts/ViewletChat/ViewletChat.ipc.ts'
import * as ViewletChatDebug from '../src/parts/ViewletChatDebug/ViewletChatDebug.ipc.js'
import * as ViewletDiffEditor2 from '../src/parts/ViewletDiffEditor2/ViewletDiffEditor2.ipc.js'
import * as ViewletExtensionDetail from '../src/parts/ViewletExtensionDetail/ViewletExtensionDetail.ipc.ts'
import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.ipc.js'
import * as ViewletKeyBindings from '../src/parts/ViewletKeyBindings/ViewletKeyBindings.ipc.js'
import * as ViewletLanguageModels from '../src/parts/ViewletLanguageModels/ViewletLanguageModels.ipc.ts'
import * as ViewletOutput from '../src/parts/ViewletOutput/ViewletOutput.ipc.ts'
import * as ViewletPanel from '../src/parts/ViewletPanel/ViewletPanel.ipc.ts'
import * as ViewletProblems from '../src/parts/ViewletProblems/ViewletProblems.ipc.js'
import * as ViewletProcessExplorer from '../src/parts/ViewletProcessExplorer/ViewletProcessExplorer.ipc.js'
import * as ViewletQuickPick from '../src/parts/ViewletQuickPick/ViewletQuickPick.ipc.js'
import * as ViewletSourceControl from '../src/parts/ViewletSourceControl/ViewletSourceControl.ipc.js'
import * as ViewletStatusBar from '../src/parts/ViewletStatusBar/ViewletStatusBar.ipc.js'
import * as ViewletMain from '../src/parts/ViewletMain/ViewletMain.ipc.js'
import * as ViewletSearch from '../src/parts/ViewletSearch/ViewletSearch.ipc.ts'
import * as ViewletRunningExtensions from '../src/parts/ViewletRunningExtensions/ViewletRunningExtensions.ipc.ts'
import * as ViewletSecrets from '../src/parts/ViewletSecrets/ViewletSecrets.ipc.ts'
import * as ViewletSettings from '../src/parts/ViewletSettings/ViewletSettings.ipc.js'
import * as ViewletTitleBar from '../src/parts/ViewletTitleBar/ViewletTitleBar.ipc.js'

test.each([
  ['about', ViewletAbout],
  ['activity bar', ViewletActivityBar],
  ['chat', ViewletChat],
  ['chat debug', ViewletChatDebug],
  ['diff', ViewletDiffEditor2],
  ['extension detail', ViewletExtensionDetail],
  ['extensions', ViewletExtensions],
  ['keybindings', ViewletKeyBindings],
  ['language models', ViewletLanguageModels],
  ['output', ViewletOutput],
  ['panel', ViewletPanel],
  ['problems', ViewletProblems],
  ['process explorer', ViewletProcessExplorer],
  ['main area', ViewletMain],
  ['quick pick', ViewletQuickPick],
  ['source control', ViewletSourceControl],
  ['running extensions', ViewletRunningExtensions],
  ['secrets', ViewletSecrets],
  ['settings', ViewletSettings],
  ['status bar', ViewletStatusBar],
  ['text search', ViewletSearch],
  ['title bar', ViewletTitleBar],
])('%s declares direct rendering support', (_name, viewlet) => {
  expect(viewlet.hasDirectRender).toBe(true)
})
