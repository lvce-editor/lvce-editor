export interface DebugRow {
  readonly type: number
  readonly text: string
  readonly expanded: boolean
  readonly key: string
  readonly value: string
  readonly indent: number
  readonly valueType: string | number // TODO convert to number
  readonly name: string
}
