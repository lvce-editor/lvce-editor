export interface LayoutState {
  readonly activityBarId: number
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
  readonly panelSashId: number
  readonly panelSashVisible: boolean
  readonly panelView: string
  readonly panelVisible: boolean
  readonly platform: number
  readonly points: Uint16Array
  readonly previewId: number
  readonly previewSashId: number
  readonly previewSashVisible: boolean
  readonly previewUri: string
  readonly previewVisible: boolean
  readonly sashId: any
  readonly sideBarId: number
  readonly sideBarLocation: number
  readonly sideBarSashId: number
  readonly sideBarSashVisible: boolean
  readonly sideBarView: string
  readonly sideBarVisible: boolean
  readonly statusBarId: number
  readonly statusBarVisible: boolean
  readonly titleBarId: number
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
