export const hasFunctionalRender = true

const renderFlexboxLayout = {
  isEqual(oldState, newState) {
    // Check if layout properties have changed
    return (
      oldState.titleBarVisible === newState.titleBarVisible &&
      oldState.sideBarVisible === newState.sideBarVisible &&
      oldState.activityBarVisible === newState.activityBarVisible &&
      oldState.previewVisible === newState.previewVisible &&
      oldState.panelVisible === newState.panelVisible &&
      oldState.statusBarVisible === newState.statusBarVisible &&
      oldState.sideBarWidth === newState.sideBarWidth &&
      oldState.panelHeight === newState.panelHeight &&
      oldState.sideBarLocation === newState.sideBarLocation
    )
  },
  
  apply(oldState, newState) {
    const layout = getFlexboxLayout(newState)
    
    // Generate HTML structure for flexbox layout
    const html = generateFlexboxHTML(layout)
    
    return [
      'setHTML',
      html
    ]
  }
}

const generateFlexboxHTML = (layout) => {
  const { components } = layout
  
  return `
    <div class="${layout.workbenchClass}">
      <div class="${layout.layoutContainerClass}">
        ${components.titleBar.visible ? `<div class="${components.titleBar.class}"></div>` : ''}
        <div class="${layout.contentAreaClass}">
          <div class="${layout.contentRowClass}">
            ${components.activityBar.visible ? `<div class="${components.activityBar.class}" style="order: ${components.activityBar.order}"></div>` : ''}
            ${components.sideBar.visible ? `<div class="${components.sideBar.class}" style="order: ${components.sideBar.order}"></div>` : ''}
            <div class="${components.main.class}" style="order: 2"></div>
            ${components.preview.visible ? `<div class="${components.preview.class}" style="order: ${components.preview.order}"></div>` : ''}
          </div>
          ${components.panel.visible ? `<div class="${components.panel.class}"></div>` : ''}
        </div>
        ${components.statusBar.visible ? `<div class="${components.statusBar.class}"></div>` : ''}
      </div>
    </div>
  `
}

// Helper function to get flexbox layout (imported from main module)
const getFlexboxLayout = (state) => {
  const {
    titleBarVisible,
    sideBarVisible,
    activityBarVisible,
    previewVisible,
    panelVisible,
    statusBarVisible,
    sideBarLocation,
  } = state

  return {
    workbenchClass: 'Workbench',
    layoutContainerClass: 'LayoutContainer',
    contentAreaClass: 'ContentArea',
    contentRowClass: 'ContentRow',
    
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
      order: sideBarLocation === 1 ? 1 : 3,
    },
    activityBar: {
      class: `ActivityBar ${activityBarVisible ? '' : 'hidden'}`,
      visible: activityBarVisible,
      order: sideBarLocation === 1 ? 0 : 4,
    },
    preview: {
      class: `Preview ${previewVisible ? '' : 'hidden'}`,
      visible: previewVisible,
      order: sideBarLocation === 1 ? 4 : 5,
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

export const render = [renderFlexboxLayout]
