import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'
import * as WrapTextSearchCommand from './WrapTextSearchCommand.ts'

// TODO maybe ask text search worker for the commands it provides
const commands = [
  'clearSearchResults',
  'copy',
  'dismissItem',
  'focusFirst',
  'focusIndex',
  'focusLast',
  'focusMatchCase',
  'focusMatchCasePrevious',
  'focusMatchWholeWord',
  'focusNext',
  'focusNextPage',
  'focusPreserveCasePrevious',
  'focusPrevious',
  'focusPreviousPage',
  'focusRegex',
  'focusRegexNext',
  'focusReplaceAll',
  'focusReplaceValue',
  'focusReplaceValueNext',
  'focusReplaceValuePrevious',
  'focusSearchValue',
  'focusSearchValueNext',
  'handleClick',
  'handleClickAt',
  'handleContextMenu',
  'handleContextMenuKeyboard',
  'handleContextMenuMouseAt',
  'handleFocusIn',
  'handleIconThemeChange',
  'handleIconThemeChange',
  'handleIncludeInput',
  'handleExcludeInput',
  'handleInput',
  'handleListBlur',
  'handleListFocus',
  'handleReplaceInput',
  'handleScrollBarCaptureLost',
  'handleScrollBarClick',
  'handleScrollBarMove',
  'handleScrollBarThumbPointerMove',
  'handleTouchEnd',
  'handleTouchMove',
  'handleTouchStart',
  'handleUpdate',
  'handleWheel',
  'refresh',
  'replaceAll',
  'scrollDown',
  'selectIndex',
  'submit',
  'toggleMatchCase',
  'toggleMatchWholeWord',
  'togglePreserveCase',
  'toggleReplace',
  'toggleSearchDetails',
  'toggleUseRegularExpression',
]

export const Commands = {}

for (const command of commands) {
  Commands[command] = WrapTextSearchCommand.wrapTextSearchCommand(command)
}

export const saveState = (state) => {
  return TextSearchWorker.invoke(`TextSearch.saveState`, state.uid)
}
