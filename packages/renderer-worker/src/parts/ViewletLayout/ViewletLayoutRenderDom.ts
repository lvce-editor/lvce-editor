import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import { render } from '../ViewletManager/ViewletManager.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getDom = (id, className = '') => {
  const instance = ViewletStates.getByUid(id)
  console.log({ id, instance })

  if (!instance) {
    return [
      {
        type: VirtualDomElements.Div,
        childCount: 0,
        className: className || `Element-${id}`,
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

const renderComponent = (kVisible, kId, oldState, newState, _commands, appendIds, className = '') => {
  const commands: any[] = []
  const oldVisible = oldState[kVisible]
  const newVisible = newState[kVisible]
  const id = newState[kId]
  if (oldVisible && !newVisible) {
    commands.push(['Viewlet.remove', id])
  }
  if (!oldVisible && newVisible) {
    commands.push(['Viewlet.createFunctionalRoot', id, id, true])
    const dom = getDom(newState[kId], className)
    commands.push(['Viewlet.setDom2', id, dom])
    return commands
  }

  const instance = ViewletStates.getByUid(id)

  const renderCommands = render(instance, instance.state, instance.renderedState)
  commands.push(...renderCommands)

  console.log({ instance, id })

  // TODO if there is a real component visible, render it's dom
  // but not if it was already rendered
  if (newState[kId]) {
    appendIds.push(newState[kId])
  }
  return commands
}

const getActivityBarCommands = (oldState, newState, commands, contentAppendIds) => {
  return renderComponent('activityBarVisible', 'activityBarId', oldState, newState, commands, contentAppendIds, 'ActivityBar')
}

const getSideBarSashCommands = (oldState, newState, _commands, contentAppendIds) => {
  const commands: any[] = []
  if (oldState.sideBarSashVisible && !newState.sideBarSashVisible) {
    commands.push(['Viewlet.remove', newState.sideBarSashId])
    return commands
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
  return commands
}

const getSideBarCommands = (oldState, newState, commands, contentAppendIds) => {
  return renderComponent('sideBarVisible', 'sideBarId', oldState, newState, commands, contentAppendIds, 'SideBar')
}

const getMainCommands = (oldState, newState, commands, mainContentsAppendIds): readonly any[] => {
  return renderComponent('mainVisible', 'mainId', oldState, newState, commands, mainContentsAppendIds, 'Main')
}

const getPanelSashCommands = (oldState, newState, _commands, contentAppendIds): readonly any[] => {
  const commands: any[] = []
  if (oldState.panelSashVisible && !newState.panelSashVisible) {
    commands.push(['Viewlet.remove', newState.panelSashId])
    return commands
  }
  if (!oldState.panelSashVisible && newState.panelSashVisible) {
    commands.push(['Viewlet.createFunctionalRoot', `${newState.panelSashId}`, newState.panelSashId, true])
    const dom = getDom(newState.panelSashId, 'SashPanel')
    commands.push(['Viewlet.setDom2', newState.panelSashId, dom])
  }
  if (newState.panelSashVisible) {
    contentAppendIds.push(newState.panelSashId)
  }
  return commands
}

const getPanelCommands = (oldState, newState, commands, mainContentsAppendIds) => {
  return renderComponent('panelVisible', 'panelId', oldState, newState, commands, mainContentsAppendIds, 'Panel')
}

const getMainContentsCommands = (oldState, newState, _commands, contentAppendIds): readonly any[] => {
  const commands: any[] = []
  if (oldState.mainContentsVisible && !newState.mainContentsVisible) {
    commands.push(['Viewlet.remove', newState.mainContentsId])
    return commands
  }
  if (!oldState.mainContentsVisible && newState.mainContentsVisible) {
    const mainContentsAppendIds = []
    commands.push(
      ...getMainCommands(oldState, newState, commands, mainContentsAppendIds),
      ...getPanelSashCommands(oldState, newState, commands, mainContentsAppendIds),
      ...getPanelCommands(oldState, newState, commands, mainContentsAppendIds),
    )
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
  } else if (newState.mainContentsVisible) {
    debugger
    const mainContentsAppendIds = []

    commands.push(
      ...getMainCommands(oldState, newState, commands, mainContentsAppendIds),
      ...getPanelSashCommands(oldState, newState, commands, mainContentsAppendIds),
      ...getPanelCommands(oldState, newState, commands, mainContentsAppendIds),
    )
    commands.push(['Viewlet.replaceChildren', newState.mainContentsId, mainContentsAppendIds])
  }
  if (newState.mainContentsVisible) {
    contentAppendIds.push(newState.mainContentsId)
  }
  return commands
}

const getTitleBarCommands = (oldState, newState, commands, workbenchAppendIds): readonly any[] => {
  return renderComponent('titleBarVisible', 'titleBarId', oldState, newState, commands, workbenchAppendIds, 'TitleBar')
}

const getContentCommands = (oldState, newState, _commands, workbenchAppendIds): readonly any[] => {
  const commands: any[] = []
  // TODO support secondary side bar / chat view
  const contentAppendIds: any[] = []
  workbenchAppendIds.push(newState.contentAreaId)
  if (newState.sideBarLocation === SideBarLocationType.Left) {
    commands.push(
      ...getActivityBarCommands(oldState, newState, commands, contentAppendIds),
      ...getSideBarCommands(oldState, newState, commands, contentAppendIds),
      ...getSideBarSashCommands(oldState, newState, commands, contentAppendIds),
      ...getMainContentsCommands(oldState, newState, commands, contentAppendIds),
    )
  } else {
    commands.push(
      ...getMainContentsCommands(oldState, newState, commands, contentAppendIds),
      ...getSideBarSashCommands(oldState, newState, commands, contentAppendIds),
      ...getSideBarCommands(oldState, newState, commands, contentAppendIds),
      ...getActivityBarCommands(oldState, newState, commands, contentAppendIds),
    )
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
  console.log({ content: commands })
  return commands
}

const getStatusBarCommands = (oldState, newState, commands, workbenchAppendIds) => {
  return renderComponent('statusBarVisible', 'statusBarId', oldState, newState, commands, workbenchAppendIds, 'StatusBar')
}

const getWorkbenchCommands = (oldState, newState, _commands, workbenchAppendIds): readonly any[] => {
  const commands: any[] = []
  if (!oldState.workbenchVisible && newState.workbenchVisible) {
    commands.push(['Viewlet.createFunctionalRoot', `${newState.workbenchId}`, newState.workbenchId, true])
    const dom = getDom(newState.workbenchId, 'Workbench')
    commands.push(['Viewlet.setDom2', newState.workbenchId, dom])
  }
  if (newState.workbenchVisible) {
    commands.push(['Viewlet.replaceChildren', newState.workbenchId, workbenchAppendIds])
  }
  if (!oldState.workbenchVisible && newState.workbenchVisible) {
    commands.push(['Viewlet.appendToBody', newState.workbenchId])
  }
  return commands
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

  console.log({ oldState, newState, eq: oldState === newState })
  const workbenchAppendIds: any[] = []
  const commands = [
    ...getTitleBarCommands(oldState, newState, [], workbenchAppendIds),
    ...getContentCommands(oldState, newState, [], workbenchAppendIds),
    ...getStatusBarCommands(oldState, newState, [], workbenchAppendIds),
    ...getWorkbenchCommands(oldState, newState, [], workbenchAppendIds),
  ]

  console.log({ commands })
  // TODO ensure focus commands are last in the commands array
  return commands
}
