import * as ApplicationRegistry from '../ApplicationRegistry/ApplicationRegistry.ts'
import * as MainAreaWorker from '../MainAreaWorker/MainAreaWorker.js'
import { renderMainAreaPending } from '../RenderMainAreaPending/RenderMainAreaPending.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const pending = new Map()
const mainOwners = new Map()

const isLive = (uid) => {
  const instance = ViewletStates.getInstance(uid)
  return instance?.moduleId === 'Terminal2' && !instance.state.disposed && instance.status !== 'disposing' && instance.status !== 'disposed'
}

const sameApplication = (left, right) => ApplicationRegistry.getOwner(left) === ApplicationRegistry.getOwner(right)

export const resize = async (uid, bounds) => {
  if (!isLive(uid)) {
    throw new Error('Terminal has exited')
  }
  const commands = await Viewlet.resize(uid, bounds)
  if (commands.length > 0) {
    await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  }
}

export const takePanelTerminal = async (mainUid, panelUid, terminalUid) => {
  const panel = ViewletStates.getInstance(panelUid)
  const main = ViewletStates.getInstance(mainUid)
  if (
    panel?.moduleId !== 'Terminals' ||
    main?.moduleId !== 'Main' ||
    !sameApplication(mainUid, panelUid) ||
    !isLive(terminalUid) ||
    pending.has(terminalUid) ||
    mainOwners.has(terminalUid)
  ) {
    return undefined
  }
  const index = panel.state.tabs.findIndex((tab) => (tab.terminalUids || [tab.uid]).includes(terminalUid))
  if (index === -1) {
    return undefined
  }
  const tab = panel.state.tabs[index]
  const splitIndex = (tab.terminalUids || [tab.uid]).indexOf(terminalUid)
  const descriptor = { uid: terminalUid, label: tab.label, icon: tab.icon, groupUid: tab.uid }
  pending.set(terminalUid, { descriptor, index, splitIndex, panelUid, mainUid, exited: false })
  try {
    await Viewlet.executeViewletCommand(panelUid, 'detachTerminal', terminalUid)
    if (!isLive(terminalUid) || pending.get(terminalUid)?.exited) {
      await rollback(terminalUid)
      return undefined
    }
    return descriptor
  } catch (error) {
    await rollback(terminalUid)
    throw error
  }
}

export const commit = (terminalUid, mainUid) => {
  const transfer = pending.get(terminalUid)
  if (!transfer || transfer.mainUid !== mainUid || transfer.exited || !isLive(terminalUid)) {
    throw new Error('Terminal exited during transfer')
  }
  mainOwners.set(terminalUid, mainUid)
  pending.delete(terminalUid)
}

export const rollback = async (terminalUid) => {
  const transfer = pending.get(terminalUid)
  if (!transfer) {
    return
  }
  pending.delete(terminalUid)
  if (transfer.exited || !isLive(terminalUid)) {
    await Viewlet.dispose(terminalUid)
    return
  }
  const panel = ViewletStates.getInstance(transfer.panelUid)
  if (!panel) {
    await Viewlet.dispose(terminalUid)
    return
  }
  await Viewlet.executeViewletCommand(transfer.panelUid, 'attachTerminal', transfer.descriptor, transfer.index, transfer.splitIndex)
}

export const beginPanelTransfer = (mainUid, panelUid, terminalUid) => {
  const panel = ViewletStates.getInstance(panelUid)
  if (
    panel?.moduleId !== 'Terminals' ||
    !sameApplication(mainUid, panelUid) ||
    mainOwners.get(terminalUid) !== mainUid ||
    !isLive(terminalUid) ||
    pending.has(terminalUid)
  ) {
    return false
  }
  pending.set(terminalUid, { mainUid, panelUid, exited: false })
  return true
}

export const attachPanelTerminal = async (mainUid, panelUid, terminalUid, label, icon) => {
  const transfer = pending.get(terminalUid)
  if (!transfer || transfer.mainUid !== mainUid || transfer.panelUid !== panelUid) {
    throw new Error('Invalid terminal transfer')
  }
  try {
    if (!transfer.exited && isLive(terminalUid)) {
      await Viewlet.executeViewletCommand(panelUid, 'attachTerminal', { uid: terminalUid, label, icon })
    }
    if (transfer.exited) {
      await Viewlet.executeViewletCommand(panelUid, 'handleTerminalExit', terminalUid)
      await Viewlet.dispose(terminalUid)
    }
    mainOwners.delete(terminalUid)
    pending.delete(terminalUid)
  } catch (error) {
    await Viewlet.executeViewletCommand(panelUid, 'detachTerminal', terminalUid)
    throw error
  }
}

export const cancelPanelTransfer = async (terminalUid) => {
  const transfer = pending.get(terminalUid)
  pending.delete(terminalUid)
  if (transfer?.exited || !isLive(terminalUid)) {
    mainOwners.delete(terminalUid)
    await Viewlet.dispose(terminalUid)
    return false
  }
  return true
}

export const handleExit = async (terminalUid) => {
  const transfer = pending.get(terminalUid)
  if (transfer) {
    transfer.exited = true
    return true
  }
  const mainUid = mainOwners.get(terminalUid)
  if (mainUid === undefined) {
    return false
  }
  mainOwners.delete(terminalUid)
  await MainAreaWorker.invoke('MainArea.handleTerminalExit', mainUid, terminalUid)
  await renderMainAreaPending(mainUid)
  await Viewlet.dispose(terminalUid)
  return true
}

export const forget = (terminalUid) => {
  mainOwners.delete(terminalUid)
  const transfer = pending.get(terminalUid)
  if (transfer) {
    transfer.exited = true
  }
}
