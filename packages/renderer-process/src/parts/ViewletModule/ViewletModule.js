import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    case ViewletModuleId.ImagePreview:
      return import('../ImagePreview/ImagePreview.js')
    case ViewletModuleId.ActivityBar:
      return import('../ViewletActivityBar/ViewletActivityBar.js')
    case ViewletModuleId.Audio:
      return import('../ViewletAudio/ViewletAudio.js')
    case ViewletModuleId.BrowserViewOverview:
      return import('../ViewletBrowseViewOverview/ViewletBrowserViewOverview.js')
    case ViewletModuleId.Clock:
      return import('../ViewletClock/ViewletClock.js')
    case ViewletModuleId.ColorPicker:
      return import('../ViewletColorPicker/ViewletColorPicker.js')
    case ViewletModuleId.DebugConsole:
      return import('../ViewletDebugConsole/ViewletDebugConsole.js')
    case ViewletModuleId.DefineKeyBinding:
      return import('../ViewletDefineKeyBinding/ViewletDefineKeyBinding.js')
    case ViewletModuleId.Dialog:
      return import('../ViewletDialog/ViewletDialog.js')
    case ViewletModuleId.DiffEditor:
      return import('../ViewletDiffEditor/ViewletDiffEditor.js')
    case ViewletModuleId.EditorCompletion:
      return import('../ViewletEditorCompletion/ViewletEditorCompletion.js')
    case ViewletModuleId.EditorError:
      return import('../ViewletEditorError/ViewletEditorError.js')
    case ViewletModuleId.EditorHover:
      return import('../ViewletEditorHover/ViewletEditorHover.js')
    case ViewletModuleId.EditorImage:
      return import('../ViewletEditorImage/ViewletEditorImage.js')
    case ViewletModuleId.EditorPlainText:
      return import('../ViewletEditorPlainText/ViewletEditorPlainText.js')
    case ViewletModuleId.EditorText:
      return import('../ViewletEditorText/ViewletEditorText.js')
    case ViewletModuleId.EditorWidgetError:
      return import('../ViewletEditorWidgetError/ViewletEditorWidgetError.js')
    case ViewletModuleId.Empty:
      return import('../ViewletEmpty/ViewletEmpty.js')
    case ViewletModuleId.Error:
      return import('../ViewletError/ViewletError.js')
    case ViewletModuleId.Explorer:
      return import('../ViewletExplorer/ViewletExplorer.js')
    case ViewletModuleId.ExtensionDetail:
      return import('../ViewletExtensionDetail/ViewletExtensionDetail.js')
    case ViewletModuleId.Extensions:
      return import('../ViewletExtensions/ViewletExtensions.js')
    case ViewletModuleId.FindWidget:
      return import('../ViewletFindWidget/ViewletFindWidget.js')
    case ViewletModuleId.Implementations:
      return import('../ViewletImplementations/ViewletImplementations.js')
    case ViewletModuleId.KeyBindings:
      return import('../ViewletKeyBindings/ViewletKeyBindings.js')
    case ViewletModuleId.Layout:
      return import('../ViewletLayout/ViewletLayout.js')
    case ViewletModuleId.Main:
      return import('../ViewletMain/ViewletMain.js')
    case ViewletModuleId.MainTabs:
      return import('../ViewletMainTabs/ViewletMainTabs.js')
    case ViewletModuleId.Output:
      return import('../ViewletOutput/ViewletOutput.js')
    case ViewletModuleId.Panel:
      return import('../ViewletPanel/ViewletPanel.js')
    case ViewletModuleId.Problems:
      return import('../ViewletProblems/ViewletProblems.js')
    case ViewletModuleId.QuickPick:
      return import('../ViewletQuickPick/ViewletQuickPick.js')
    case ViewletModuleId.References:
      return import('../ViewletReferences/ViewletReferences.js')
    case ViewletModuleId.RunAndDebug:
      return import('../ViewletRunAndDebug/ViewletRunAndDebug.js')
    case ViewletModuleId.ScreenCapture:
      return import('../ViewletScreenCapture/ViewletScreenCapture.js')
    case ViewletModuleId.Search:
      return import('../ViewletSearch/ViewletSearch.js')
    case ViewletModuleId.SideBar:
      return import('../ViewletSideBar/ViewletSideBar.js')
    case ViewletModuleId.SimpleBrowser:
      return import('../ViewletSimpleBrowser/ViewletSimpleBrowser.js')
    case ViewletModuleId.SourceControl:
      return import('../ViewletSourceControl/ViewletSourceControl.js')
    case ViewletModuleId.StatusBar:
      return import('../ViewletStatusBar/ViewletStatusBar.js')
    case ViewletModuleId.Storage:
      return import('../ViewletStorage/ViewletStorage.js')
    case ViewletModuleId.Terminal:
      return import('../ViewletTerminal/ViewletTerminal.js')
    case ViewletModuleId.Terminals:
      return import('../ViewletTerminals/ViewletTerminals.js')
    case ViewletModuleId.TitleBar:
      return import('../ViewletTitleBar/ViewletTitleBar.js')
    case ViewletModuleId.TitleBarButtons:
      return import('../ViewletTitleBarButtons/ViewletTitleBarButtons.js')
    case ViewletModuleId.TitleBarIcon:
      return import('../ViewletTitleBarIcon/ViewletTitleBarIcon.js')
    case ViewletModuleId.TitleBarMenuBar:
      return import('../ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js')
    case ViewletModuleId.Video:
      return import('../ViewletVideo/ViewletVideo.js')
    case ViewletModuleId.TitleBarTitle:
      return import('../ViewletTitleBarTitle/ViewletTitleBarTitle.js')
    case ViewletModuleId.About:
      return import('../ViewletAbout/ViewletAbout.js')
    case ViewletModuleId.EditorSourceActions:
      return import('../ViewletEditorSourceActions/ViewletEditorSourceActions.js')
    case ViewletModuleId.EmptyEditor:
      return import('../ViewletEmptyEditor/ViewletEmptyEditor.js')
    default:
      throw new Error(`${moduleId} module not found in renderer process`)
  }
}
