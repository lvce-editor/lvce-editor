import * as EditorHandleNativeSelectionChange from '../src/parts/EditorCommand/EditorCommandHandleNativeSelectionChange.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorHandleNativeSelectionChange', () => {
  const editor = {
    lines: [
      'h1 {',
      '  font-size: 24px;',
      '}',
      '',
      '.Editor {',
      '  width: 100%;',
      '  height: 100%;',
      '  background: var(--MainBackground);',
      '  color: white;',
      '  outline: none;',
      '  border: none;',
      "  font-family: 'Fira Code', monospace;",
      '  position: relative;',
      '  white-space: pre;',
      '  font-size: 15px;',
      '  letter-spacing: 0.5px;',
      '  contain: strict;',
      '  tab-size: 2;',
      '}',
      '',
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  expect(
    EditorHandleNativeSelectionChange.editorHandleNativeSelectionChange(
      editor,
      {
        startRowIndex: 10,
        startColumnIndex: 10,
        endRowIndex: 10,
        endColumnIndex: 14,
      }
    )
  ).toMatchObject({
    selections: [
      {
        end: { columnIndex: 14, rowIndex: 10 },
        start: { columnIndex: 10, rowIndex: 10 },
      },
    ],
  })
})
