import { file, dir } from 'tmp-promise'

export const getTmpFile = async () => {
  const { path } = await file()
  return path
}

export const getTmpDir = async () => {
  const { path } = await dir()
  return path
}
