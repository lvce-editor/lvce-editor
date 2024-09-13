export interface ViewletWebViewState {
  readonly id: number
  readonly uri: string
  readonly iframeSrc: string
  readonly sandbox: readonly string[]
  readonly portId: number
  readonly origin: string
  readonly previewServerId: number
  readonly csp: string
}
