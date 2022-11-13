declare const QuickPick: {
  readonly focusPrevious: () => Promise<void>
  readonly focusNext: () => Promise<void>
  readonly focusIndex: (index: number) => Promise<void>
  readonly open: () => Promise<void>
  readonly setValue: (value: string) => Promise<void>
  readonly selectItem: (value: string) => Promise<void>
}
