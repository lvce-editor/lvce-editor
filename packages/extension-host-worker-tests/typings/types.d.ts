declare const ContextMenu: {
  readonly selectItem: (name: string) => Promise<void>
}

declare const Editor: {
  readonly setCursor: (rowIndex: number, columnIndex: number) => Promise<void>
  readonly openCompletion: () => Promise<void>
  readonly executeTabCompletion: () => Promise<void>
  readonly openEditorContextMenu: () => Promise<void>
  readonly executeBraceCompletion: () => Promise<void>
}

declare const Extension: {
  readonly addWebExtension: (uri: string) => Promise<void>
}

declare const FileSystem: {
  readonly getTmpDir: () => Promise<string>
  readonly writeFile: (uri: string, content: string) => Promise<void>
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
  readonly toHaveAttribute: (key: string, value: string) => Promise<void>
  readonly toHaveClass: (className: string) => Promise<void>
  readonly toBeFocused: () => Promise<void>
}

declare const Locator: (selector: string) => any

declare const test: {
   (name: string, fn: () => Promise<void>) => void
  readonly skip: (name: string, fn: () => Promise<void>) => {}
}
