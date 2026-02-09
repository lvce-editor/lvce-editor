import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import { render } from '../ViewletManager/ViewletManager.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { LayoutState } from './LayoutState.ts'

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

const renderComponent = (kVisible, kId, oldState, newState, commands, appendIds) => {
  if (oldState[kVisible] && !newState[kVisible]) {
    commands.push(['Viewlet.remove', newState[kId]])
  }
  if (!oldState[kVisible] && newState[kVisible]) {
    commands.push(['Viewlet.create', newState[kId]])
    const dom = getDom(newState[kId])
    commands.push(['Viewlet.setDom2', newState[kId], dom])
    return
  }
  if (newState[kId]) {
    appendIds.push(newState[kId])
  }
}

const getActivityBarCommands = (oldState, newState, commands, contentAppendIds) => {
  return renderComponent('activityBarVisible', 'activityBarId', oldState, newState, commands, contentAppendIds)
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
  return renderComponent('sideBarVisible', 'sideBarId', oldState, newState, commands, contentAppendIds)
}

const getMainCommands = (oldState, newState, commands, mainContentsAppendIds) => {
  return renderComponent('mainVisible', 'mainId', oldState, newState, commands, mainContentsAppendIds)
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
  return renderComponent('panelVisible', 'panelId', oldState, newState, commands, mainContentsAppendIds)
}

const getMainContentsCommands = (oldState: LayoutState, newState, commands, contentAppendIds) => {
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

const getPreviewSashCommands = (oldState, newState, commands, workbenchAppendIds) => {
  if (oldState.previewSashVisible && !newState.previewSashVisible) {
    commands.push(['Viewlet.remove', newState.previewSashId])
    return
  }
  if (!oldState.previewSashVisible && newState.previewSashVisible) {
    commands.push(['Viewlet.createFunctionalRoot', `${newState.previewSashId}`, newState.previewSashId, true])
    const dom = [
      {
        type: VirtualDomElements.Div,
        className: `Sash SashPreview`,
        childCount: 0,
      },
    ]
    commands.push(['Viewlet.setDom2', newState.previewSashId, dom])
  }
  if (newState.previewSashVisible) {
    workbenchAppendIds.push(newState.previewSashId)
  }
}

const getPreviewCommands = (oldState, newState, commands, workbenchAppendIds) => {
  return renderComponent('previewVisible', 'previewId', oldState, newState, commands, workbenchAppendIds)
}

const getTitleBarCommands = (oldState, newState, commands, workbenchAppendIds) => {
  return renderComponent('titleBarVisible', 'titleBarId', oldState, newState, commands, workbenchAppendIds)
}

const getContentCommands = (oldState, newState, commands, workbenchAppendIds) => {
  // TODO support secondary side bar / chat view
  const contentAppendIds: any[] = []
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
  return renderComponent('statusBarVisible', 'statusBarId', oldState, newState, commands, workbenchAppendIds)
}

const getWorkbenchCommands = (oldState, newState, commands, workbenchAppendIds) => {
  if (!oldState.workbenchVisible && newState.workbenchVisible) {
    commands.push(['Viewlet.createFunctionalRoot', `${newState.workbenchId}`, newState.workbenchId, true])
    const dom = [
      {
        type: VirtualDomElements.Div,
        id: 'Workbench',
        className: 'Viewlet Layout Workbench new',
        role: 'application',
        childCount: 0,
      },
    ]
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
  getPreviewSashCommands(oldState, newState, commands, workbenchAppendIds)
  getPreviewCommands(oldState, newState, commands, workbenchAppendIds)
  getStatusBarCommands(oldState, newState, commands, workbenchAppendIds)
  getWorkbenchCommands(oldState, newState, commands, workbenchAppendIds)

  // TODO ensure focus commands are last in the commands array
  return commands
}
