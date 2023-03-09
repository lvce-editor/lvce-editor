import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'
import * as Languages from '../Languages/Languages.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

const getIncreaseIndentRegex = (languageConfiguration) => {
  if (
    languageConfiguration &&
    languageConfiguration.indentationRules &&
    languageConfiguration.indentationRules.increaseIndentPattern &&
    typeof languageConfiguration.indentationRules.increaseIndentPattern === 'string'
  ) {
    const regex = new RegExp(languageConfiguration.indentationRules.increaseIndentPattern)
    return regex
  }
  return undefined
}

const shouldIncreaseIndent = (before, increaseIndentRegex) => {
  if (!increaseIndentRegex) {
    return false
  }
  return increaseIndentRegex.test(before)
}

const getChanges = (lines, selections, languageConfiguration) => {
  const changes = []
  const selectionChanges = []
  const increaseIndentRegex = getIncreaseIndentRegex(languageConfiguration)
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    const start = {
      rowIndex: selectionStartRow,
      columnIndex: selectionStartColumn,
    }
    const end = {
      rowIndex: selectionEndRow,
      columnIndex: selectionEndColumn,
    }
    const range = {
      start,
      end,
    }

    if (EditorSelection.isEmpty(selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn)) {
      const line = lines[selectionStartRow]
      const before = line.slice(0, selectionStartColumn)
      const indent = TextDocument.getIndent(before)
      if (shouldIncreaseIndent(before, increaseIndentRegex)) {
        changes.push({
          start: start,
          end: end,
          inserted: ['', indent + '  ', ''],
          deleted: TextDocument.getSelectionText({ lines }, range),
          origin: EditOrigin.InsertLineBreak,
        })
        selectionChanges.push(selectionStartRow + 1, indent.length + 2, selectionStartRow + 1, indent.length + 2)
      } else {
        changes.push({
          start: start,
          end: end,
          inserted: ['', indent],
          deleted: TextDocument.getSelectionText({ lines }, range),
          origin: EditOrigin.InsertLineBreak,
        })
        selectionChanges.push(selectionStartRow + 1, indent.length, selectionStartRow + 1, indent.length)
      }
    } else {
      changes.push({
        start: start,
        end: end,
        inserted: ['', ''],
        deleted: TextDocument.getSelectionText({ lines }, range),
        origin: EditOrigin.InsertLineBreak,
      })
      selectionChanges.push(selectionStartRow + 1, 0, selectionStartRow + 1, 0)
    }
  }
  return { changes, selectionChanges: new Uint32Array(selectionChanges) }
}

export const insertLineBreak = async (editor) => {
  const { lines, selections } = editor
  const languageConfiguration = await Languages.getLanguageConfiguration(editor)
  const { changes, selectionChanges } = getChanges(lines, selections, languageConfiguration)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
