import * as Env from '../Env/Env.js'

export const isGitpod = Boolean(Env.env.GITPOD_WORKSPACE_ID)
