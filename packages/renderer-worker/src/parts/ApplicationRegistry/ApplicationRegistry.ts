import * as ApplicationStateStorage from '../ApplicationStateStorage/ApplicationStateStorage.ts'

export interface Application {
  readonly href: string
  readonly id: string
  readonly layoutUid: number
  readonly textFileExtensions?: readonly string[]
  readonly workspacePath: string
  readonly workspaceUri: string
}

const applications = new Map<string, Application>()
const owners = new Map<number, string>()
const applicationUids = new Map<string, Set<number>>()
const savedStates = new Map<string, Map<string | number, Promise<string>>>()
const operations = new Map<string, Set<Promise<unknown>>>()
const closing = new Set<string>()

export const assertOpen = (applicationId: string): Application => {
  const application = get(applicationId)
  if (closing.has(applicationId)) {
    throw new Error(`Application is closing: ${applicationId}`)
  }
  return application
}

export const track = async <T>(applicationId: string, operation: () => Promise<T>): Promise<T> => {
  assertOpen(applicationId)
  const pending = operations.get(applicationId)!
  const promise = Promise.try(operation)
  pending.add(promise)
  try {
    return await promise
  } finally {
    pending.delete(promise)
  }
}

export const close = (applicationId: string): void => {
  get(applicationId)
  closing.add(applicationId)
}

export const waitForOperations = async (applicationId: string): Promise<void> => {
  const pending = operations.get(applicationId)
  while (pending?.size) {
    await Promise.allSettled(pending)
  }
}

export const get = (applicationId: string): Application => {
  const application = applications.get(applicationId)
  if (!application) {
    throw new Error(`Application not found: ${applicationId}`)
  }
  return application
}

export const getOwner = (uid: number): string | undefined => owners.get(uid)

export const own = (applicationId: string, uid: number): void => {
  assertOpen(applicationId)
  if (!Number.isFinite(uid) || uid <= 0) {
    throw new Error(`Invalid component uid: ${uid}`)
  }
  const owner = owners.get(uid)
  if (owner !== undefined && owner !== applicationId) {
    throw new Error(`Component ${uid} already belongs to application ${owner}`)
  }
  owners.set(uid, applicationId)
  applicationUids.get(applicationId)!.add(uid)
}

export const create = (application: Application): void => {
  if (!application.id || applications.has(application.id)) {
    throw new Error(`Invalid or duplicate application: ${application.id}`)
  }
  if (!Number.isFinite(application.layoutUid) || application.layoutUid <= 0 || owners.has(application.layoutUid)) {
    throw new Error(`Invalid or duplicate layout uid: ${application.layoutUid}`)
  }
  applications.set(application.id, Object.freeze({ ...application }))
  applicationUids.set(application.id, new Set())
  savedStates.set(application.id, new Map())
  operations.set(application.id, new Set())
  own(application.id, application.layoutUid)
}

export const getUids = (applicationId: string): readonly number[] => {
  get(applicationId)
  return [...applicationUids.get(applicationId)!]
}

export const release = (uid: number): void => {
  const owner = owners.get(uid)
  if (owner === undefined) {
    return
  }
  owners.delete(uid)
  applicationUids.get(owner)?.delete(uid)
}

export const getSavedState = async (applicationId: string, key: string | number): Promise<unknown> => {
  get(applicationId)
  const pending = savedStates.get(applicationId)!.get(key)
  if (!pending) return undefined
  return ApplicationStateStorage.read(await pending)
}

export const setSavedState = async (applicationId: string, key: string | number, value: unknown): Promise<void> => {
  get(applicationId)
  const states = savedStates.get(applicationId)!
  const previous = states.get(key)
  const pending = ApplicationStateStorage.write(value)
  states.set(key, pending)
  try {
    await pending
  } catch (error) {
    if (states.get(key) === pending) {
      if (previous) states.set(key, previous)
      else states.delete(key)
    }
    throw error
  }
  if (previous) await ApplicationStateStorage.remove(await previous)
}

// The caller disposes the application's components before removing its ownership.
export const remove = async (applicationId: string): Promise<void> => {
  const pending = [...(savedStates.get(applicationId)?.values() || [])]
  const uids = applicationUids.get(applicationId) || []
  for (const uid of uids) {
    owners.delete(uid)
  }
  applicationUids.delete(applicationId)
  savedStates.delete(applicationId)
  applications.delete(applicationId)
  operations.delete(applicationId)
  closing.delete(applicationId)
  await Promise.all(pending.map(async (entry: Readonly<Promise<string>>) => ApplicationStateStorage.remove(await entry)))
}
