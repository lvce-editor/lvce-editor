export interface Application {
  readonly id: string
  readonly layoutUid: number
  readonly workspaceUri: string
  readonly workspacePath: string
  readonly href: string
}

const applications = new Map<string, Application>()
const owners = new Map<number, string>()
const applicationUids = new Map<string, Set<number>>()
const savedStates = new Map<string, Map<string | number, unknown>>()

export const get = (applicationId: string): Application => {
  const application = applications.get(applicationId)
  if (!application) {
    throw new Error(`Application not found: ${applicationId}`)
  }
  return application
}

export const getOwner = (uid: number): string | undefined => owners.get(uid)

export const own = (applicationId: string, uid: number): void => {
  get(applicationId)
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

export const getSavedState = (applicationId: string, key: string | number): unknown => {
  get(applicationId)
  return structuredClone(savedStates.get(applicationId)!.get(key))
}

export const setSavedState = (applicationId: string, key: string | number, value: unknown): void => {
  get(applicationId)
  savedStates.get(applicationId)!.set(key, structuredClone(value))
}

// The caller disposes the application's components before removing its ownership.
export const remove = (applicationId: string): void => {
  for (const uid of applicationUids.get(applicationId) || []) {
    owners.delete(uid)
  }
  applicationUids.delete(applicationId)
  savedStates.delete(applicationId)
  applications.delete(applicationId)
}
