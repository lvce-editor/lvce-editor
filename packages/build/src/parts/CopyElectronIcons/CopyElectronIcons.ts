import { readdir } from 'node:fs/promises'
import * as CodiconsPath from '../CodiconsPath/CodiconsPath.ts'
import * as Copy from '../Copy/Copy.ts'

export const copyElectronIcons = async ({ resourcesPath, commitHash }) => {
  const iconPath = `${resourcesPath}/app/static/${commitHash}/icons`
  await Copy.copy({
    from: CodiconsPath.codiconsIconsPath,
    to: iconPath,
  })
  const codiconNames = await readdir(CodiconsPath.codiconsIconsPath)
  await Copy.copy({
    from: 'static/icons',
    to: iconPath,
    ignore: codiconNames,
  })
}
