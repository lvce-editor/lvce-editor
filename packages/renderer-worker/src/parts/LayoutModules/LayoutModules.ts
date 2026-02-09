import * as LayoutKeys from '../LayoutKeys/LayoutKeys.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export interface LayoutModule {
  readonly moduleId: string
  readonly kVisible: string
  readonly kTop: string
  readonly kLeft: string
  readonly kWidth: string
  readonly kHeight: string
  readonly kId: string
  readonly kReady: string
}

export const Main: LayoutModule = {
  moduleId: ViewletModuleId.Main,
  kVisible: LayoutKeys.MainVisible,
  kTop: LayoutKeys.MainTop,
  kLeft: LayoutKeys.MainLeft,
  kWidth: LayoutKeys.MainWidth,
  kHeight: LayoutKeys.MainHeight,
  kId: 'mainId',
  kReady: 'mainVisible',
}

export const ActivityBar: LayoutModule = {
  moduleId: ViewletModuleId.ActivityBar,
  kVisible: LayoutKeys.ActivityBarVisible,
  kTop: LayoutKeys.ActivityBarTop,
  kLeft: LayoutKeys.ActivityBarLeft,
  kWidth: LayoutKeys.ActivityBarWidth,
  kHeight: LayoutKeys.ActivityBarHeight,
  kId: 'activityBarId',
  kReady: 'activityBarVisible',
}

export const SideBar: LayoutModule = {
  moduleId: ViewletModuleId.SideBar,
  kVisible: LayoutKeys.SideBarVisible,
  kTop: LayoutKeys.SideBarTop,
  kLeft: LayoutKeys.SideBarLeft,
  kWidth: LayoutKeys.SideBarWidth,
  kHeight: LayoutKeys.SideBarHeight,
  kId: 'sideBarId',
  kReady: 'sideBarVisible',
}

export const TitleBar: LayoutModule = {
  moduleId: ViewletModuleId.TitleBar,
  kVisible: LayoutKeys.TitleBarVisible,
  kTop: LayoutKeys.TitleBarTop,
  kLeft: LayoutKeys.TitleBarTop,
  kWidth: LayoutKeys.TitleBarWidth,
  kHeight: LayoutKeys.TitleBarHeight,
  kId: 'titleBarId',
  kReady: 'titleBarVisible',
}

export const StatusBar: LayoutModule = {
  moduleId: ViewletModuleId.StatusBar,
  kVisible: LayoutKeys.StatusBarVisible,
  kTop: LayoutKeys.StatusBarTop,
  kLeft: LayoutKeys.StatusBarLeft,
  kWidth: LayoutKeys.StatusBarWidth,
  kHeight: LayoutKeys.StatusBarHeight,
  kId: 'statusBarId',
  kReady: 'statusbarVisible',
}

export const Panel: LayoutModule = {
  moduleId: ViewletModuleId.Panel,
  kVisible: LayoutKeys.PanelVisible,
  kTop: LayoutKeys.panelTop,
  kLeft: LayoutKeys.PanelLeft,
  kWidth: LayoutKeys.PanelWidth,
  kHeight: LayoutKeys.PanelHeight,
  kId: 'panelId',
  kReady: 'panelVisible',
}

export const Preview: LayoutModule = {
  moduleId: ViewletModuleId.Preview,
  kVisible: LayoutKeys.PreviewVisible,
  kTop: LayoutKeys.PreviewTop,
  kLeft: LayoutKeys.PreviewLeft,
  kWidth: LayoutKeys.PreviewWidth,
  kHeight: LayoutKeys.PreviewHeight,
  kId: 'previewId',
  kReady: 'previewVisible',
}
