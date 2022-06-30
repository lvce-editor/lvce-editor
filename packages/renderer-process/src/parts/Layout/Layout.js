import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const state = {
  $ActivityBar: undefined,
  $StatusBar: undefined,
  $TitleBar: undefined,
  $Main: undefined,
  $SideBar: undefined,
  $Panel: undefined,
  $Workbench: undefined,
  $SashSideBar: undefined,
  $SashPanel: undefined,
}

// TODO when nodes are not visible, they are still kept in memory as detached dom nodes
// maybe it doesn't matter but maybe they should be garbage collected

export const update = (points) => {
  const $ActivityBar = state.$ActivityBar
  const $Main = state.$Main
  const $TitleBar = state.$TitleBar
  const $SideBar = state.$SideBar
  const $StatusBar = state.$StatusBar
  const $Panel = state.$Panel
  const $SashSideBar = state.$SashSideBar
  const $SashPanel = state.$SashPanel

  if (points.activityBarVisible) {
    $ActivityBar.style.top = `${points.activityBarTop}px`
    $ActivityBar.style.left = `${points.activityBarLeft}px`
    $ActivityBar.style.width = `${points.activityBarWidth}px`
    $ActivityBar.style.height = `${points.activityBarHeight}px`
    $ActivityBar.style.display = ''
  } else {
    $ActivityBar.style.display = 'none'
  }
  if (points.mainVisible) {
    $Main.style.top = `${points.mainTop}px`
    $Main.style.left = `${points.mainLeft}px`
    $Main.style.width = `${points.mainWidth}px`
    $Main.style.height = `${points.mainHeight}px`
    $Main.style.display = ''
  } else {
    $Main.style.display = 'none'
  }
  if (points.panelVisible) {
    $Panel.style.top = `${points.panelTop}px`
    $Panel.style.left = `${points.panelLeft}px`
    $Panel.style.width = `${points.panelWidth}px`
    $Panel.style.height = `${points.panelHeight}px`
    $Panel.style.display = ''

    $SashPanel.style.top = `${points.panelTop}px`
    $SashPanel.style.left = `${points.panelLeft}px`
    $SashPanel.style.width = `${points.panelWidth}px`
  } else {
    $Panel.style.display = 'none'
  }
  if (points.sideBarVisible) {
    $SideBar.style.top = `${points.sideBarTop}px`
    $SideBar.style.left = `${points.sideBarLeft}px`
    $SideBar.style.width = `${points.sideBarWidth}px`
    $SideBar.style.height = `${points.sideBarHeight}px`
    $SideBar.style.display = ''

    $SashSideBar.style.left = `${points.sideBarLeft}px`
    $SashSideBar.style.top = `${points.sideBarTop}px`
    $SashSideBar.style.height = `${points.sideBarHeight}px`
  } else {
    $SideBar.style.display = 'none'
  }
  if (points.statusBarVisible) {
    $StatusBar.style.top = `${points.statusBarTop}px`
    $StatusBar.style.left = `${points.statusBarLeft}px`
    $StatusBar.style.width = `${points.statusBarWidth}px`
    $StatusBar.style.height = `${points.statusBarHeight}px`
    $StatusBar.style.display = ''
  } else {
    $StatusBar.style.display = 'none'
  }
  if (points.titleBarVisible) {
    $TitleBar.style.top = `${points.titleBarTop}px`
    $TitleBar.style.left = `${points.titleBarLeft}px`
    $TitleBar.style.width = `${points.titleBarWidth}px`
    $TitleBar.style.height = `${points.titleBarHeight}px`
    $TitleBar.style.display = ''
  } else {
    // TODO remove elements from dom instead of hiding them
    $TitleBar.style.display = 'none'
  }
}

// export const get$ActivityBar = () => {
//   return state.$ActivityBar
// }

// export const get$SideBar = () => {
//   return state.$SideBar
// }

// export const get$Panel = () => {
//   return state.$Panel
// }

// export const get$TitleBar = () => {
//   return state.$TitleBar
// }

// export const get$Main = () => {
//   return state.$Main
// }

const getTitleBarHeight = () => {
  if (
    // @ts-ignore
    navigator.windowControlsOverlay &&
    // @ts-ignore
    navigator.windowControlsOverlay.getTitlebarAreaRect
  ) {
    // @ts-ignore
    const titleBarRect = navigator.windowControlsOverlay.getTitlebarAreaRect()
    return titleBarRect.height
  }
  return 0
}

export const getBounds = () => {
  return {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    titleBarHeight: getTitleBarHeight(),
  }
}

const handleResize = (event) => {
  RendererWorker.send([
    /* Layout.handleResize */ 'Layout.handleResize',
    /* bounds */ getBounds(),
  ])
}

const getSashId = ($Target) => {
  console.log({ $Target })
  if ($Target.id === 'SashPanel') {
    return 'Panel'
  }
  if ($Target.id === 'SashSideBar') {
    return 'SideBar'
  }
  return ''
}

const handleSashPointerMove = (event) => {
  const x = event.clientX
  const y = event.clientY
  RendererWorker.send([
    /* Layout.handleSashPointerMove */ 'Layout.handleSashPointerMove',
    /* x */ x,
    /* y */ y,
  ])
}

const handleSashPointerUp = () => {
  document.body.style.removeProperty('cursor')
  window.removeEventListener('pointermove', handleSashPointerMove)
  window.removeEventListener('pointerup', handleSashPointerUp)
  const $Style = document.getElementById('SashStyle')
  // @ts-ignore
  $Style.remove()
}

const handleSashPointerDown = (event) => {
  // TODO maybe add a class to body instead?
  const $Style = document.createElement('style')
  $Style.id = 'SashStyle'
  $Style.textContent = `* {
  cursor: col-resize !important;
  pointer-events: none;
}

.SashVertical {
  pointer-events: all;
}
.
`
  document.head.append($Style)
  window.addEventListener('pointermove', handleSashPointerMove)
  window.addEventListener('pointerup', handleSashPointerUp)
  const $Target = event.target
  const id = getSashId($Target)
  RendererWorker.send([
    /* Layout.handleSashPointerDown */ 'Layout.handleSashPointerDown',
    /* id */ id,
  ])
}

export const show = (points) => {
  const $ActivityBar = document.createElement('div')
  $ActivityBar.id = 'ActivityBar'

  const $StatusBar = document.createElement('div')
  $StatusBar.id = 'StatusBar'

  const $TitleBar = document.createElement('div')
  $TitleBar.id = 'TitleBar'

  const $Main = document.createElement('main')
  $Main.id = 'Main'

  const $SideBar = document.createElement('div')
  $SideBar.id = 'SideBar'

  const $Panel = document.createElement('div')
  $Panel.id = 'Panel'

  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $SashSideBar = document.createElement('div')
  $SashSideBar.className = 'SashVertical'
  $SashSideBar.id = 'SashSideBar'

  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $SashPanel = document.createElement('div')
  $SashPanel.className = 'SashHorizontal'
  $SashPanel.id = 'SashPanel'

  const $Workbench = document.createElement('div')
  $Workbench.id = 'Workbench'
  $Workbench.append(
    $TitleBar,
    $Main,
    $SideBar,
    $ActivityBar,
    $Panel,
    $StatusBar,
    $SashSideBar,
    $SashPanel
  )
  // TODO don't like the random side effects here
  state.$ActivityBar = $ActivityBar
  state.$Main = $Main
  state.$Panel = $Panel
  state.$SideBar = $SideBar
  state.$StatusBar = $StatusBar
  state.$TitleBar = $TitleBar
  state.$Workbench = $Workbench
  state.$SashPanel = $SashPanel
  state.$SashSideBar = $SashSideBar
  update(points)
  // document.body.setAttribute('role', 'application') // TODO this doesn't seem to work
  $Workbench.setAttribute('role', 'application')
  document.body.append($Workbench)
  window.addEventListener('resize', handleResize, { passive: true })
  $SashSideBar.addEventListener('pointerdown', handleSashPointerDown)
  $SashPanel.addEventListener('pointerdown', handleSashPointerDown)
}

export const hide = () => {
  state.$Workbench.remove()
  window.removeEventListener('resize', handleResize)
}
