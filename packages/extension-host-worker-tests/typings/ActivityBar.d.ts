declare const ActivityBar: {
  readonly focus: () => Promise<void>
  readonly focusFirst: () => Promise<void>
  readonly focusLast: () => Promise<void>
  readonly focusNext: () => Promise<void>
  readonly focusPrevious: () => Promise<void>
  readonly handleClick: (index: number) => Promise<void>
  readonly handleContextMenu: () => Promise<void>
  readonly selectCurrent: () => Promise<void>
}
