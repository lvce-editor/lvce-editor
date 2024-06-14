export interface ActivityBarItem {
  readonly id: string // TODO should be number
  readonly title: string
  readonly icon: string
  readonly flags: number
  readonly keyShortcuts: string
}
