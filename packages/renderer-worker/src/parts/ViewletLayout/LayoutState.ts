export interface SideBarFocusModeLayoutStateSnapshot {
  readonly activityBarSashVisible: boolean
  readonly activityBarVisible: boolean
  readonly mainVisible: boolean
  readonly panelSashVisible: boolean
  readonly panelVisible: boolean
  readonly previewSashVisible: boolean
  readonly previewVisible: boolean
  readonly secondaryPreviewSashVisible: boolean
  readonly secondaryPreviewVisible: boolean
  readonly secondarySideBarVisible: boolean
  readonly secondarySideBarWidth: number
  readonly sideBarSashVisible: boolean
  readonly sideBarVisible: boolean
  readonly sideBarWidth: number
}

export interface WidgetReference {
  readonly parentUid: number
  readonly uid: number
}

export interface LayoutState {
  readonly activityBarHeight: number
  readonly activityBarId: number
  readonly activityBarLeft: number
  readonly activityBarSashId: number
  readonly activityBarSashVisible: boolean
  readonly activityBarTop: number
  readonly activityBarVisible: boolean
  readonly activityBarWidth: number
  readonly authAccessToken: string
  readonly authErrorMessage: string
  readonly assetDir: string
  readonly backendUrl: string
  readonly badgeCounts: Record<string, number>
  readonly commands: readonly any[]
  readonly commit: string
  readonly contentAreaId: number
  readonly contentAreaVisible: boolean
  readonly explicitBounds: boolean
  readonly fullScreen: boolean
  readonly initial: boolean
  readonly mainHeight: number
  readonly mainId: number
  readonly mainLeft: number
  readonly mainTop: number
  readonly mainVisible: boolean
  readonly mainWidth: number
  readonly mountedViewletsBySource: Readonly<Record<number, readonly number[]>>
  readonly panelHeight: number
  readonly panelId: number
  readonly panelLeft: number
  readonly panelMaxHeight: number
  readonly panelMaximized: boolean
  readonly panelHeightBeforeMaximize: number
  readonly panelMinHeight: number
  readonly panelSashId: number
  readonly panelSashVisible: boolean
  readonly panelTop: number
  readonly panelView: string
  readonly panelVisible: boolean
  readonly panelWidth: number
  readonly platform: number
  readonly previewActionsEventListeners: readonly unknown[]
  readonly previewActionsUid: number
  readonly previewHeight: number
  readonly previewId: number
  readonly previewLeft: number
  readonly previewMaxHeight: number
  readonly previewMaxWidth: number
  readonly previewMinHeight: number
  readonly previewMinWidth: number
  readonly previewOrientation: 'horizontal' | 'vertical'
  readonly previewSashId: number
  readonly previewSashVisible: boolean
  readonly previewTop: number
  readonly previewUri: string
  readonly previewViewletId: string
  readonly previewVisible: boolean
  readonly previewWidth: number
  readonly previewWidthBeforeClose: number
  readonly restore: boolean
  readonly sashId: any
  readonly sideBarHeight: number
  readonly sideBarId: number
  readonly sideBarLeft: number
  readonly sideBarLocation: number
  readonly sideBarMaxWidth: number
  readonly sideBarMinWidth: number
  readonly sideBarSashId: number
  readonly sideBarSashVisible: boolean
  readonly sideBarTop: number
  readonly sideBarView: string
  readonly sideBarFocusMode: boolean
  readonly sideBarFocusModeLayout: SideBarFocusModeLayoutStateSnapshot | undefined
  readonly sideBarFocusModeTarget: 'primary' | 'secondary'
  readonly sideBarVisible: boolean
  readonly sideBarWidth: number
  readonly secondarySideBarHeight: number
  readonly secondarySideBarId: number
  readonly secondarySideBarLeft: number
  readonly secondarySideBarMaxWidth: number
  readonly secondarySideBarMinWidth: number
  readonly secondarySideBarTop: number
  readonly secondarySideBarView: string
  readonly secondarySideBarVisible: boolean
  readonly secondarySideBarWidth: number
  readonly secondaryPreviewActionsEventListeners: readonly unknown[]
  readonly secondaryPreviewActionsUid: number
  readonly secondaryPreviewHeight: number
  readonly secondaryPreviewId: number
  readonly secondaryPreviewLeft: number
  readonly secondaryPreviewMaxHeight: number
  readonly secondaryPreviewMaxWidth: number
  readonly secondaryPreviewMinHeight: number
  readonly secondaryPreviewMinWidth: number
  readonly secondaryPreviewSashId: number
  readonly secondaryPreviewSashVisible: boolean
  readonly secondaryPreviewTop: number
  readonly secondaryPreviewUri: string
  readonly secondaryPreviewViewletId: string
  readonly secondaryPreviewVisible: boolean
  readonly secondaryPreviewWidth: number
  readonly statusBarHeight: number
  readonly statusBarId: number
  readonly statusBarLeft: number
  readonly statusBarTop: number
  readonly statusBarVisible: boolean
  readonly statusBarWidth: number
  readonly titleBarHeight: number
  readonly titleBarId: number
  readonly titleBarLeft: number
  readonly titleBarNative: boolean
  readonly titleBarTop: number
  readonly titleBarVisibleBeforeFullScreen: boolean
  readonly titleBarVisible: boolean
  readonly titleBarWidth: number
  readonly uid: number
  readonly updateProgress: number
  readonly updateState: string
  readonly userName: string
  readonly userState: string
  readonly userSubscriptionPlan: string
  readonly userUsedTokens: number
  readonly windowHeight: number
  readonly windowWidth: number
  readonly workbenchId: number
  readonly workbenchVisible: boolean
  readonly widgetReferences: readonly WidgetReference[]
  readonly widgetRevisions: Readonly<Record<number, number>>
}

export interface LayoutStateResult {
  readonly newState: LayoutState
  readonly commands: readonly any[]
}
