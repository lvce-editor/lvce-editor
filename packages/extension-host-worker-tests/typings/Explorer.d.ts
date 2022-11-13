declare const Explorer: {
  readonly acceptEdit: () => Promise<void>
  readonly cancelEdit: () => Promise<void>
  readonly clickCurrent: () => Promise<void>
  readonly expandRecursively: () => Promise<void>
  readonly focusFirst: () => Promise<void>
  readonly focusIndex: (index: number) => Promise<void>
  readonly focusLast: () => Promise<void>
  readonly focusNext: () => Promise<void>
  // TODO maybe rename this to collapse
  readonly handleArrowLeft: () => Promise<void>
  readonly handleClick: (index: number) => Promise<void>
  readonly newFile: () => Promise<void>
  readonly openContextMenu: () => Promise<void>
  readonly removeDirent: () => Promise<void>
  readonly rename: () => Promise<void>
  readonly updateEditingValue: (value: string) => Promise<void>
}
