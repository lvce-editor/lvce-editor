declare const ContextMenu: {
  readonly selectItem: (name: string) => Promise<void>
}

declare const Editor: {
  readonly setCursor: (rowIndex: number, columnIndex: number) => Promise<void>
  readonly openCompletion: () => Promise<void>
  readonly executeTabCompletion: () => Promise<void>
  readonly openEditorContextMenu: () => Promise<void>
  readonly executeBraceCompletion: (brace: string) => Promise<void>
  readonly cursorUp: () => Promise<void>
  readonly cursorDown: () => Promise<void>
  readonly cursorWordLeft: () => Promise<void>
  readonly cursorWordRight: () => Promise<void>
  readonly cursorCharacterRight: () => Promise<void>
  readonly cursorCharacterLeft: () => Promise<void>
  readonly copyLineDown: () => Promise<void>
}

declare const Explorer: {
  readonly openContextMenu: (index: number) => Promise<void>
  readonly removeDirent: () => Promise<void>
  readonly focusFirst: () => Promise<void>
  readonly focusLast: () => Promise<void>
  readonly focusNext: () => Promise<void>
  readonly clickCurrent: () => Promise<void>

  // TODO maybe rename this to collapse
  readonly handleArrowLeft: () => Promise<void>
}

declare const Extension: {
  readonly addWebExtension: (uri: string) => Promise<void>
}

declare const FileSystem: {
  readonly getTmpDir: () => Promise<string>
  readonly writeFile: (uri: string, content: string) => Promise<void>
  readonly mkdir: (uri: string) => Promise<void>
}

declare const KeyBoard: {
  /**
   * @deprecated this can lead to flaky tests, it might
   * be better execute the corresponding command instead
   *
   */
  readonly press: (key: string) => Promise<void>
}

declare const QuickPick: {
  readonly focusNext: () => Promise<void>
  readonly open: () => Promise<void>
  readonly setValue: (value: string) => Promise<void>
}

declare const SideBar: {
  readonly open: (id: string) => Promise<void>
}

declare const Search: {
  readonly setValue: (value: string) => Promise<void>
}

declare const Workspace: {
  readonly setPath: (uri: string) => Promise<void>
}

declare const Main: {
  readonly openUri: (uri: string) => Promise<void>
}

declare const expect: (locator: any) => {
  readonly toBeVisible: () => Promise<void>
  readonly toHaveCount: (count: number) => Promise<void>
  readonly toHaveText: (text: string) => Promise<void>
  readonly toHaveAttribute: (key: string, value: string | null) => Promise<void>
  readonly toHaveClass: (className: string) => Promise<void>
  readonly toBeFocused: () => Promise<void>
  readonly toHaveCSS: (key: string, value: string) => Promise<void>
  readonly toBeHidden: () => Promise<void>
}

declare const Locator: (selector: string) => any

declare const test: {
  (name: string, fn: () => Promise<void>): void
  readonly skip: (name: string, fn: () => Promise<void>) => {}
}
