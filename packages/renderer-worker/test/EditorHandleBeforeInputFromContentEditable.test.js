import * as EditorHandleBeforeInputFromContentEditable from '../src/parts/EditorCommand/EditorCommandHandleNativeBeforeInputFromContentEditable.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorHandleBeforeInputFromContentEditable', () => {
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
    selections: [],
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(
    EditorHandleBeforeInputFromContentEditable.handleBeforeInputFromContentEditable(
      editor,
      '',
      {
        startRowIndex: 10,
        startColumnIndex: 10,
        endRowIndex: 10,
        endColumnIndex: 14,
      }
    )
  ).toMatchObject({
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
      '  border: ;',
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
    selections: [
      {
        end: {
          columnIndex: 10,
          rowIndex: 10,
        },
        start: {
          columnIndex: 10,
          rowIndex: 10,
        },
      },
    ],
  })
})
