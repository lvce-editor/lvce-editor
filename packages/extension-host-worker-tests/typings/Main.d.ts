declare const Main: {
  readonly openUri: (uri: string) => Promise<void>
  readonly shouldHaveLayout: (expectedLayout: {
    readonly activeGroupIndex?: number
    readonly direction?: 'horizontal' | 'vertical' | number
    readonly groups?: readonly { readonly size?: number }[]
  }) => Promise<void>
}
