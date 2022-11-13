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
