export interface DebugRow {
  readonly type: string
  readonly text: string
  readonly expanded: boolean
  readonly key: string
  readonly value: string
  readonly indent: number
  readonly valueType: string // TODO convert to number
}
