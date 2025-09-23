export interface LayoutState {
  readonly activeSashId: string
  readonly activityBarVisible: boolean
  readonly activityBarWidth: number
  readonly mainVisible: boolean
  readonly panelHeight: number
  readonly panelMaxHeight: number
  readonly panelMinHeight: number
  readonly panelVisible: boolean
  readonly sideBarLocation: number
  readonly sideBarMaxWidth: number
  readonly sideBarMinWidth: number
  readonly sideBarViewletId: string
  readonly sideBarVisible: boolean
  readonly sideBarWidth: number
  readonly statusBarVisible: boolean
  readonly titleBarHeight: number
  readonly titleBarVisible: boolean
  readonly uid: number
  readonly windowHeight: number
  readonly windowWidth: number
  readonly maxPanelHeight: number
  readonly minPanelHeight: number
  readonly statusBarHeight: number
  readonly points: Uint32Array
}
