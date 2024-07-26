export interface FindState {
  readonly value: string
  readonly ariaAnnouncement: string
  readonly matches: Uint32Array
  readonly matchIndex: number
  readonly matchCount: number
  readonly uid: number
  readonly replaceExpanded: boolean
  readonly useRegularExpression: boolean
  readonly matchCase: boolean
  readonly matchWholeWord: boolean
  readonly replacement: string
  readonly disposed?: boolean
}
