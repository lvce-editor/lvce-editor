import * as LayoutKeys from '../LayoutKeys/LayoutKeys.js'
import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getDom = (id) => {
  const instance = ViewletStates.getByUid(id)
  if (!instance) {
    console.log('not found', id)
    return []
  }
  console.log({ id, instance })
  // const x = ViewletStates.getState(id)
  // console.log({ x })
  // TODO ask viewlet registry to render component with that id
  return []
}

const getActivityBarCommands = (oldState, newState, commands, contentAppendIds) => {
  if (oldState.activityBarVisible && !newState.activityBarVisible) {
    commands.push(['Viewlet.remove', newState.activityBarId])
    return
  }
  if (!oldState.activityBarVisible && newState.activityBarVisible) {
    commands.push(['Viewlet.create', newState.activityBarId])
    const dom = getDom(newState.activityBarId)
    commands.push(['Viewlet.setDom2', newState.activityBarId, dom])
    contentAppendIds.push(newState.activityBarId)
  }
}

const getSideBarSashCommands = (oldState, newState, commands, contentAppendIds) => {
  if (oldState.sideBarSashVisible && !newState.sideBarSashVisible) {
    commands.push(['Viewlet.remove', newState.sideBarSashId])
    return
  }
  if (!oldState.sideBarSashVisible && newState.sideBarSashVisible) {
    commands.push(['Viewlet.create', newState.sideBarSashId])
    const dom = getDom(newState.sideBarSashId)
    commands.push(['Viewlet.setDom2', newState.sideBarSashId, dom])
  }
  contentAppendIds.push(newState.sideBarSashId)
}

const getSideBarCommands = (oldState, newState, commands, contentAppendIds) => {
  if (oldState.sideBarVisible && !newState.sideBarVisible) {
    commands.push(['Viewlet.remove', newState.sideBarId])
    return
  }
  if (!oldState.sideBarVisible && newState.sideBarVisible) {
    commands.push(['Viewlet.create', newState.sideBarId])
    const dom = getDom(newState.sideBarId)
    commands.push(['Viewlet.setDom2', newState.sideBarId, dom])
  }
  contentAppendIds.push(newState.sideBarId)
}

const getPanelSashCommands = (oldState, newState, commands, contentAppendIds) => {
  if (oldState.panelSashVisible && !newState.panelSashVisible) {
    commands.push(['Viewlet.remove', newState.panelSashId])
    return
  }
  if (!oldState.panelSashVisible && newState.panelSashVisible) {
    commands.push(['Viewlet.create', newState.panelSashId])
    const dom = getDom(newState.panelSashId)
    commands.push(['Viewlet.setDom2', newState.panelSashId, dom])
  }
  contentAppendIds.push(newState.panelSashId)
}

const getPanelCommands = (oldState, newState, commands, mainContentsAppendIds) => {
  if (oldState.panelVisible && !newState.panelVisible) {
    commands.push(['Viewlet.remove', newState.panelId])
  }
  if (!oldState.panelVisible && newState.panelVisible) {
    commands.push(['Viewlet.create', newState.panelId])
    const dom = getDom(newState.panelId)
    commands.push(['Viewlet.setDom2', newState.panelId, dom])
  }
  mainContentsAppendIds.push(newState.panelId)
}

const getMainCommands = (oldState, newState, commands, mainContentsAppendIds) => {
  if (oldState.mainVisible && !newState.mainVisible) {
    commands.push(['Viewlet.remove', newState.panelId])
  }
  if (!oldState.mainVisible && newState.mainVisible) {
    commands.push(['Viewlet.create', newState.panelId])
    const dom = getDom(newState.panelId)
    commands.push(['Viewlet.setDom2', newState.panelId, dom])
  }
  mainContentsAppendIds.push(newState.mainId)
}

const getMainContentsCommands = (oldState, newState, commands, contentAppendIds) => {
  if (oldState.mainContentsVisible && !newState.mainContentsVisible) {
    commands.push(['Viewlet.remove', newState.mainContentsId])
    return
  }
  if (!oldState.mainContentsVisible && newState.mainContentsVisible) {
    const mainContentsAppendIds = []
    getMainCommands(oldState, newState, commands, mainContentsAppendIds)
    getPanelSashCommands(oldState, newState, commands, mainContentsAppendIds)
    getPanelCommands(oldState, newState, commands, mainContentsAppendIds)
    commands.push(['Viewlet.create', newState.mainContentsId])
    commands.push(['Viewlet.append', newState.mainContentsId, mainContentsAppendIds])
  }
  contentAppendIds.push(newState.mainContentsId)
}

const getTitleBarCommands = (oldState, newState, commands, workbenchAppendIds) => {
  if (oldState.titleBarVisible && !newState.titleBarVisible) {
    commands.push(['Viewlet.remove', newState.titleBarId])
    return
  }
  if (!oldState.titleBarVisible && newState.titleBarVisible) {
    commands.push(['Viewlet.create', newState.titleBarId])
    const dom = getDom(newState.titleBarId)
    commands.push(['Viewlet.setDom2', newState.titleBarId, dom])
    workbenchAppendIds.push(newState.titleBarId)
  }
}

const getContentCommands = (oldState, newState, commands, workbenchAppendIds) => {
  // TODO support secondary side bar / chat view
  const contentAppendIds: any[] = []
  if (newState.sideBarLocation === SideBarLocationType.Left) {
    getActivityBarCommands(oldState, newState, commands, contentAppendIds)
    getSideBarSashCommands(oldState, newState, commands, contentAppendIds)
    getSideBarCommands(oldState, newState, commands, contentAppendIds)
    getMainContentsCommands(oldState, newState, commands, contentAppendIds)
  } else {
    getMainContentsCommands(oldState, newState, commands, contentAppendIds)
    getSideBarCommands(oldState, newState, commands, contentAppendIds)
    getSideBarSashCommands(oldState, newState, commands, contentAppendIds)
    getActivityBarCommands(oldState, newState, commands, contentAppendIds)
  }
  commands.push(['Viewlet.append', newState.contentAreaId, contentAppendIds])
  workbenchAppendIds.push(newState.contentAreaId)
}

const getStatusBarCommands = (oldState, newState, commands, workbenchAppendIds) => {
  if (oldState.points[LayoutKeys.StatusBarVisible] && !newState.points[LayoutKeys.StatusBarVisible]) {
    commands.push(['Viewlet.remove', newState.statusBarId])
    return
  }
  if (!oldState.points[LayoutKeys.StatusBarVisible] && newState.points[LayoutKeys.StatusBarVisible]) {
    commands.push(['Viewlet.create', newState.statusBarId])
    const dom = getDom(newState.statusBarId)
    commands.push(['Viewlet.setDom2', newState.statusBarId, dom])
    workbenchAppendIds.push(newState.statusBarId)
  }
}

const getWorkbenchCommands = (oldState, newState, commands, workbenchAppendIds) => {
  if (!oldState.workbenchVisible && newState.workbenchVisible) {
    commands.push(['Viewlet.create', newState.workbenchId])
    const dom = [
      {
        type: VirtualDomElements.Div,
        id: 'Workbench',
        className: 'Viewlet Layout Workbench',
        role: 'application',
        childCount: 0,
      },
    ]
    commands.push(['Viewlet.setDom2', newState.workbenchId, dom])
    commands.push(['Viewlet.append', newState.workbenchId, workbenchAppendIds])
    commands.push(['Viewlet.appendToBody', newState.workbenchId])
  }
}

export const renderDom = (oldState, newState) => {
  // const dom = (
  //   <div class="Workbench" id="1">
  //     <div class="TitleBar" id="2"></div>
  //     <div class="ContentArea" id="3">
  //       <If condition={sideBarLocation === 'left'}>
  //         <div class="MainContents" id="4">
  //           <div class="Main" id="5"></div>
  //         </div>
  //         <div class="SideBar" id="6"></div>
  //         <div class="ActivityBar" id="7"></div>
  //       </If>
  //       <If condition={sideBarLocation === 'right'}>
  //         <div class="ActivityBar" id="7"></div>
  //         <div class="SideBar" id="6"></div>
  //         <div class="MainContents" id="4">
  //           <div class="Main" id="5"></div>
  //         </div>
  //       </If>
  //     </div>
  //     <div class="StatusBar" id="8"></div>
  //   </div>
  // )
  const commands: any[] = []
  const workbenchAppendIds: any[] = []
  getTitleBarCommands(oldState, newState, commands, workbenchAppendIds)
  getContentCommands(oldState, newState, commands, workbenchAppendIds)
  getStatusBarCommands(oldState, newState, commands, workbenchAppendIds)
  getWorkbenchCommands(oldState, newState, commands, workbenchAppendIds)

  // TODO ensure focus commands are last in the commands array
  return commands
}
