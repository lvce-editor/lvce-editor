import { expect, test } from '@jest/globals'
import * as ViewletAbout from '../src/parts/ViewletAbout/ViewletAbout.ipc.ts'
import * as ViewletActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.ipc.ts'
import * as ViewletExtensionDetail from '../src/parts/ViewletExtensionDetail/ViewletExtensionDetail.ipc.ts'
import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.ipc.js'
import * as ViewletOutput from '../src/parts/ViewletOutput/ViewletOutput.ipc.ts'
import * as ViewletProblems from '../src/parts/ViewletProblems/ViewletProblems.ipc.js'
import * as ViewletQuickPick from '../src/parts/ViewletQuickPick/ViewletQuickPick.ipc.js'
import * as ViewletSourceControl from '../src/parts/ViewletSourceControl/ViewletSourceControl.ipc.js'
import * as ViewletStatusBar from '../src/parts/ViewletStatusBar/ViewletStatusBar.ipc.js'
import * as ViewletMain from '../src/parts/ViewletMain/ViewletMain.ipc.js'
import * as ViewletSearch from '../src/parts/ViewletSearch/ViewletSearch.ipc.ts'
import * as ViewletTitleBar from '../src/parts/ViewletTitleBar/ViewletTitleBar.ipc.js'

test.each([
  ['about', ViewletAbout],
  ['activity bar', ViewletActivityBar],
  ['extension detail', ViewletExtensionDetail],
  ['extensions', ViewletExtensions],
  ['output', ViewletOutput],
  ['problems', ViewletProblems],
  ['main area', ViewletMain],
  ['quick pick', ViewletQuickPick],
  ['source control', ViewletSourceControl],
  ['status bar', ViewletStatusBar],
  ['text search', ViewletSearch],
  ['title bar', ViewletTitleBar],
])('%s declares direct rendering support', (_name, viewlet) => {
  expect(viewlet.hasDirectRender).toBe(true)
})
