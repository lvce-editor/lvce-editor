const MODULE_NOTIFICATION = 2
const MODULE_ACTIVITY_BAR = 11
const MODULE_WINDOW = 14
const MODULE_MAIN = 15
const MODULE_CONTEXT_MENU = 16
const MODULE_LAYOUT = 17
const MODULE_VIEWLET = 18
const MODULE_WORKBENCH = 19
const MODULE_VIEWLET_TERMINAL = 20
const MODULE_QUICK_PICK = 21
const MODULE_PANEL = 22
// TODO rename to widgetFind and group together with other widgets (contextMenu, hover, tooltip)
const MODULE_FIND_WIDGET = 23
const MODULE_PREFERENCES = 25
const MODULE_DEVELOPER = 26
const MODULE_EDITOR_COMMAND = 27
const MODULE_EDITOR_COMPLETION = 28
const MODULE_KEY_BINDINGS = 29
const MODULE_EXTENSIONS = 30
const MODULE_VIEWLET_EXPLORER = 31
const MODULE_SOURCE_CONTROL = 32
const MODULE_COLOR_PICKER = 33
const MODULE_VIEWLET_EXTENSIONS = 34
const MODULE_TITLE_BAR = 35
const MODULE_CLIP_BOARD = 36
const MODULE_AJAX = 37
const MODULE_VIEWLET_SIDE_BAR = 38
const MODULE_STATUS_BAR = 39
const MODULE_FORMAT = 40
const MODULE_COLOR_THEME = 41
const MODULE_ICON_THEME = 42
const MODULE_MENU = 43
const MODULE_TITLE_BAR_MENU = 44
const MODULE_ERROR_HANDLING = 45
const MODULE_NAVIGATION = 46
const MODULE_CACHE_STORAGE = 47
const MODULE_LOCAL_STORAGE = 48
const MODULE_SESSION_STORAGE = 49
const MODULE_CALLBACK = 50
const MODULE_DIALOG = 51
const MODULE_COMMAND_INFO = 52
const MODULE_WORKSPACE = 53
const MODULE_COLOR_THEME_FROM_JSON = 54
const MODULE_RECENTLY_OPENED = 55
const MODULE_FILE_SYSTEM = 56
const MODULE_FIND_IN_WORKSPACE = 57
const MODULE_EDITOR_DIAGNOSTICS = 58
const MODULE_EDITOR_RENAME = 60
const MODULE_EDITOR_ERROR = 62
const MODULE_KEY_BINDINGS_INITIAL = 63
const MODULE_SAVE_STATE = 64
const MODULE_VIEWLET_SOURCE_CONTROL = 65
const MODULE_SERVICE_WORKER = 66
const MODULE_IMAGE_PREVIEW = 67
const MODULE_BASE_64 = 68
const MODULE_BLOB = 69
const MODULE_OPEN = 70
const MODULE_AUDIO = 71
const MODULE_VIEWLET_STATUS_BAR = 72
const MODULE_LISTENER = 73
const MODULE_VIEWLET_SEARCH = 74
const MODULE_VIEWLET_EDITOR_COMPLETION = 75
const MODULE_VIEWLET_Locations = 76
const MODULE_VIEWLET_PROBLEMS = 77

export const state = {
  commands: Object.create(null),
  pendingModules: Object.create(null),
}

const loadModule = (moduleId) => {
  switch (moduleId) {
    case MODULE_NOTIFICATION:
      return import('../Notification/Notification.ipc.js')
    case MODULE_ACTIVITY_BAR:
      return import('../Viewlet/ViewletActivityBar.ipc.js')
    case MODULE_WINDOW:
      return import('../Window/Window.ipc.js')
    case MODULE_MAIN:
      return import('../Viewlet/ViewletMain.ipc.js')
    case MODULE_CONTEXT_MENU:
      return import('../ContextMenu/ContextMenu.ipc.js')
    case MODULE_LAYOUT:
      return import('../Layout/Layout.ipc.js')
    case MODULE_VIEWLET:
      return import('../Viewlet/Viewlet.ipc.js')
    case MODULE_WORKBENCH:
      return import('../Workbench/Workbench.ipc.js')
    case MODULE_QUICK_PICK:
      return import('../QuickPick/QuickPick.ipc.js')
    case MODULE_PANEL:
      return import('../Panel/Panel.ipc.js')
    case MODULE_FIND_WIDGET:
      return import('../FindWidget/FindWidget.ipc.js')
    case MODULE_PREFERENCES:
      return import('../Preferences/Preferences.ipc.js')
    case MODULE_DEVELOPER:
      return import('../Developer/Developer.ipc.js')
    case MODULE_EDITOR_COMMAND:
      return import('../EditorCommand/EditorCommand.ipc.js')
    case MODULE_KEY_BINDINGS:
      return import('../KeyBindings/KeyBindings.ipc.js')
    case MODULE_EXTENSIONS:
      return import('../Extensions/Extensions.ipc.js')
    case MODULE_VIEWLET_EXPLORER:
      return import('../Viewlet/ViewletExplorer.ipc.js')
    case MODULE_SOURCE_CONTROL:
      return import('../SourceControl/SourceControl.ipc.js')
    case MODULE_VIEWLET_TERMINAL:
      return import('../Viewlet/ViewletTerminal.ipc.js')
    case MODULE_COLOR_PICKER:
      return import('../ColorPicker/ColorPicker.ipc.js')
    case MODULE_VIEWLET_EXTENSIONS:
      return import('../Viewlet/ViewletExtensions.ipc.js')
    case MODULE_CLIP_BOARD:
      return import('../ClipBoard/ClipBoard.ipc.js')
    case MODULE_AJAX:
      return import('../Ajax/Ajax.ipc.js')
    case MODULE_FORMAT:
      return import('../Format/Format.ipc.js')
    case MODULE_COLOR_THEME:
      return import('../ColorTheme/ColorTheme.ipc.js')
    case MODULE_ICON_THEME:
      return import('../IconTheme/IconTheme.ipc.js')
    case MODULE_MENU:
      return import('../Menu/Menu.ipc.js')
    case MODULE_TITLE_BAR_MENU:
      return import('../TitleBarMenuBar/TitleBarMenuBar.ipc.js')
    case MODULE_ERROR_HANDLING:
      return import('../ErrorHandling/ErrorHandling.ipc.js')
    case MODULE_NAVIGATION:
      return import('../Navigation/Navigation.ipc.js')
    case MODULE_CACHE_STORAGE:
      return import('../CacheStorage/CacheStorage.ipc.js')
    case MODULE_LOCAL_STORAGE:
      return import('../LocalStorage/LocalStorage.ipc.js')
    case MODULE_SESSION_STORAGE:
      return import('../SessionStorage/SessionStorage.ipc.js')
    case MODULE_CALLBACK:
      return import('../Callback/Callback.ipc.js')
    case MODULE_COMMAND_INFO:
      return import('../CommandInfo/CommandInfo.ipc.js')
    case MODULE_DIALOG:
      return import('../Dialog/Dialog.ipc.js')
    case MODULE_WORKSPACE:
      return import('../Workspace/Workspace.ipc.js')
    case MODULE_COLOR_THEME_FROM_JSON:
      return import('../ColorThemeFromJson/ColorThemeFromJson.ipc.js')
    case MODULE_RECENTLY_OPENED:
      return import('../RecentlyOpened/RecentlyOpened.ipc.js')
    case MODULE_FILE_SYSTEM:
      return import('../FileSystem/FileSystem.ipc.js')
    case MODULE_FIND_IN_WORKSPACE:
      return import('../FindInWorkspace/FindInWorkspace.ipc.js')
    case MODULE_EDITOR_DIAGNOSTICS:
      return import('../EditorDiagnostics/EditorDiagnostics.ipc.js')
    case MODULE_EDITOR_RENAME:
      return import('../EditorRename/EditorRename.ipc.js')
    case MODULE_EDITOR_ERROR:
      return import('../EditorError/EditorError.ipc.js')
    case MODULE_KEY_BINDINGS_INITIAL:
      return import('../KeyBindingsInitial/KeyBindingsInitial.ipc.js')
    case MODULE_SAVE_STATE:
      return import('../SaveState/SaveState.ipc.js')
    case MODULE_VIEWLET_SOURCE_CONTROL:
      return import('../Viewlet/ViewletSourceControl.ipc.js')
    case MODULE_SERVICE_WORKER:
      return import('../ServiceWorker/ServiceWorker.ipc.js')
    case MODULE_IMAGE_PREVIEW:
      return import('../ImagePreview/ImagePreview.ipc.js')
    case MODULE_BASE_64:
      return import('../Base64/Base64.ipc.js')
    case MODULE_BLOB:
      return import('../Blob/Blob.ipc.js')
    case MODULE_OPEN:
      return import('../Open/Open.ipc.js')
    case MODULE_AUDIO:
      return import('../Audio/Audio.ipc.js')
    case MODULE_VIEWLET_SIDE_BAR:
      return import('../Viewlet/ViewletSideBar.ipc.js')
    case MODULE_VIEWLET_STATUS_BAR:
      return import('../Viewlet/ViewletStatusBar.ipc.js')
    case MODULE_LISTENER:
      return import('../Listener/Listener.ipc.js')
    case MODULE_VIEWLET_SEARCH:
      return import('../Viewlet/ViewletSearch.ipc.js')
    case MODULE_VIEWLET_EDITOR_COMPLETION:
      return import('../Viewlet/ViewletEditorCompletion.ipc.js')
    case MODULE_VIEWLET_Locations:
      return import('../Viewlet/ViewletLocations.ipc.js')
    case MODULE_VIEWLET_PROBLEMS:
      return import('../Viewlet/ViewletProblems.ipc.js')
    default:
      throw new Error(`unknown module "${moduleId}"`)
  }
}

const initializeModule = (module) => {
  return module.__initialize__()
}

const getOrLoadModule = (moduleId) => {
  if (!state.pendingModules[moduleId]) {
    const importPromise = loadModule(moduleId)
    state.pendingModules[moduleId] = importPromise.then(initializeModule)
  }
  return state.pendingModules[moduleId]
}

const getModuleId = (commandId) => {
  switch (commandId) {
    case 'Main.save':
    case 'Main.handleDrop':
    case 'Main.closeActiveEditor':
    case 'Main.closeAllEditors':
    case 'Main.handleTabContextMenu':
    case 'Main.hydrate':
    case 'Main.openUri':
    case 'Main.closeEditor':
    case 'Main.handleTabClick':
    case 'Main.focusFirst':
    case 'Main.focusLast':
    case 'Main.focusPrevious':
    case 'Main.focusNext':
    case 'Main.closeFocusedTab':
    case 'Main.closeOthers':
    case 'Main.closeTabsRight':
    case 'Main.closeTabsLeft':
      return MODULE_MAIN
    case 'ViewletExplorer.focusNext':
    case 'ViewletExplorer.focusPrevious':
    case 'ViewletExplorer.scrollUp':
    case 'ViewletExplorer.scrollDown':
    case 'ViewletExplorer.handleClickCurrent':
    case 'ViewletExplorer.newFile':
    case 'ViewletExplorer.openContainingFolder':
    case 'ViewletExplorer.copyPath':
    case 'ViewletExplorer.copyRelativePath':
    case 'ViewletExplorer.removeDirent':
    case 'ViewletExplorer.newFolder':
    case 'ViewletExplorer.getFocusedDirent':
    case 'ViewletExplorer.handleArrowRight':
    case 'ViewletExplorer.handleArrowLeft':
    case 'ViewletExplorer.focusFirst':
    case 'ViewletExplorer.focusLast':
    case 'ViewletExplorer.renameDirent':
    case 'ViewletExplorer.handleMouseEnter':
    case 'ViewletExplorer.handleMouseLeave':
    case 'ViewletExplorer.handleClick':
    case 'ViewletExplorer.handleContextMenu':
    case 'ViewletExplorer.handleWheel':
    case 'ViewletExplorer.setDeltaY':
    case 'ViewletExplorer.handlePaste':
    case 'ViewletExplorer.handleCopy':
    case 'ViewletExplorer.cancelRename':
    case 'ViewletExplorer.acceptRename':
    case 'ViewletExplorer.cancelNewFile':
    case 'ViewletExplorer.acceptNewFile':
    case 'ViewletExplorer.expandAll':
    case 'ViewletExplorer.collapseAll':
      return MODULE_VIEWLET_EXPLORER
    case 'ColorThemeFromJson.createColorThemeFromJson':
      return MODULE_COLOR_THEME_FROM_JSON
    case 'ClipBoard.readText':
    case 'ClipBoard.writeText':
    case 'ClipBoard.writeNativeFiles':
    case 'ClipBoard.readNativeFiles':
      return MODULE_CLIP_BOARD
    case 'Ajax.getJson':
    case 'Ajax.getText':
      return MODULE_AJAX
    case 341:
    case 342:
    case 343:
    case 344:
    case 345:
    case 346:
    case 347:
    case 348:
    case 349:
    case 350:
    case 351:
    case 352:
    case 353:
    case 354:
    case 355:
    case 356:
    case 357:
    case 358:
    case 359:
    case 360:
    case 361:
    case 362:
    case 363:
    case 364:
    case 365:
    case 366:
    case 367:
    case 368:
    case 369:
    case 370:
    case 371:
    case 372:
    case 373:
    case 374:
    case 375:
    case 376:
    case 377:
    case 378:
    case 379:
    case 380:
    case 381:
    case 382:
    case 383:
    case 384:
    case 385:
    case 386:
    case 387:
    case 388:
    case 389:
    case 390:
    case 391:
    case 392:
    case 393:
    case 394:
    case 395:
    case 396:
    case 397:
    case 398:
    case 399:
    case 400:
    case 401:
    case 402:
    case 403:
    case 404:
    case 405:
    case 406:
    case 407:
    case 408:
    case 409:
    case 410:
    case 411:
    case 412:
    case 413:
    case 'ExtensionHost.start':
    case 415:
    case 416:
    case 417:
    case 'ExtensionHost.setWorkspaceRoot':
    case 'EditorCursorDown.editorCursorsDown':
    case 'EditorCursorCharacterLeft.editorCursorCharacterLeft':
    case 'EditorCursorCharacterRight.editorCursorsCharacterRight':
    case 'EditorCursorUp.editorCursorsUp':
    case 'EditorType.editorType':
    case 'EditorDeleteLeft.editorDeleteCharacterLeft':
    case 'EditorDeleteRight.editorDeleteCharacterRight':
    case 'EditorInsertLineBreak.editorInsertLineBreak':
    case 'EditorCopyLineUp.editorCopyLineUp':
    case 'EditorCopyLineDown.editorCopyLineDown':
    case 'EditorMoveLineDown.editorMoveLineDown':
    case 'EditorCursorWordLeft.editorCursorWordLeft':
    case 'EditorCursorWordRight.editorCursorWordRight':
    case 'EditorDeleteWordLeft.editorDeleteWordLeft':
    case 'EditorDeleteWordRight.editorDeleteWordRight':
    case 'EditorMoveLineUp.editorMoveLineUp':
    case 'EditorTabCompletion.editorTabCompletion':
    case 'EditorCursorHome.editorCursorsHome':
    case 'EditorCursorEnd.editorCursorEnd':
    case 'EditorHandleSingleClick.editorHandleSingleClick':
    case 'EditorSelectWord.editorSelectWord':
    case 'EditorToggleBlockComment.editorToggleBlockComment':
    case 'EditorMoveSelection.editorMoveSelection':
    case 'EditorCut.editorCut':
    case 'EditorCopy.editorCopy':
    case 'EditorSelectAll.editorSelectAll':
    case 'EditorMoveRectangleSelection.editorMoveRectangleSelection':
    case 'EditorCursorWordPartRight.editorCursorWordPartRight':
    case 'EditorCursorWordPartLeft.editorCursorWordPartLeft':
    case 'EditorBlur.editorBlur':
    case 'EditorToggleComment.editorToggleComment':
    case 'EditorDeleteAllLeft.editorDeleteAllLeft':
    case 'EditorDeleteAllRight.editorDeleteAllRight':
    case 'EditorHandleTripleClick.editorHandleTripleClick':
    case 'EditorSelectLine.editorSelectLine':
    case 'EditorSave.editorSave':
    case 'EditorHandleContextMenu.editorHandleContextMenu':
    case 'EditorSelectCharacterLeft.editorSelectCharacterLeft':
    case 'EditorSelectCharacterRight.editorSelectCharacterRight':
    case 'EditorPasteText.editorPasteText':
    case 'EditorPaste.editorPaste':
    case 'EditorSetDeltaY.editorSetDeltaY':
    case 'EditorHandleDoubleClick.editorHandleDoubleClick':
    case 'EditorMoveSelectionPx.editorMoveSelectionPx':
    case 'EditorMoveRectangleSelectionPx.editorMoveRectangleSelectionPx':
    case 'EditorFormat.editorFormat':
    case 'EditorHandleMouseMove.editorHandleMouseMove':
    case 'EditorSelectNextOccurrence.editorSelectNextOccurrence':
    case 'EditorSelectAllOccurrences.editorSelectAllOccurrences':
    case 'EditorHandleTab.editorHandleTab':
    case 'EditorCancelSelection.editorCancelSelection':
    case 'EditorUnindent.editorUnindent':
    case 'EditorUndo.editorUndo':
    case 'EditorCursorSet.editorCursorSet':
    case 'EditorDeleteWordPartLeft.editorDeleteWordPartLeft':
    case 'EditorDeleteWordPartRight.editorDeleteWordPartRight':
    case 'EditorHandleScrollBarMove.editorHandleScrollBarMove':
    case 'EditorHandleScrollBarClick.editorHandleScrollBarClick':
    case 'EditorSelectWordRight.editorSelectWordRight':
    case 'EditorSelectWordLeft.editorSelectWordLeft':
    case 'EditorSelectInsideString.editorSelectInsideString':
    case 'EditorHandleTouchStart.editorHandleTouchStart':
    case 'EditorHandleTouchMove.editorHandleTouchMove':
    case 'EditorHandleTouchEnd.editorHandleTouchEnd':
    case 'EditorHandleBeforeInputFromContentEditable.handleBeforeInputFromContentEditable':
    case 'EditorHandleNativeSelectionChange.editorHandleNativeSelectionChange':
    case 'EditorCommandIndentMore.editorIndentMore':
    case 'EditorCommandIndentLess.editorIndentLess':
    case 'EditorComposition.editorCompositionStart':
    case 'EditorComposition.editorCompositionUpdate':
    case 'EditorComposition.editorCompositionEnd':
    case 'EditorGoToDefinition.editorGoToDefinition':
    case 'EditorHandleMouseMoveWithAltKey.editorHandleMouseMoveWithAltKey':
    case 'EditorCompletion.open':
    case 'EditorCompletion.close':
    case 'EditorCompletion.openFromType':
    case 'EditorSetLanguageId.setLanguageId':
    case 'EditorGoToTypeDefinition.editorGoToTypeDefinition':
    case 'EditorApplyEdit.editorApplyEdit':
    case 'EditorSetDecorations.setDecorations':
      return MODULE_EDITOR_COMMAND
    case 'ErrorHandling.handleError':
      return MODULE_ERROR_HANDLING
    case 'FileSystem.readFile':
    case 'FileSystem.remove':
    case 'FileSystem.readDirWithFileTypes':
      return MODULE_FILE_SYSTEM
    case 'ViewletSideBar.showOrHideViewlet':
    case 'ViewletSideBar.openViewlet':
      return MODULE_VIEWLET_SIDE_BAR
    case 'ViewletStatusBar.updateStatusBarItems':
      return MODULE_STATUS_BAR
    case 'Panel.tabsHandleClick':
    case 'Panel.openViewlet':
    case 'Panel.create':
      return MODULE_PANEL
    case 'Developer.getStartupPerformanceContent':
    case 'Developer.getMemoryUsageContent':
    case 'Developer.allocateMemoryInSharedProcess':
    case 'Developer.crashSharedProcess':
    case 'Developer.createSharedProcessHeapSnapshot':
    case 'Developer.createSharedProcessProfile':
    case 'Developer.showIconThemeCss':
    case 'Developer.reloadIconTheme':
    case 'Developer.clearCache':
    case 'Developer.reloadColorTheme':
    case 'Developer.showColorThemeCss':
    case 'Developer.toggleDeveloperTools':
    case 'Developer.crashMainProcess':
    case 'Developer.showStartupPerformance':
    case 'Developer.showMemoryUsage':
    case 'Developer.openConfigFolder':
    case 'Developer.openDataFolder':
    case 'Developer.openLogsFolder':
    case 'Developer.openCacheFolder':
    case 'Developer.openProcessExplorer':
      return MODULE_DEVELOPER
    case 'ViewletExtensions.openSuggest':
    case 'ViewletExtensions.closeSuggest':
    case 'ViewletExtensions.toggleSuggest':
    case 'ViewletExtensions.handleInput':
    case 'ViewletExtensions.handleContextMenu':
    case 'ViewletExtensions.handleInstall':
    case 'ViewletExtensions.handleUninstall':
    case 'ViewletExtensions.handleClick':
    case 'ViewletExtensions.focusIndex':
    case 'ViewletExtensions.focusFirst':
    case 'ViewletExtensions.focusLast':
    case 'ViewletExtensions.focusPrevious':
    case 'ViewletExtensions.focusNext':
    case 'ViewletExtensions.handleWheel':
    case 'ViewletExtensions.focusNextPage':
    case 'ViewletExtensions.focusPreviousPage':
    case 'ViewletExtensions.setDeltaY':
    case 'ViewletExtensions.handleScrollBarMove':
    case 'ViewletExtensions.handleScrollBarClick':
      return MODULE_VIEWLET_EXTENSIONS
    case 'Notification.create':
    case 'Notification.dispose':
    case 'Notification.showWithOptions':
    case 'Notification.handleClick':
      return MODULE_NOTIFICATION
    case 'ContextMenu.select':
    case 'ContextMenu.show':
    case 'ContextMenu.hide':
    case 'ContextMenu.focusFirst':
    case 'ContextMenu.focusLast':
    case 'ContextMenu.focusNext':
    case 'ContextMenu.focusPrevious':
    case 'ContextMenu.selectCurrent':
    case 'ContextMenu.noop':
      return MODULE_CONTEXT_MENU
    case 'ViewletEditorCompletion.dispose':
    case 'ViewletEditorCompletion.selectIndex':
    case 'ViewletEditorCompletion.focusFirst':
    case 'ViewletEditorCompletion.focusLast':
    case 'ViewletEditorCompletion.focusNext':
    case 'ViewletEditorCompletion.focusPrevious':
    case 'ViewletEditorCompletion.selectCurrent':
      return MODULE_VIEWLET_EDITOR_COMPLETION
    case 'EditorCursorDown.editorCursorsDown':
    case 'EditorCursorCharacterLeft.editorCursorCharacterLeft':
    case 'EditorCursorCharacterRight.editorCursorsCharacterRight':
    case 'EditorCursorUp.editorCursorsUp':
    case 'EditorType.editorType':
    case 'EditorDeleteLeft.editorDeleteCharacterLeft':
    case 'EditorDeleteRight.editorDeleteCharacterRight':
    case 'EditorInsertLineBreak.editorInsertLineBreak':
    case 'EditorCopyLineUp.editorCopyLineUp':
    case 'EditorCopyLineDown.editorCopyLineDown':
    case 'EditorMoveLineDown.editorMoveLineDown':
    case 'EditorCursorWordLeft.editorCursorWordLeft':
    case 'EditorCursorWordRight.editorCursorWordRight':
    case 'EditorDeleteWordLeft.editorDeleteWordLeft':
    case 'EditorDeleteWordRight.editorDeleteWordRight':
    case 'EditorMoveLineUp.editorMoveLineUp':
    case 'EditorTabCompletion.editorTabCompletion':
    case 'EditorCursorHome.editorCursorsHome':
    case 'EditorCursorEnd.editorCursorEnd':
    case 'EditorHandleSingleClick.editorHandleSingleClick':
    case 'EditorSelectWord.editorSelectWord':
    case 'EditorToggleBlockComment.editorToggleBlockComment':
    case 'EditorMoveSelection.editorMoveSelection':
    case 'EditorCut.editorCut':
    case 'EditorCopy.editorCopy':
    case 'EditorSelectAll.editorSelectAll':
    case 'EditorMoveRectangleSelection.editorMoveRectangleSelection':
    case 'EditorCursorWordPartRight.editorCursorWordPartRight':
    case 'EditorCursorWordPartLeft.editorCursorWordPartLeft':
    case 'EditorBlur.editorBlur':
    case 'EditorToggleComment.editorToggleComment':
    case 'EditorDeleteAllLeft.editorDeleteAllLeft':
    case 'EditorDeleteAllRight.editorDeleteAllRight':
    case 'EditorHandleTripleClick.editorHandleTripleClick':
    case 'EditorSelectLine.editorSelectLine':
    case 'EditorSave.editorSave':
    case 'EditorHandleContextMenu.editorHandleContextMenu':
    case 'EditorSelectCharacterLeft.editorSelectCharacterLeft':
    case 'EditorSelectCharacterRight.editorSelectCharacterRight':
    case 'EditorPasteText.editorPasteText':
    case 'EditorPaste.editorPaste':
    case 'EditorSetDeltaY.editorSetDeltaY':
    case 'EditorHandleDoubleClick.editorHandleDoubleClick':
    case 'EditorMoveSelectionPx.editorMoveSelectionPx':
    case 'EditorMoveRectangleSelectionPx.editorMoveRectangleSelectionPx':
    case 'EditorFormat.editorFormat':
    case 'EditorHandleMouseMove.editorHandleMouseMove':
    case 'EditorSelectNextOccurrence.editorSelectNextOccurrence':
    case 'EditorSelectAllOccurrences.editorSelectAllOccurrences':
    case 'EditorHandleTab.editorHandleTab':
    case 'EditorCancelSelection.editorCancelSelection':
    case 'EditorUnindent.editorUnindent':
    case 'EditorUndo.editorUndo':
    case 'EditorCursorSet.editorCursorSet':
    case 'EditorDeleteWordPartLeft.editorDeleteWordPartLeft':
    case 'EditorDeleteWordPartRight.editorDeleteWordPartRight':
    case 'EditorHandleScrollBarMove.editorHandleScrollBarMove':
    case 'EditorHandleScrollBarClick.editorHandleScrollBarClick':
    case 'EditorSelectWordRight.editorSelectWordRight':
    case 'EditorSelectWordLeft.editorSelectWordLeft':
    case 'EditorSelectInsideString.editorSelectInsideString':
    case 'EditorHandleTouchStart.editorHandleTouchStart':
    case 'EditorHandleTouchMove.editorHandleTouchMove':
    case 'EditorHandleTouchEnd.editorHandleTouchEnd':
    case 'EditorHandleBeforeInputFromContentEditable.handleBeforeInputFromContentEditable':
    case 'EditorHandleNativeSelectionChange.editorHandleNativeSelectionChange':
    case 'EditorCommandIndentMore.editorIndentMore':
    case 'EditorCommandIndentLess.editorIndentLess':
    case 'EditorComposition.editorCompositionStart':
    case 'EditorComposition.editorCompositionUpdate':
    case 'EditorComposition.editorCompositionEnd':
    case 'EditorGoToDefinition.editorGoToDefinition':
    case 'EditorHandleMouseMoveWithAltKey.editorHandleMouseMoveWithAltKey':
    case 'EditorCompletion.open':
    case 'EditorCompletion.close':
    case 'EditorCompletion.openFromType':
    case 'EditorSetLanguageId.setLanguageId':
    case 'EditorGoToTypeDefinition.editorGoToTypeDefinition':
    case 'EditorApplyEdit.editorApplyEdit':
    case 'EditorSetDecorations.setDecorations':
      return MODULE_EDITOR_COMMAND
    case 'Layout.showSideBar':
    case 'Layout.hideSideBar':
    case 'Layout.toggleSideBar':
    case 'Layout.showPanel':
    case 'Layout.hidePanel':
    case 'Layout.togglePanel':
    case 'Layout.showActivityBar':
    case 'Layout.hideActivityBar':
    case 'Layout.toggleActivityBar':
    case 'Layout.hydrate':
    case 'Layout.hide':
    case 'Layout.handleResize':
    case 'Layout.handleSashPointerMove':
    case 'Layout.handleSashPointerDown':
      return MODULE_LAYOUT
    case 'Preferences.openSettingsJson':
    case 'Preferences.openSettingsJson':
    case 'Preferences.openKeyBindingsJson':
    case 'Preferences.hydrate':
      return MODULE_PREFERENCES
    case 1300:
      return MODULE_SOURCE_CONTROL
    case 'Open.openNativeFolder':
      return MODULE_OPEN
    case 'ColorPicker.open':
    case 'ColorPicker.close':
      return MODULE_COLOR_PICKER
    case 1422:
    case 1423:
      return MODULE_KEY_BINDINGS
    case 'Dialog.openFolder':
    case 'Dialog.showAbout':
    case 'Dialog.showMessage':
    case 'Dialog.close':
    case 'Dialog.handleClick':
      return MODULE_DIALOG
    case 1592:
      return MODULE_COMMAND_INFO
    case 2133:
      return MODULE_VIEWLET
    case 2260:
      return MODULE_VIEWLET_STATUS_BAR
    case 'IconTheme.getIconThemeCss':
    case 'IconTheme.hydrate':
    case 'IconTheme.addIcons':
      return MODULE_ICON_THEME
    case 'EditorRename.open':
    case 'EditorRename.finish':
    case 'EditorRename.abort':
      return MODULE_EDITOR_RENAME
    case 'Format.hydrate':
      return MODULE_FORMAT
    case 3444:
      return MODULE_LISTENER
    case 3900:
      return MODULE_EDITOR_ERROR
    case 'Blob.base64StringToBlob':
      return MODULE_BLOB
    case 'Audio.playBell':
      return MODULE_AUDIO
    case 4510:
    case 4511:
    case 4512:
    case 4513:
    case 4514:
    case 4515:
    case 4516:
    case 4517:
    case 4518:
    case 4519:
      return MODULE_TITLE_BAR
    case 'TitleBarMenuBar.toggleIndex':
    case 'TitleBarMenuBar.hydrate':
    case 'TitleBarMenuBar.focus':
    case 'TitleBarMenuBar.focusIndex':
    case 'TitleBarMenuBar.focusPrevious':
    case 'TitleBarMenuBar.focusNext':
    case 'TitleBarMenuBar.closeMenu':
    case 'TitleBarMenuBar.openMenu':
    case 'TitleBarMenuBar.handleKeyArrowDown':
    case 'TitleBarMenuBar.handleKeyArrowUp':
    case 'TitleBarMenuBar.handleKeyArrowRight':
    case 'TitleBarMenuBar.handleKeyHome':
    case 'TitleBarMenuBar.handleKeyEnd':
    case 'TitleBarMenuBar.handleKeySpace':
    case 'TitleBarMenuBar.handleKeyEnter':
    case 'TitleBarMenuBar.handleKeyEscape':
    case 'TitleBarMenuBar.handleKeyArrowLeft':
      return MODULE_TITLE_BAR_MENU
    case 4870:
    case 4871:
      return MODULE_VIEWLET_TERMINAL
    case 'FindInWorkspace.findInWorkspace':
      return MODULE_FIND_IN_WORKSPACE
    case 'RecentlyOpened.getRecentlyOpened':
    case 'RecentlyOpened.clearRecentlyOpened':
    case 'RecentlyOpened.addToRecentlyOpened':
    case 'RecentlyOpened.hydrate':
      return MODULE_RECENTLY_OPENED
    case 'ColorTheme.hydrate':
    case 'ColorTheme.setColorTheme':
      return MODULE_COLOR_THEME
    case 'Navigation.focusPreviousPart':
    case 'Navigation.focusNextPart':
    case 'Navigation.focusActivityBar':
    case 'Navigation.focusStatusBar':
    case 'Navigation.focusPanel':
    case 'Navigation.focusSideBar':
    case 'Navigation.focusTitleBar':
    case 'Navigation.focusMain':
      return MODULE_NAVIGATION
    case 'ServiceWorker.hydrate':
    case 'ServiceWorker.uninstall':
      return MODULE_SERVICE_WORKER
    case 'SourceControl.updateDecorations':
      return MODULE_VIEWLET_SOURCE_CONTROL
    case 'SaveState.hydrate':
      return MODULE_SAVE_STATE
    case 'SessionStorage.clear':
    case 'SessionStorage.getJson':
      return MODULE_SESSION_STORAGE
    case 'CacheStorage.clearCache':
    case 'CacheStorage.setJson':
    case 'CacheStorage.getJson':
      return MODULE_CACHE_STORAGE
    case 'LocalStorage.clear':
    case 'LocalStorage.setJson':
    case 'LocalStorage.getJson':
    case 'LocalStorage.getText':
    case 'LocalStorage.setText':
    case 'LocalStorage.getItem':
      return MODULE_LOCAL_STORAGE
    case 'ViewletLocations.selectIndex':
    case 'ViewletLocations.focusFirst':
    case 'ViewletLocations.focusLast':
    case 'ViewletLocations.focusNext':
    case 'ViewletLocations.focusPrevious':
    case 'ViewletLocations.selectCurrent':
    case 'ViewletLocations.focusIndex':
      return MODULE_VIEWLET_Locations
    case 'Menu.show':
    case 'Menu.hide':
    case 'Menu.selectIndex':
    case 'Menu.focusNext':
    case 'Menu.focusPrevious':
    case 'Menu.focusFirst':
    case 'Menu.focusLast':
    case 'Menu.focusIndex':
    case 'Menu.handleMouseEnter':
      return MODULE_MENU
    case 'ViewletProblems.focusIndex':
      return MODULE_VIEWLET_PROBLEMS
    case 'Workspace.setPath':
    case 'Workspace.hydrate':
    case 'Workspace.setUri':
      return MODULE_WORKSPACE
    case 7650:
    case 7651:
      return MODULE_EXTENSIONS
    case 'Base64.decode':
      return MODULE_BASE_64
    case 'ActivityBar.toggleItem':
    case 'ActivityBar.handleClick':
    case 'ActivityBar.handleContextMenu':
    case 'ActivityBar.focus':
    case 'ActivityBar.focusNext':
    case 'ActivityBar.focusPrevious':
    case 'ActivityBar.focusFirst':
    case 'ActivityBar.focusLast':
    case 'ActivityBar.selectCurrent':
    case 'ActivityBar.getItems':
    case 'ActivityBar.getHiddenItems':
    case 'ActivityBar.updateSourceControlCount':
    case 'ActivityBar.handleSideBarViewletChange':
    case 'ActivityBar.handleSideBarHidden':
      return MODULE_ACTIVITY_BAR
    case 'Window.reload':
    case 'Window.minimize':
    case 'Window.maximize':
    case 'Window.unmaximize':
    case 'Window.close':
    case 'Window.makeScreenshot':
    case 'Window.openNew':
    case 'Window.exit':
      return MODULE_WINDOW
    case 'EditorDiagnostics.hydrate':
      return MODULE_EDITOR_DIAGNOSTICS
    case 'KeyBindingsInitial.getKeyBindings':
      return MODULE_KEY_BINDINGS_INITIAL
    case 'ImagePreview.show':
    case 'ImagePreview.hide':
      return MODULE_IMAGE_PREVIEW
    case 'ViewletSearch.handleInput':
    case 'ViewletSearch.handleClick':
      return MODULE_VIEWLET_SEARCH
    case 47110:
      return MODULE_WORKBENCH
    case 'Callback.resolve':
    case 'Callback.reject':
      return MODULE_CALLBACK
    case 'QuickPick.openEverythingQuickPick':
    case 'QuickPick.dispose':
    case 'QuickPick.selectCurrentIndex':
    case 'QuickPick.handleInput':
    case 'QuickPick.selectIndex':
    case 'QuickPick.openCommandPalette':
    case 'QuickPick.openView':
    case 'QuickPick.focusFirst':
    case 'QuickPick.focusLast':
    case 'QuickPick.focusPrevious':
    case 'QuickPick.focusNext':
    case 'QuickPick.openGoToLine':
    case 'QuickPick.openColorTheme':
    case 'QuickPick.fileOpenRecent':
    case 'QuickPick.handleBlur':
    case 'QuickPick.showExtensionsQuickPick':
      return MODULE_QUICK_PICK
    case 'FindWidget.create':
    case 'FindWidget.dispose':
    case 'FindWidget.setValue':
    case 'FindWidget.dispose':
      return MODULE_FIND_WIDGET
    default:
      throw new Error(`command ${commandId} not found`)
  }
}

const loadCommand = (command) => getOrLoadModule(getModuleId(command))

export const register = (commandId, listener) => {
  state.commands[commandId] = listener
}

const hasThrown = new Set()

export const execute = (command, ...args) => {
  if (command in state.commands) {
    return state.commands[command](...args)
  }
  return (
    loadCommand(command)
      // TODO can skip then block in prod (only to prevent endless loop in dev)
      .then(() => {
        if (!(command in state.commands)) {
          if (hasThrown.has(command)) {
            return
          }
          hasThrown.add(command)
          throw new Error(`Command did not register "${command}"`)
        }
        return execute(command, ...args)
      })
  )
}
