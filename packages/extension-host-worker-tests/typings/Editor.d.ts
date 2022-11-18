declare const Editor: {
  readonly copyLineDown: () => Promise<void>
  readonly cursorCharacterLeft: () => Promise<void>
  readonly cursorCharacterRight: () => Promise<void>
  readonly cursorDown: () => Promise<void>
  readonly cursorUp: () => Promise<void>
  readonly cursorWordLeft: () => Promise<void>
  readonly cursorWordRight: () => Promise<void>
  readonly executeBraceCompletion: (brace: string) => Promise<void>
  readonly executeTabCompletion: () => Promise<void>
  readonly findAllReferences: () => Promise<void>
  readonly goToDefinition: () => Promise<void>
  readonly goToTypeDefinition: () => Promise<void>
  readonly openCompletion: () => Promise<void>
  readonly openEditorContextMenu: () => Promise<void>
  readonly openFindWidget: () => Promise<void>
  readonly setCursor: (rowIndex: number, columnIndex: number) => Promise<void>
  readonly setSelections: (selections: Uint32Array) => Promise<void>
  readonly type: (text: string) => Promise<void>
  readonly setDeltaY: (deltaY: number) => Promise<void>
  readonly format: () => Promise<void>
  readonly deleteLeft: () => Promise<void>
}
