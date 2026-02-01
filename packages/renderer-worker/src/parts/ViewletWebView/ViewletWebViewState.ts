export interface ViewletWebViewState {
  readonly id: number
  readonly uri: string
  readonly iframeSrc: string
  readonly sandbox: readonly string[]
  readonly portId: number
  readonly origin: string
  readonly previewServerId: number
  readonly csp: string
  readonly srcDoc: string // TODO remove
  readonly credentialless: boolean
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly commands: readonly any[]
  readonly assetDir: string
  readonly platform: number
}
