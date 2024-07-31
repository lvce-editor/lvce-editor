export interface ColorPickerState {
  readonly color: string
  readonly offsetX: number
  readonly min: number
  readonly max: number
  commands: any[]
  readonly uid: number
}
