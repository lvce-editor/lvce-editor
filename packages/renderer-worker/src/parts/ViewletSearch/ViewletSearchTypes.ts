export interface SearchState {
  readonly uid: number
  readonly searchResults: readonly any[]
  readonly items: readonly any[]
  readonly stats: any
  readonly searchId: number
  readonly value: string
  readonly disposed: boolean
  readonly fileCount: number
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly threads: number
  readonly replaceExpanded: boolean
  readonly useRegularExpression: boolean
  readonly matchCase: boolean
  readonly matchWholeWord: boolean
  readonly replacement: string
  readonly matchCount: number
  readonly listFocused: boolean
  readonly listFocusedIndex: number
  readonly inputSource: number
  readonly workspacePath: string
  readonly includeValue: string
  readonly excludeValue: string
  readonly detailsExpanded: boolean
  readonly focus: any
  readonly loaded: boolean
  readonly message: string
  readonly collapsedPaths: readonly string[]
  readonly minLineY: number
  readonly maxLineY: number
  readonly itemHeight: number
  readonly focusedIndex: number
}
