declare const Command: {
  readonly execute: (id: string, ...args: any[]) => Promise<void>
}

declare const ContextMenu: {
  readonly selectItem: (name: string) => Promise<void>
}

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
}

declare const Explorer: {
  readonly openContextMenu: () => Promise<void>
  readonly removeDirent: () => Promise<void>
  readonly focusFirst: () => Promise<void>
  readonly focusLast: () => Promise<void>
  readonly focusNext: () => Promise<void>
  readonly focusIndex: (index: number) => Promise<void>
  readonly clickCurrent: () => Promise<void>
  readonly expandRecursively: () => Promise<void>
  // TODO maybe rename this to collapse
  readonly handleArrowLeft: () => Promise<void>
  readonly newFile: () => Promise<void>
}

declare const Extension: {
  readonly addWebExtension: (uri: string) => Promise<void>
}

declare const EditorFindWidget: {
  readonly focusNext: () => Promise<void>
}

declare const FileSystem: {
  readonly getTmpDir: (options?: {
    scheme?: 'memfs' | 'file'
  }) => Promise<string>
  readonly writeFile: (uri: string, content: string) => Promise<void>
  readonly mkdir: (uri: string) => Promise<void>
  readonly chmod: (uri: string, permissions: string) => Promise<void>
  /**
   * @deprecated use createExecutableFrom instead
   */
  readonly createExecutable: (content: string) => Promise<void>
  readonly createExecutableFrom: (path: string) => Promise<void>
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
  readonly focusPrevious: () => Promise<void>
  readonly focusNext: () => Promise<void>
  readonly focusIndex: (index: number) => Promise<void>
  readonly open: () => Promise<void>
  readonly setValue: (value: string) => Promise<void>
  readonly selectItem: (value: string) => Promise<void>
}

declare const Platform: {
  readonly getNodePath: () => Promise<string>
}

declare const SideBar: {
  readonly open: (id: string) => Promise<void>
}

declare const Search: {
  readonly setValue: (value: string) => Promise<void>
}

declare const Settings: {
  readonly update: (newSettings: any) => Promise<void>
}

declare const TitleBarMenuBar: {
  readonly closeMenu: () => Promise<void>
  readonly focus: () => Promise<void>
  readonly focusFirst: () => Promise<void>
  readonly focusIndex: (index: number) => Promise<void>
  readonly focusLast: () => Promise<void>
  readonly focusNext: () => Promise<void>
  readonly focusPrevious: () => Promise<void>
  readonly handleKeyArrowDown: () => Promise<void>
  readonly handleKeyArrowLeft: () => Promise<void>
  readonly handleKeyArrowRight: () => Promise<void>
  readonly handleKeyArrowUp: () => Promise<void>
  readonly handleKeyEnd: () => Promise<void>
  readonly handleKeyEscape: () => Promise<void>
  readonly handleKeyHome: () => Promise<void>
  readonly handleKeySpace: () => Promise<void>
  readonly toggleIndex: (index: number) => Promise<void>
  readonly toggleMenu: () => Promise<void>
}

declare const Workspace: {
  readonly setPath: (uri: string) => Promise<void>
}

declare const Main: {
  readonly openUri: (uri: string) => Promise<void>
}

declare const Eval: {
  readonly evalInRendererProcess: (code: string) => Promise<void>
}

declare const expect: (locator: any) => {
  readonly toBeFocused: () => Promise<void>
  readonly toBeHidden: () => Promise<void>
  readonly toBeVisible: () => Promise<void>
  readonly toHaveAttribute: (key: string, value: string | null) => Promise<void>
  readonly toHaveClass: (className: string) => Promise<void>
  readonly toHaveCount: (count: number) => Promise<void>
  readonly toHaveCSS: (key: string, value: string) => Promise<void>
  readonly toHaveId: (id: string) => Promise<void>
  readonly toHaveText: (text: string) => Promise<void>
  readonly toHaveValue: (value: string) => Promise<void>
}

declare const Locator: (selector: string, options?: any) => any

declare const test: {
  (name: string, fn: () => Promise<void>): void
  readonly skip: (name: string, fn: () => Promise<void>) => {}
}
