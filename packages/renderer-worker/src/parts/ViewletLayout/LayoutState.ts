export interface LayoutState {
  readonly sideBarView: string
  readonly commands: readonly any[]
  readonly assetDir: string
  readonly commit: string
  readonly platform: number
  readonly sashId: any
  readonly sideBarLocation: number
  readonly uid: number
  readonly points: Uint16Array
  readonly activityBarId: number
  readonly activityBarSashId: number
  readonly sideBarSashId: number
  readonly sideBarId: number
  readonly panelSashId: number
  readonly panelId: number
  readonly mainId: number
  readonly contentAreaId: number
  readonly mainContentsId: number
  readonly statusBarId: number
  readonly titleBarId: number
  readonly workbenchId: number
  readonly previewId: number
  readonly activityBarVisible: boolean
  readonly activityBarSashVisible: boolean
  readonly contentAreaVisible: boolean
  readonly mainContentsVisible: boolean
  readonly mainVisible: boolean
  readonly panelSashVisible: boolean
  readonly panelVisible: boolean
  readonly sideBarSashVisible: boolean
  readonly sideBarVisible: boolean
  readonly statusBarVisible: boolean
  readonly titleBarVisible: boolean
  readonly workbenchVisible: boolean
  readonly updateState: string
  readonly updateProgress: number
}

export interface LayoutStateResult {
  readonly newState: LayoutState
  readonly commands: readonly any[]
}
