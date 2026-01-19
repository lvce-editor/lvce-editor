export interface SearchState {
  readonly uid: number
  readonly commands: readonly any[]
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly actionsDom: readonly any[]
  readonly assetDir: string
  readonly platform: number
}
