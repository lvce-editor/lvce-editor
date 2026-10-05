import { readdir } from 'node:fs/promises'
import * as CodiconsPath from '../CodiconsPath/CodiconsPath.ts'
import * as Copy from '../Copy/Copy.ts'

export const copyIcons = async (to: string): Promise<void> => {
  await Copy.copy({
    from: CodiconsPath.codiconsIconsPath,
    to,
  })
  const codiconNames = await readdir(CodiconsPath.codiconsIconsPath)
  await Copy.copy({
    from: 'static/icons',
    to,
    ignore: codiconNames,
  })
}
