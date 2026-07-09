export interface ViewletExtensionViewState {
  readonly commands: readonly (readonly unknown[])[]
  readonly actionsDom: readonly unknown[]
  readonly css: string
  readonly cssId: string
  readonly csp: string
  readonly credentialless: boolean
  readonly dom: readonly unknown[]
  readonly error?: unknown
  readonly eventListeners: readonly unknown[]
  readonly focusSelector: string
  readonly height: number
  readonly iframeSandbox: readonly string[]
  readonly iframeSrc: string
  readonly kind: string
  readonly patches: readonly unknown[]
  readonly title: string
  readonly uid: number
  readonly uri: string
  readonly width: number
  readonly x: number
  readonly y: number
}
