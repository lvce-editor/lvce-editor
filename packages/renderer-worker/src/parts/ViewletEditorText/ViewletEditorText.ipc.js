import * as ViewletEditorText from './ViewletEditorText.js'

export const name = 'EditorText'

// prettier-ignore
export const Events = {
  'languages.changed': ViewletEditorText.handleLanguagesChanged,
  // 'editor.change': ViewletEditorText.handleEditorChange,
  // 'tokenizer.changed': ViewletEditorText.handleTokenizeChange,
}

export * from './ViewletEditorText.js'
export * from './ViewletEditorTextCommands.js'
export * from './ViewletEditorTextCss.js'
export * from './ViewletEditorTextKeyBindings.js'
