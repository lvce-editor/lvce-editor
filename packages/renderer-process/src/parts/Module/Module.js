import * as ModuleId from '../ModuleId/ModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    case ModuleId.Audio:
      return import('../Audio/Audio.ipc.js')
    case ModuleId.ClipBoard:
      return import('../ClipBoard/ClipBoard.ipc.js')
    case ModuleId.ConfirmPrompt:
      return import('../ConfirmPrompt/ConfirmPrompt.ipc.js')
    case ModuleId.Css:
      return import('../Css/Css.ipc.js')
    case ModuleId.Developer:
      return import('../Developer/Developer.ipc.js')
    case ModuleId.Download:
      return import('../Download/Download.ipc.js')
    case ModuleId.EditorError:
      return import('../EditorError/EditorError.ipc.js')
    case ModuleId.EditorRename:
      return import('../EditorRename/EditorRename.ipc.js')
    case ModuleId.FilePicker:
      return import('../FilePicker/FilePicker.ipc.js')
    case ModuleId.FileSystemHandle:
      return import('../FileSystemHandle/FileSystemHandle.ipc.js')
    case ModuleId.ImagePreview:
      return import('../ImagePreview/ImagePreview.ipc.js')
    case ModuleId.InitData:
      return import('../InitData/InitData.ipc.js')
    case ModuleId.IpcParent:
      return import('../IpcParent/IpcParent.ipc.js')
    case ModuleId.Layout:
      return import('../Layout/Layout.ipc.js')
    case ModuleId.Location:
      return import('../Location/Location.ipc.js')
    case ModuleId.MeasureTextHeight:
      return import('../MeasureTextHeight/MeasureTextHeight.ipc.js')
    case ModuleId.Meta:
      return import('../Meta/Meta.ipc.js')
    case ModuleId.Notification:
      return import('../Notification/Notification.ipc.js')
    case ModuleId.OffscreenCanvas:
      return import('../OffscreenCanvas/OffscreenCanvas.ipc.js')
    case ModuleId.Menu:
      return import('../OldMenu/Menu.ipc.js')
    case ModuleId.Open:
      return import('../Open/Open.ipc.js')
    case ModuleId.Performance:
      return import('../Performance/Performance.ipc.js')
    case ModuleId.Prompt:
      return import('../Prompt/Prompt.ipc.js')
    case ModuleId.ScreenCapture:
      return import('../ScreenCapture/ScreenCapture.ipc.js')
    case ModuleId.TestFrameWork:
      return import('../TestFrameWork/TestFrameWork.ipc.js')
    case ModuleId.Transferrable:
      return import('../Transferrable/Transferrable.ipc.js')
    case ModuleId.Viewlet:
      return import('../Viewlet/Viewlet.ipc.js')
    case ModuleId.WebStorage:
      return import('../WebStorage/WebStorage.ipc.js')
    case ModuleId.Window:
      return import('../Window/Window.ipc.js')
    case ModuleId.WindowTitle:
      return import('../WindowTitle/WindowTitle.ipc.js')
    case ModuleId.KeyBindings:
      return import('../KeyBindings/KeyBindings.ipc.js')
    case ModuleId.PointerCapture:
      return import('../PointerCapture/PointerCapture.ipc.js')
    default:
      throw new Error(`module ${moduleId} not found`)
  }
}
