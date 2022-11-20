import * as IconTheme from './IconTheme.js'

export const name = 'IconTheme'

export const Commands = {
  hydrate: IconTheme.hydrate,
  setIconTheme: IconTheme.setIconTheme,
  // TODO command necessary?
  // TODO hydrate should be an alias for reload/load
}
