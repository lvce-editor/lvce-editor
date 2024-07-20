export interface EditorCreateOptions {
  readonly id: number
  readonly content: string
  readonly savedDeltaY: number
  readonly rowHeight: number
  readonly fontSize: number
  readonly hoverEnabled: boolean
  readonly letterSpacing: number
  readonly tabSize: number
  readonly links: any
  readonly lineNumbers: boolean
  readonly formatOnSave: boolean
  readonly isAutoClosingBracketsEnabled: boolean
  readonly isAutoClosingTagsEnabled: boolean
  readonly isAutoClosingQuotesEnabled: boolean
  readonly isQuickSuggestionsEnabled: boolean
  readonly completionTriggerCharacters: any
  readonly savedSelections: any
  readonly languageId: string
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}
