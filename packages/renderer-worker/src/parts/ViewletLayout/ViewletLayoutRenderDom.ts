import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import { render } from '../ViewletManager/ViewletManager.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getDom = (id) => {
  const instance = ViewletStates.getByUid(id)
  if (!instance) {
    return [
      {
        type: VirtualDomElements.Div,
        childCount: 0,
        className: `Element-${id}`,
      },
    ]
  }
  const commands = render(instance.factory, instance.renderedState, instance.state, instance.state.uid)
  const domCommand = commands.find((command) => command[0] === 'Viewlet.setDom2')
  if (domCommand) {
    return domCommand[2]
  }
  // TODO ask viewlet registry to render component with that id
  return [
    {
      type: VirtualDomElements.Div,
      className: `Element-${id}`,
      childCount: 0,
    },
  ]
}

const getActivityBarCommands = (oldState, newState, commands, contentAppendIds) => {
  if (oldState.activityBarVisible && !newState.activityBarVisible) {
    commands.push(['Viewlet.remove', newState.activityBarId])
  }
  if (!oldState.activityBarVisible && newState.activityBarVisible) {
    commands.push(['Viewlet.create', newState.activityBarId])
    const dom = getDom(newState.activityBarId)
    commands.push(['Viewlet.setDom2', newState.activityBarId, dom])
    return
  }
  if (newState.activityBarVisible) {
    contentAppendIds.push(newState.activityBarId)
  }
}

const getSideBarSashCommands = (oldState, newState, commands, contentAppendIds) => {
  if (oldState.sideBarSashVisible && !newState.sideBarSashVisible) {
    commands.push(['Viewlet.remove', newState.sideBarSashId])
    return
  }
  if (!oldState.sideBarSashVisible && newState.sideBarSashVisible) {
    commands.push(['Viewlet.createFunctionalRoot', `${newState.sideBarSashId}`, newState.sideBarSashId, true])
    const dom = [
      {
        type: VirtualDomElements.Div,
        className: `Sash SashSideBar`,
        childCount: 0,
      },
    ]
    commands.push(['Viewlet.setDom2', newState.sideBarSashId, dom])
  }
  if (newState.sideBarSashVisible) {
    contentAppendIds.push(newState.sideBarSashId)
  }
}

const getSideBarCommands = (oldState, newState, commands, contentAppendIds) => {
  if (oldState.sideBarVisible && !newState.sideBarVisible) {
    commands.push(['Viewlet.remove', newState.sideBarId])
    return
  }
  if (!oldState.sideBarVisible && newState.sideBarVisible) {
    commands.push(['Viewlet.createFunctionalRoot', `${newState.sideBarId}`, newState.sideBarId, true])
    const dom = getDom(newState.sideBarId)
    commands.push(['Viewlet.setDom2', newState.sideBarId, dom])
  }
  if (newState.sideBarVisible) {
    contentAppendIds.push(newState.sideBarId)
  }
}

const getMainCommands = (oldState, newState, commands, mainContentsAppendIds) => {
  if (oldState.mainVisible && !newState.mainVisible) {
    commands.push(['Viewlet.remove', newState.mainId])
    return
  }
  if (!oldState.mainVisible && newState.mainVisible) {
    commands.push(['Viewlet.createFunctionalRoot', `${newState.mainId}`, newState.mainId, true])
    const dom = getDom(newState.mainId)
    commands.push(['Viewlet.setDom2', newState.mainId, dom])
  }
  if (newState.mainVisible) {
    mainContentsAppendIds.push(newState.mainId)
  }
}

const getPanelSashCommands = (oldState, newState, commands, contentAppendIds) => {
  if (oldState.panelSashVisible && !newState.panelSashVisible) {
    commands.push(['Viewlet.remove', newState.panelSashId])
    return
  }
  if (!oldState.panelSashVisible && newState.panelSashVisible) {
    commands.push(['Viewlet.createFunctionalRoot', `${newState.panelSashId}`, newState.panelSashId, true])
    const dom = getDom(newState.panelSashId)
    commands.push(['Viewlet.setDom2', newState.panelSashId, dom])
  }
  if (newState.panelSashVisible) {
    contentAppendIds.push(newState.panelSashId)
  }
}

const getPanelCommands = (oldState, newState, commands, mainContentsAppendIds) => {
  if (oldState.panelVisible && !newState.panelVisible) {
    commands.push(['Viewlet.remove', newState.panelId])
    return
  }
  if (!oldState.panelVisible && newState.panelVisible) {
    commands.push(['Viewlet.createFunctionalRoot', `${newState.panelId}`, newState.panelId, true])
    const dom = getDom(newState.panelId)
    commands.push(['Viewlet.setDom2', newState.panelId, dom])
  }
  if (newState.panelVisible) {
    mainContentsAppendIds.push(newState.panelId)
  }
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
    commands.push(['Viewlet.createFunctionalRoot', `${newState.mainContentsId}`, newState.mainContentsId, true])
    const dom = [
      {
        type: VirtualDomElements.Div,
        className: 'MainContents',
        childCount: 0,
      },
    ]
    commands.push(['Viewlet.setDom2', newState.mainContentsId, dom])

    commands.push(['Viewlet.replaceChildren', newState.mainContentsId, mainContentsAppendIds])
  }
  if (newState.mainContentsVisible) {
    contentAppendIds.push(newState.mainContentsId)
  }
}

const getTitleBarCommands = (oldState, newState, commands, workbenchAppendIds) => {
  if (oldState.titleBarVisible && !newState.titleBarVisible) {
    commands.push(['Viewlet.remove', newState.titleBarId])
  }
  if (!oldState.titleBarVisible && newState.titleBarVisible) {
    commands.push(['Viewlet.create', newState.titleBarId])
    const dom = getDom(newState.titleBarId)
    commands.push(['Viewlet.setDom2', newState.titleBarId, dom])
    return
  }
  if (!oldState.titleBarVisible && newState.titleBarVisible) {
    commands.push(['Viewlet.createFunctionalRoot', `${newState.titleBarId}`, newState.titleBarId, true])
    const dom = getDom(newState.titleBarId)
    commands.push(['Viewlet.setDom2', newState.titleBarId, dom])
  }
  if (newState.titleBarVisible) {
    workbenchAppendIds.push(newState.titleBarId)
  }
}

const getContentCommands = (oldState, newState, commands, workbenchAppendIds) => {
  // TODO support secondary side bar / chat view
  const contentAppendIds: any[] = []
  if (newState.sideBarLocation === 'left') {
    getActivityBarCommands(oldState, newState, commands, contentAppendIds)
    getSideBarCommands(oldState, newState, commands, contentAppendIds)
    getMainCommands(oldState, newState, commands, contentAppendIds)
  } else {
    getMainCommands(oldState, newState, commands, contentAppendIds)
    getSideBarCommands(oldState, newState, commands, contentAppendIds)
    getActivityBarCommands(oldState, newState, commands, contentAppendIds)
  }
  commands.push(['Content.append', newState.contentAreaId, contentAppendIds])
  workbenchAppendIds.push(newState.contentAreaId)
  if (newState.sideBarLocation === SideBarLocationType.Left) {
    getActivityBarCommands(oldState, newState, commands, contentAppendIds)
    getSideBarCommands(oldState, newState, commands, contentAppendIds)
    getSideBarSashCommands(oldState, newState, commands, contentAppendIds)
    getMainContentsCommands(oldState, newState, commands, contentAppendIds)
  } else {
    getMainContentsCommands(oldState, newState, commands, contentAppendIds)
    getSideBarSashCommands(oldState, newState, commands, contentAppendIds)
    getSideBarCommands(oldState, newState, commands, contentAppendIds)
    getActivityBarCommands(oldState, newState, commands, contentAppendIds)
  }
  if (!oldState.contentAreaVisible && newState.contentAreaVisible) {
    commands.push(['Viewlet.createFunctionalRoot', `${newState.contentAreaId}`, newState.contentAreaId, true])
    const dom = [
      {
        type: VirtualDomElements.Div,
        className: 'ContentArea',
        childCount: 0,
      },
    ]
    commands.push(['Viewlet.setDom2', newState.contentAreaId, dom])
  }
  if (newState.contentAreaVisible) {
    commands.push(['Viewlet.replaceChildren', newState.contentAreaId, contentAppendIds])
    workbenchAppendIds.push(newState.contentAreaId)
  }
}

const getStatusBarCommands = (oldState, newState, commands, workbenchAppendIds) => {
  if (oldState.statusBarVisible && !newState.statusBarVisible) {
    commands.push(['Viewlet.remove', newState.statusBarId])
  }
  if (!oldState.statusBarVisible && newState.statusBarVisible) {
    commands.push(['Viewlet.create', newState.statusBarId])
    const dom = getDom(newState.statusBarId)
    commands.push(['Viewlet.setDom2', newState.statusBarId, dom])
    return
  }
  if (!oldState.statusBarVisible && newState.statusBarVisible) {
    commands.push(['Viewlet.createFunctionalRoot', `${newState.statusBarId}`, newState.statusBarId, true])
    const dom = getDom(newState.statusBarId)
    commands.push(['Viewlet.setDom2', newState.statusBarId, dom])
  }
  if (newState.statusBarVisible) {
    workbenchAppendIds.push(newState.statusBarId)
  }
}

const getWorkbenchCommands = (oldState, newState, commands, workbenchAppendIds) => {
  if (!oldState.workbenchVisible && newState.workbenchVisible) {
    commands.push(['Viewlet.create', newState.workbenchId])
    const dom = getDom(newState.workbenchId)
    commands.push(['Viewlet.setDom2', newState.workbenchId, dom])
    commands.push(['Viewlet.append', newState.workbenchId, workbenchAppendIds])
    commands.push(['Viewlet.append', 'document.body', newState.workbenchId])
    commands.push(['Viewlet.createFunctionalRoot', `${newState.workbenchId}`, newState.workbenchId, true])
    commands.push(['Viewlet.setDom2', newState.workbenchId, dom])
  }
  if (newState.workbenchVisible) {
    commands.push(['Viewlet.replaceChildren', newState.workbenchId, workbenchAppendIds])
  }
  if (!oldState.workbenchVisible && newState.workbenchVisible) {
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
