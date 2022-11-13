declare const TitleBarMenuBar: {
  readonly closeMenu: () => Promise<void>
  readonly focus: () => Promise<void>
  readonly focusFirst: () => Promise<void>
  readonly focusIndex: (index: number) => Promise<void>
  readonly focusLast: () => Promise<void>
  readonly focusNext: () => Promise<void>
  readonly focusPrevious: () => Promise<void>
  readonly handleKeyArrowDown: () => Promise<void>
  readonly handleKeyArrowLeft: () => Promise<void>
  readonly handleKeyArrowRight: () => Promise<void>
  readonly handleKeyArrowUp: () => Promise<void>
  readonly handleKeyEnd: () => Promise<void>
  readonly handleKeyEscape: () => Promise<void>
  readonly handleKeyHome: () => Promise<void>
  readonly handleKeySpace: () => Promise<void>
  readonly toggleIndex: (index: number) => Promise<void>
  readonly toggleMenu: () => Promise<void>
}
