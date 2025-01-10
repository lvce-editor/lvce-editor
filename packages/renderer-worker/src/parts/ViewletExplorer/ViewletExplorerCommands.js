import * as ViewletExplorer from './ViewletExplorer.js'
import * as WrapExplorerCommand from '../WrapExplorerCommand/WrapExplorerCommand.ts'

const commands = [
  'cancelEdit',
  'collapseAll',
  'copyPath',
  'copyRelativePath',
  'expandAll',
  'getFocusedDirent',
  'handleArrowLeft',
  'handleArrowRight',
  'handleBlur',
  'handleClick',
  'handleClickAt',
  'handleClickCurrent',
  'handleClickCurrentButKeepFocus',
  'handleCopy',
  'handleMouseEnter',
  'handleMouseLeave',
  'handleWheel',
  'newFile',
  'newFolder',
  'openContainingFolder',
  'removeDirent',
  'rename',
  'renameDirent',
  'revealItem',
  'scrollDown',
  'scrollUp',
  'setDeltaY',
  'updateEditingValue',
  'handleFocus',
  'refresh',
  'handleClickOpenFolder',
  'hotReload',
  'expandRecursively',
  'focus',
  'focusFirst',
  'focusIndex',
  'focusLast',
  'focusNext',
  'focusNone',
  'focusPrevious',
  'handleContextMenu',
  'handleDragOver',
  'handleDrop',
  'handlePaste',
  'acceptEdit',
  'handlePointerDown',
]

export const Commands = {}

for (const command of commands) {
  Commands[command] = WrapExplorerCommand.wrapExplorerCommand(command)
}

Commands['hotReload'] = ViewletExplorer.hotReload
Commands['handleFocus'] = ViewletExplorer.handleFocus
