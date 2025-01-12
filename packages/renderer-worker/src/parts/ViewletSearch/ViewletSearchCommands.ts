import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'
import * as WrapTextSearchCommand from './WrapTextSearchCommand.ts'
import * as ViewletSearch from './ViewletSearch.ts'

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
  'focusNextInput',
  'focusNextPage',
  'focusPreserveCasePrevious',
  'focusPrevious',
  'focusPreviousInput',
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
  'handleExcludeInput',
  'handleFocusIn',
  'handleHeaderClick',
  'handleIconThemeChange',
  'handleIconThemeChange',
  'handleIncludeInput',
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

Commands['hotReload'] = ViewletSearch.hotReload

export const saveState = (state) => {
  return TextSearchWorker.invoke(`TextSearch.saveState`, state.uid)
}
