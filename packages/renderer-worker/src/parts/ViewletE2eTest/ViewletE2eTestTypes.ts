export interface E2eTestState {
  readonly name: string
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly index: number
  readonly iframeSrc: string
  readonly iframeOrigin: string
  readonly iframeSandbox: readonly string[]
  readonly portId: number
  readonly uri: string
  readonly content: string
}
