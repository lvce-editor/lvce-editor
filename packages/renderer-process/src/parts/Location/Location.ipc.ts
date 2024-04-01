import * as Location from './Location.ts'

export const name = 'Location'

export const Commands = {
  getHref: Location.getHref,
  getPathName: Location.getPathName,
  hydrate: Location.hydrate,
  setPathName: Location.setPathName,
}
