import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    case ViewletModuleId.Explorer:
      return import('../ViewletExplorer/ViewletExplorer.js')
    case ViewletModuleId.RunAndDebug:
      return import('../ViewletRunAndDebug/ViewletRunAndDebug.js')
    case ViewletModuleId.Search:
      return import('../ViewletSearch/ViewletSearch.js')
    case ViewletModuleId.SourceControl:
      return import('../ViewletSourceControl/ViewletSourceControl.js')
    case ViewletModuleId.Terminal:
      return import('../ViewletTerminal/ViewletTerminal.js')
    case ViewletModuleId.Extensions:
      return import('../ViewletExtensions/ViewletExtensions.js')
    case ViewletModuleId.DebugConsole:
      return import('../ViewletDebugConsole/ViewletDebugConsole.js')
    case ViewletModuleId.Output:
      return import('../ViewletOutput/ViewletOutput.js')
    case ViewletModuleId.Problems:
      return import('../ViewletProblems/ViewletProblems.js')
    case ViewletModuleId.Empty:
      return import('../ViewletEmpty/ViewletEmpty.js')
    case ViewletModuleId.EditorText:
      return import('../ViewletEditorText/ViewletEditorText.js')
    case ViewletModuleId.EditorImage:
      return import('../ViewletEditorImage/ViewletEditorImage.js')
    case ViewletModuleId.Clock:
      return import('../ViewletClock/ViewletClock.js')
    case ViewletModuleId.SideBar:
      return import('../ViewletSideBar/ViewletSideBar.js')
    case ViewletModuleId.Panel:
      return import('../ViewletPanel/ViewletPanel.js')
    case ViewletModuleId.ActivityBar:
      return import('../ViewletActivityBar/ViewletActivityBar.js')
    case ViewletModuleId.ImagePreview:
      return import('../ImagePreview/ImagePreview.js')
    case ViewletModuleId.QuickPick:
      return import('../ViewletQuickPick/ViewletQuickPick.js')
    case ViewletModuleId.StatusBar:
      return import('../ViewletStatusBar/ViewletStatusBar.js')
    case ViewletModuleId.TitleBar:
      return import('../ViewletTitleBar/ViewletTitleBar.js')
    case ViewletModuleId.Main:
      return import('../ViewletMain/ViewletMain.js')
    case ViewletModuleId.EditorCompletion:
      return import('../ViewletEditorCompletion/ViewletEditorCompletion.js')
    case ViewletModuleId.References:
      return import('../ViewletReferences/ViewletReferences.js')
    case ViewletModuleId.Implementations:
      return import('../ViewletImplementations/ViewletImplementations.js')
    case ViewletModuleId.EditorPlainText:
      return import('../ViewletEditorPlainText/ViewletEditorPlainText.js')
    case ViewletModuleId.KeyBindings:
      return import('../ViewletKeyBindings/ViewletKeyBindings.js')
    case ViewletModuleId.EditorFindWidget:
      return import('../ViewletEditorFindWidget/ViewletEditorFindWidget.js')
    default:
      throw new Error('unknown module')
  }
}
