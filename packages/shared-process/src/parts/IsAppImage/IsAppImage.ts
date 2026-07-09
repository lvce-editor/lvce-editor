import * as Env from '../Env/Env.ts'

export const isAppImage = (): any => {
  return Boolean(Env.env.APPIMAGE)
}
