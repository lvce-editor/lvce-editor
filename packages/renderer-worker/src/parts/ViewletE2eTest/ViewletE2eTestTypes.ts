export interface E2eState {
  readonly tests: readonly string[]
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly index: number
  readonly iframeSrc: string
  readonly iframeOrigin: string
  readonly sandbox: readonly string[]
  readonly portId: number
}
