import * as EditorGetSelectionFromNativeRange from '../src/parts/EditorCommand/EditorCommandGetSelectionFromNativeRange.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorGetSelectionFromNativeRange', () => {
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
      '  font-family: \'Fira Code\', monospace;',
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
    EditorGetSelectionFromNativeRange.getSelectionFromNativeRange(editor, {
      startRowIndex: 10,
      startColumnIndex: 10,
      endRowIndex: 10,
      endColumnIndex: 14,
    })
  ).toEqual({
    start: {
      rowIndex: 10,
      columnIndex: 10,
    },
    end: {
      rowIndex: 10,
      columnIndex: 14,
    },
  })
})
