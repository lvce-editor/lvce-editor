export interface EditorDescriptor {
  readonly uri: string
  readonly uid: number
  readonly label: string
  readonly tabTitle: string
  readonly icon: string
  readonly tabWidth: number
  readonly flags: number
}
