const getDom = (id) => {
  // TODO ask viewlet registry to render component with that id
  return []
}

const getActivityBarCommands = (oldState, newState, commands, contentAppendIds) => {
  if (oldState.activityBarVisible && !newState.activityBarVisible) {
    commands.push(['Viewlet.remove', newState.activityBarId])
  }
  if (!oldState.activityBarVisible && newState.activityBarVisible) {
    commands.push(['Viewlet.create', newState.activityBarId])
    const dom = getDom(newState.activityBarId)
    commands.push(['Viewlet.setDom2', newState.activityBarId, dom])
    contentAppendIds.push(newState.activityBarId)
  }
}

const getSideBarCommands = (oldState, newState, commands, contentAppendIds) => {
  if (oldState.sideBarVisible && !newState.sideBarVisible) {
    commands.push(['Viewlet.remove', newState.sideBarId])
  }
  if (!oldState.sideBarVisible && newState.sideBarVisible) {
    commands.push(['Viewlet.create', newState.sideBarId])
    const dom = getDom(newState.sideBarId)
    commands.push(['Viewlet.setDom2', newState.sideBarId, dom])
    contentAppendIds.push(newState.sideBarId)
  }
}

const getMainCommands = (oldState, newState, commands, contentAppendIds) => {
  if (oldState.mainContentsVisible && !newState.mainContentsVisible) {
    commands.push(['Viewlet.remove', newState.mainContentsId])
  }
  if (!oldState.mainContentsVisible && newState.mainContentsVisible) {
    // TODO split this up further into main and panel
    commands.push(['Viewlet.create', newState.mainContentsId])
    const dom = getDom(newState.mainContentsId)
    commands.push(['Viewlet.setDom2', newState.mainContentsId, dom])
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
}

const getStatusBarCommands = (oldState, newState, commands, workbenchAppendIds) => {
  if (oldState.statusBarVisible && !newState.statusBarVisible) {
    commands.push(['Viewlet.remove', newState.statusBarId])
  }
  if (!oldState.statusBarVisible && newState.statusBarVisible) {
    commands.push(['Viewlet.create', newState.statusBarId])
    const dom = getDom(newState.statusBarId)
    commands.push(['Viewlet.setDom2', newState.statusBarId, dom])
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
