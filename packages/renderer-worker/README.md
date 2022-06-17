# renderer-worker

The `renderer-worker` runs in a browser is a used for the logic of the application.

- `renderer-worker` is created by `renderer-process`
- `renderer-worker` and `renderer-process` can communicate via a `postMessage`
- `renderer-worker` can communicate with `shared-process` via a WebSocket (e.g. reading file from file system, ...)

## Commands

| Module           | Id   | Name                                                      | Parameters                     |
| ---------------- | ---- | --------------------------------------------------------- | ------------------------------ |
| MAIN             | 87   | Main.handleContextMenu                                    | x, y                           |
| MAIN             | 88   | Main.openEditor                                           | file                           |
| MAIN             | 89   | Main.save                                                 | -                              |
| MAIN             | 90   | Main.setText                                              | text                           |
| MAIN             | 92   | Main.handleDrop                                           | -                              |
| MAIN             | 93   | Main.closeActiveEditor                                    | -                              |
| MAIN             | 94   | Main.closeAllEditors                                      | -                              |
| VIEWLET_EXPLORER | 142  | ViewletExplorer.focusNext                                 | -                              |
| VIEWLET_EXPLORER | 143  | ViewletExplorer.focusPrevious                             | -                              |
| VIEWLET_EXPLORER | 144  | ViewletEXplorer.scrollUp                                  | -                              |
| VIEWLET_EXPLORER | 145  | ViewletExplorer.scrollDown                                | -                              |
| VIEWLET_EXPLORER | 146  | ViewletExplorer.handleClickCurrent                        | -                              |
| VIEWLET_EXPLORER | 147  | ViewletExplorer.newFile                                   | -                              |
| VIEWLET_EXPLORER | 148  | ViewletExplorer.openContainingFolder                      | -                              |
| VIEWLET_EXPLORER | 149  | ViewletExplorer.copyPath                                  | -                              |
| VIEWLET_EXPLORER | 150  | ViewletExplorer.copyRelativePath                          | -                              |
| VIEWLET_EXPLORER | 151  | ViewletExplorer.removeDirent                              | -                              |
| VIEWLET_EXPLORER | 152  | ViewletExplorer.newFolder                                 | -                              |
| EDITOR           | 341  | EditorCursorDown.editorCursorDown                         | -                              |
| EDITOR           | 342  | EditorCursorLeft.editorCursorLeft                         | -                              |
| EDITOR           | 343  | EditorCursorUp.editorCursorsRight                         | -                              |
| EDITOR           | 344  | EditorCursorUp.editorCursorUp                             | -                              |
| EDITOR           | 345  | EditorType.editorType                                     | text                           |
| EDITOR           | 346  | EditorDeleteLeft.editorDeleteLeft                         | -                              |
| EDITOR           | 347  | EditorDeleteRight.editorDeleteRight                       | -                              |
| EDITOR           | 348  | EditorInsertLineBreak.editorInsertLineBreak               | -                              |
| EDITOR           | 349  | EditorCopyLineUp.editorCopyLineUp                         | -                              |
| EDITOR           | 350  | EditorCopyLineDown.editorCopyLineDown                     | -                              |
| EDITOR           | 351  | EditorMoveLineDown.editorMoveLineDown                     | -                              |
| EDITOR           | 352  | EditorCursorWordLeft.editorCursorWordLeft                 | -                              |
| EDITOR           | 353  | EditorCursorWordRight.editorCursorWordRight               | -                              |
| EDITOR           | 354  | EditorDeleteWordLeft.editorDeleteWordLeft                 | -                              |
| EDITOR           | 355  | EditorDeleteWordRight.editorDeleteWordRight               | -                              |
| EDITOR           | 356  | EditorMoveLineUp.editorMoveLineUp                         | -                              |
| EDITOR           | 357  | EditorTabCompletion.editorTabCompletion                   | -                              |
| EDITOR           | 358  | EditorCursorsHome.editorCursorsHome                       | -                              |
| EDITOR           | 359  | EditorCursorsEnd.editorCursorsEnd                         | -                              |
| EDITOR           | 360  | EditorHandleClick.editorHandleClick                       | rowIndex, columnIndex          |
| EDITOR           | 361  | EditorHandleDoubleClick.editorHandleDoubleClick           | rowIndex, columnIndex          |
| EDITOR           | 362  | EditorToggleComment.editorToggleComment                   | -                              |
| EDITOR           | 363  | EditorMoveSelection.editorMoveSelection                   | -                              |
| EDITOR           | 364  | EditorCut.editorCut                                       | -                              |
| EDITOR           | 365  | EditorCopy.editorCopy                                     | -                              |
| EDITOR           | 366  | EditorSelectAll.editorSelectAll                           | -                              |
| EDITOR           | 367  | EditorMoveRectangleSelection.editorMoveRectangleSelection | -                              |
| EDITOR           | 368  | EditorCursorWordPartRight.editorCursorWordPartRight       | -                              |
| EDITOR           | 369  | EditorCursorWordPartLeft.editorCursorWordPartLeft         | -                              |
| EDITOR           | 370  |                                                           |                                |
| EDITOR           | 371  |                                                           |                                |
| EDITOR           | 372  |                                                           |                                |
| EDITOR           | 373  |                                                           |                                |
| EDITOR           | 374  | EditorDeleteAllLeft.editorDeleteAllLeft                   | -                              |
| EDITOR           | 375  | EditorDeleteAllRight.editorDeleteAllRight                 | -                              |
| EDITOR           | 376  |                                                           |                                |
| EDITOR           | 377  |                                                           |                                |
| EDITOR           | 378  |                                                           |                                |
| EDITOR           | 379  |                                                           |                                |
| EDITOR           | 380  |                                                           |                                |
| NOTIFICATION     | 900  | Notification.create                                       | type, text                     |
| NOTIFICATION     | 901  | Notification.dispose                                      | id                             |
| CONTEXT_MENU     | 950  | ContextMenu.select                                        | index                          |
| CONTEXT_MENU     | 951  | ContextMenu.show                                          | x, y, context, items, onSelect |
| CONTEXT_MENU     | 952  | ContextMenu.hide                                          | -                              |
| CONTEXT_MENU     | 953  | ContextMenu.focusFirst                                    | -                              |
| CONTEXT_MENU     | 954  | ContextMenu.focusLast                                     | -                              |
| CONTEXT_MENU     | 955  | ContextMenu.focusNext                                     | -                              |
| CONTEXT_MENU     | 956  | ContextMenu.focusPrevious                                 | -                              |
| LAYOUT           | 1100 | Layout.showSideBar                                        | -                              |
| LAYOUT           | 1101 | Layout.hideSideBar                                        | -                              |
| LAYOUT           | 1102 | Layout.toggleSideBar                                      | -                              |
| LAYOUT           | 1103 | Layout.showPanel                                          | -                              |
| LAYOUT           | 1104 | Layout.hidePanel                                          | -                              |
| LAYOUT           | 1105 | Layout.togglePanel                                        | -                              |
| LAYOUT           | 1106 | Layout.showActivityBar                                    | -                              |
| LAYOUT           | 1107 | Layout.hideActivityBar                                    | -                              |
| LAYOUT           | 1108 | Layout.toggleActivityBar                                  | -                              |
| PREFERENCES      | 1200 | Preferences.openSettingsJson                              | -                              |
| PREFERENCES      | 1201 | Preferences.openUserSettings                              | -                              |
| PREFERENCES      | 1202 | Preferences.openDefaultSettings                           | -                              |
| PREFERENCES      | 1203 | Preferences.selectColorTheme                              | -                              |
| ACTIVITY_BAR     | 8000 | ActivityBar.toggleItem                                    | context, item                  |
| ACTIVITY_BAR     | 8001 | ActivityBar.handleClick                                   | viewletId, x, y                |
| ACTIVITY_BAR     | 8002 | ActivityBar.handleContextMenu                             | x,y                            |
| ACTIVITY_BAR     | 8003 | ActivityBar.focus                                         | -                              |
| ACTIVITY_BAR     | 8004 | ActivityBar.focusNext                                     | -                              |
| ACTIVITY_BAR     | 8005 | ActivityBar.focusPrevious                                 | -                              |
| ACTIVITY_BAR     | 8006 | ActivityBar.focusFirstInGroup                             | -                              |
| ACTIVITY_BAR     | 8007 | ActivityBar.focusLastInGroup                              | -                              |
| ACTIVITY_BAR     | 8008 | ActivityBar.selectCurrent                                 | -                              |
| WINDOW           | 8080 | Window.reload                                             | -                              |
| WINDOW           | 8081 | Window.minimize                                           | -                              |
| WINDOW           | 8082 | Window.maximize                                           | -                              |
| WINDOW           | 8083 | Window.unmaximize                                         | -                              |
| WINDOW           | 8084 | Window.close                                              | -                              |
