export interface TextEdit {
  readonly text: string
  readonly startRowIndex: number
  readonly startColumnIndex: number
  readonly endColumnIndex: number
  readonly endRowIndex: number
}
