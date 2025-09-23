const getContentCommands = (oldState, newState) => {
  const commands = []
  const contentAppendIds = []
  if (newState.sideBarLocation === 'left') {
    if (oldState.activityBarVisible && !newState.activityBarVisible) {
      commands.push(['Viewlet.remove', newState.activityBarId])
    }
    if (!oldState.activityBarVisible && newState.activityBarVisible) {
      commands.push(['Viewlet.create', newState.activityBarId])
      const dom = Viewlet.getDom(newState.activityBarId)
      commands.push(['Viewlet.setDom2', newState.activityBarId, dom])
      contentAppendIds.push(newState.activityBarId)
    }
    if (oldState.sideBarVisible && !newState.sideBarVisible) {
      commands.push(['Viewlet.remove', newState.sideBarId])
    }
    if (!oldState.sideBarVisible && newState.sideBarVisible) {
      commands.push(['Viewlet.create', newState.sideBarId])
      const dom = Viewlet.getDom(newState.sideBarId)
      commands.push(['Viewlet.setDom2', newState.sideBarId, dom])
      contentAppendIds.push(newState.sideBarId)
    }
    if (oldState.mainContentsVisible && !newState.mainContentsVisible) {
      commands.push(['Viewlet.remove', newState.mainContentsId])
    }
    if (!oldState.mainContentsVisible && newState.mainContentsVisible) {
      // TODO split this up further into main and panel
      commands.push(['Viewlet.create', newState.mainContentsId])
      const dom = Viewlet.getDom(newState.mainContentsId)
      commands.push(['Viewlet.setDom2', newState.mainContentsId, dom])
    }
  }
  commands.push(['Content.append', newState.contentAreaId, contentAppendIds])
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
  const commands = []
  if (!oldState.workbenchVisible && newState.workbenchVisible) {
    commands.push(['Viewlet.create', newState.workbenchId])
    const dom = Viewlet.getDom(newState.workbenchId)
    commands.push(['Viewlet.setDom2', newState.workbenchId, dom])
  }
  const workbenchAppendIds = []
  if (oldState.titleBarVisible && !newState.titleBarVisible) {
    commands.push(['Viewlet.remove', newState.titleBarId])
  }
  if (!oldState.titleBarVisible && newState.titleBarVisible) {
    commands.push(['Viewlet.create', newState.titleBarId])
    const dom = Viewlet.getDom(newState.titleBarId)
    commands.push(['Viewlet.setDom2', newState.titleBarId, dom])
    workbenchAppendIds.push(newState.titleBarId)
  }
  const contentCommands = getContentCommands(oldState, newState)
  commands.push(...contentCommands)
  workbenchAppendIds.push(newState.contentAreaId)
  if (oldState.statusBarVisible && !newState.statusBarVisible) {
    commands.push(['Viewlet.remove', newState.statusBarId])
  }
  if (!oldState.statusBarVisible && newState.statusBarVisible) {
    commands.push(['Viewlet.create', newState.statusBarId])
    const dom = Viewlet.getDom(newState.statusBarId)
    commands.push(['Viewlet.setDom2', newState.statusBarId, dom])
    workbenchAppendIds.push(newState.statusBarId)
  }
  commands.push(['Viewlet.append', newState.workbenchId, workbenchAppendIds])
  if (!oldState.workbenchVisible && newState.workbenchVisible) {
    commands.push(['Viewlet.append', 'document.body', newState.workbenchId])
  }
}
