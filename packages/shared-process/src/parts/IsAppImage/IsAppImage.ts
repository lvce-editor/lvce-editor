import * as Env from '../Env/Env.ts'

export const isAppImage = () => {
  return Boolean(Env.env.APPIMAGE)
}
