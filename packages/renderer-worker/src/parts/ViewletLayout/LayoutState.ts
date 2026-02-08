export interface LayoutState {
  readonly activityBarId: number
  readonly activityBarTop: number
  readonly activityBarLeft: number
  readonly activityBarWidth: number
  readonly activityBarHeight: number
  readonly activityBarSashId: number
  readonly activityBarSashVisible: boolean
  readonly activityBarVisible: boolean
  readonly assetDir: string
  readonly commands: readonly any[]
  readonly commit: string
  readonly contentAreaId: number
  readonly contentAreaVisible: boolean
  // readonly mainContentsId: number
  // readonly mainContentsVisible: boolean
  readonly mainId: number
  readonly mainVisible: boolean
  readonly panelId: number
  readonly panelTop: number
  readonly panelLeft: number
  readonly panelWidth: number
  readonly panelHeight: number
  readonly panelSashId: number
  readonly panelSashVisible: boolean
  readonly panelView: string
  readonly panelVisible: boolean
  readonly platform: number
  readonly points: Uint16Array
  readonly previewId: number
  readonly previewTop: number
  readonly previewLeft: number
  readonly previewWidth: number
  readonly previewHeight: number
  readonly previewSashId: number
  readonly previewSashVisible: boolean
  readonly previewUri: string
  readonly previewVisible: boolean
  readonly sashId: any
  readonly sideBarId: number
  readonly sideBarLocation: number
  readonly sideBarSashId: number
  readonly sideBarSashVisible: boolean
  readonly sideBarTop: boolean
  readonly sideBarLeft: boolean
  readonly sideBarWidth: boolean
  readonly sideBarHeight: boolean
  readonly sideBarView: string
  readonly sideBarVisible: boolean
  readonly statusBarId: number
  readonly statusBarVisible: boolean
  readonly titleBarId: number
  readonly titleBarTop: number
  readonly titleBarLeft: number
  readonly titleBarWidth: number
  readonly titleBarHeight: number
  readonly titleBarVisible: boolean
  readonly uid: number
  readonly updateProgress: number
  readonly updateState: string
  readonly workbenchId: number
  readonly workbenchVisible: boolean
}

export interface LayoutStateResult {
  readonly newState: LayoutState
  readonly commands: readonly any[]
}
