import * as ViewletEditorText from './ViewletEditorText.js'

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
export * from './ViewletEditorTextMenuEntries.js'
export * from './ViewletEditorTextName.js'
export * from './ViewletEditorTextSaveState.js'
