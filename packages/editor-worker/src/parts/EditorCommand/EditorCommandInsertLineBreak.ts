import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as Languages from '../Languages/Languages.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

const getIncreaseIndentRegex = (languageConfiguration: any): RegExp | undefined => {
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

const shouldIncreaseIndent = (before: any, increaseIndentRegex: any) => {
  if (!increaseIndentRegex) {
    return false
  }
  return increaseIndentRegex.test(before)
}

const getChanges = (lines: string[], selections: any, languageConfiguration: any) => {
  const changes: any[] = []
  const selectionChanges: any[] = []
  const increaseIndentRegex = getIncreaseIndentRegex(languageConfiguration)
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
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
          inserted: ['', indent + '  ', indent],
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

export const insertLineBreak = async (editor: any) => {
  const { lines, selections } = editor
  const languageConfiguration = await Languages.getLanguageConfiguration(editor)
  const { changes, selectionChanges } = getChanges(lines, selections, languageConfiguration)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
