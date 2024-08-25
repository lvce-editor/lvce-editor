import * as Location from '../Location/Location.js'

export const isGitpod = Location.getHost().endsWith('.gitpod.io')
