import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    case ViewletModuleId.Explorer:
      return import('../ViewletExplorer/ViewletExplorer.ipc.js')
    case ViewletModuleId.RunAndDebug:
      return import('../ViewletRunAndDebug/ViewletRunAndDebug.ipc.js')
    case ViewletModuleId.Search:
      return import('../ViewletSearch/ViewletSearch.ipc.js')
    case ViewletModuleId.SourceControl:
      return import('../ViewletSourceControl/ViewletSourceControl.ipc.js')
    case ViewletModuleId.Terminal:
      return import('../ViewletTerminal/ViewletTerminal.ipc.js')
    case ViewletModuleId.DebugConsole:
      return import('../ViewletDebugConsole/ViewletDebugConsole.ipc.js')
    case ViewletModuleId.Extensions:
      return import('../ViewletExtensions/ViewletExtensions.ipc.js')
    case ViewletModuleId.Output:
      return import('../ViewletOutput/ViewletOutput.ipc.js')
    case ViewletModuleId.Problems:
      return import('../ViewletProblems/ViewletProblems.ipc.js')
    case ViewletModuleId.Noop:
      return import('../ViewletNoop/ViewletNoop.ipc.js')
    case ViewletModuleId.EditorText:
      return import('../ViewletEditorText/ViewletEditorText.ipc.js')
    case ViewletModuleId.EditorPlainText:
      return import('../ViewletEditorPlainText/ViewletEditorPlainText.ipc.js')
    case ViewletModuleId.EditorImage:
      return import('../ViewletEditorImage/ViewletEditorImage.ipc.js')
    case ViewletModuleId.Clock:
      return import('../ViewletClock/ViewletClock.ipc.js')
    case ViewletModuleId.ActivityBar:
      return import('../ViewletActivityBar/ViewletActivityBar.ipc.js')
    case ViewletModuleId.Panel:
      return import('../ViewletPanel/ViewletPanel.ipc.js')
    case ViewletModuleId.SideBar:
      return import('../ViewletSideBar/ViewletSideBar.ipc.js')
    case ViewletModuleId.TitleBar:
      return import('../ViewletTitleBar/ViewletTitleBar.ipc.js')
    case ViewletModuleId.StatusBar:
      return import('../ViewletStatusBar/ViewletStatusBar.ipc.js')
    case ViewletModuleId.Main:
      return import('../ViewletMain/ViewletMain.ipc.js')
    case ViewletModuleId.EditorCompletion:
      return import('../ViewletEditorCompletion/ViewletEditorCompletion.ipc.js')
    case ViewletModuleId.References:
      return import('../ViewletReferences/ViewletReferences.ipc.js')
    case ViewletModuleId.Implementations:
      return import('../ViewletImplementations/ViewletImplementations.ipc.js')
    case ViewletModuleId.QuickPick:
      return import('../ViewletQuickPick/ViewletQuickPick.ipc.js')
    case ViewletModuleId.KeyBindings:
      return import('../ViewletKeyBindings/ViewletKeyBindings.ipc.js')
    case ViewletModuleId.FindWidget:
      return import('../ViewletFindWidget/ViewletFindWidget.ipc.js')
    case ViewletModuleId.ExtensionDetail:
      return import('../ViewletExtensionDetail/ViewletExtensionDetail.ipc.js')
    case ViewletModuleId.TitleBarButtons:
      return import('../ViewletTitleBarButtons/ViewletTitleBarButtons.ipc.js')
    case ViewletModuleId.TitleBarMenuBar:
      return import('../ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.ipc.js')
    case ViewletModuleId.Layout:
      return import('../ViewletLayout/ViewletLayout.ipc.js')
    case ViewletModuleId.SimpleBrowser:
      return import('../ViewletSimpleBrowser/ViewletSimpleBrowser.ipc.js')
    case ViewletModuleId.Pdf:
      return import('../ViewletPdf/ViewletPdf.ipc.js')
    default:
      throw new Error(`unknown module "${moduleId}"`)
  }
}
