import * as LayoutKeys from '../LayoutKeys/LayoutKeys.js'
import * as LayoutModules from '../LayoutModules/LayoutModules.js'
import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'

export const create = (id) => {
  return {
    uid: id,
    sideBarLocation: SideBarLocationType.Right,
    // Flexbox layout state
    titleBarVisible: true,
    sideBarVisible: true,
    activityBarVisible: true,
    previewVisible: true,
    panelVisible: false,
    statusBarVisible: true,
    // Dimensions
    sideBarWidth: 240,
    panelHeight: 160,
    titleBarHeight: 30,
    statusBarHeight: 20,
  }
}

export const loadContent = (state, savedState) => {
  const { Layout } = savedState
  const { bounds } = Layout
  const { windowWidth, windowHeight } = bounds
  const sideBarLocation = getSideBarLocationType()
  
  return {
    ...state,
    sideBarLocation,
    windowWidth,
    windowHeight,
    titleBarVisible: !isNativeTitleBarStyle(),
    sideBarVisible: true,
    activityBarVisible: true,
    previewVisible: true,
    panelVisible: false,
    statusBarVisible: true,
    sideBarWidth: 240,
    panelHeight: 160,
    titleBarHeight: isNativeTitleBarStyle() ? 0 : 30,
    statusBarHeight: 20,
  }
}

const isNativeTitleBarStyle = () => {
  // This would check preferences in a real implementation
  return false
}

const getSideBarLocationType = () => {
  // This would check preferences in a real implementation
  return SideBarLocationType.Right
}

export const getFlexboxLayout = (state) => {
  const {
    titleBarVisible,
    sideBarVisible,
    activityBarVisible,
    previewVisible,
    panelVisible,
    statusBarVisible,
    sideBarLocation,
    sideBarWidth,
    panelHeight,
    titleBarHeight,
    statusBarHeight,
  } = state

  return {
    // Main container classes
    workbenchClass: 'Workbench',
    layoutContainerClass: 'LayoutContainer',
    contentAreaClass: 'ContentArea',
    contentRowClass: 'ContentRow',
    
    // Component classes and visibility
    titleBar: {
      class: `TitleBar ${titleBarVisible ? '' : 'hidden'}`,
      visible: titleBarVisible,
    },
    main: {
      class: `Main`,
      visible: true,
    },
    sideBar: {
      class: `SideBar ${sideBarVisible ? '' : 'hidden'}`,
      visible: sideBarVisible,
      order: sideBarLocation === SideBarLocationType.Left ? 1 : 3,
    },
    activityBar: {
      class: `ActivityBar ${activityBarVisible ? '' : 'hidden'}`,
      visible: activityBarVisible,
      order: sideBarLocation === SideBarLocationType.Left ? 0 : 4,
    },
    preview: {
      class: `Preview ${previewVisible ? '' : 'hidden'}`,
      visible: previewVisible,
      order: sideBarLocation === SideBarLocationType.Left ? 4 : 5,
    },
    panel: {
      class: `Panel ${panelVisible ? '' : 'hidden'}`,
      visible: panelVisible,
    },
    statusBar: {
      class: `StatusBar ${statusBarVisible ? '' : 'hidden'}`,
      visible: statusBarVisible,
    },
  }
}

export const toggleSideBar = (state) => {
  return {
    ...state,
    sideBarVisible: !state.sideBarVisible,
  }
}

export const toggleActivityBar = (state) => {
  return {
    ...state,
    activityBarVisible: !state.activityBarVisible,
  }
}

export const togglePreview = (state) => {
  return {
    ...state,
    previewVisible: !state.previewVisible,
  }
}

export const togglePanel = (state) => {
  return {
    ...state,
    panelVisible: !state.panelVisible,
  }
}

export const toggleStatusBar = (state) => {
  return {
    ...state,
    statusBarVisible: !state.statusBarVisible,
  }
}

export const setSideBarWidth = (state, width) => {
  return {
    ...state,
    sideBarWidth: Math.max(170, Math.min(800, width)),
  }
}

export const setPanelHeight = (state, height) => {
  return {
    ...state,
    panelHeight: Math.max(150, Math.min(600, height)),
  }
}
