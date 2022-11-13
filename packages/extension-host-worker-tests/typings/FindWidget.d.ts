declare const FindWidget: {
  readonly focusNext: () => Promise<void>
  readonly setValue: (value: string) => Promise<void>
}