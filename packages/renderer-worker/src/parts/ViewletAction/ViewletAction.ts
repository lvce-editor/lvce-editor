export interface ViewletAction {
  readonly type: number
  readonly id: string
  readonly icon?: string
  readonly command: string
  readonly badgeText?: string
  readonly placeholder?: string
  readonly value?: string
}
