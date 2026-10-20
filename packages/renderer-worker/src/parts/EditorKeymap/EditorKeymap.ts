import * as ApplicationRegistry from '../ApplicationRegistry/ApplicationRegistry.ts'
import * as Command from '../Command/Command.js'
import * as Id from '../Id/Id.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

interface Registration {
  readonly applicationId: string | undefined
  readonly rootId: string
}

const registrations = new Map<number, Registration>()

export const register = async (keymap: unknown, applicationId?: string): Promise<number> => {
  const layoutUid =
    applicationId === undefined ? ViewletStates.getInstance('Layout')?.state.uid : ApplicationRegistry.assertOpen(applicationId).layoutUid
  if (layoutUid === undefined) throw new Error('Editor keymap requires an open workbench')
  const id = Id.create()
  const rootId = `Workbench-${layoutUid}`
  await RendererProcess.invoke('EditorKeymap.register', rootId, id, keymap)
  registrations.set(id, { applicationId, rootId })
  return id
}

export const remove = async (id: number, applicationId?: string): Promise<void> => {
  const registration = registrations.get(id)
  if (!registration || registration.applicationId !== applicationId) return
  await RendererProcess.invoke('EditorKeymap.remove', registration.rootId, id)
  registrations.delete(id)
}

export const dispose = async (applicationId: string): Promise<void> => {
  for (const [id, registration] of registrations) {
    if (registration.applicationId === applicationId) await remove(id, applicationId)
  }
}

export const execute = async (id: number, command: string, ...args: readonly unknown[]): Promise<void> => {
  const registration = registrations.get(id)
  if (!registration) return
  if (registration.applicationId === undefined) {
    await Command.execute(command, ...args)
  } else if (ApplicationRegistry.isOpen(registration.applicationId)) {
    await ApplicationRegistry.track(registration.applicationId, () =>
      ViewletManager.executeForApplication(registration.applicationId, command, ...args),
    )
  }
}
