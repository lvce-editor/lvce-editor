import * as Env from '../Env/Env.js'

export const isAppImage = () => {
  return Boolean(Env.env.APPIMAGE)
}
