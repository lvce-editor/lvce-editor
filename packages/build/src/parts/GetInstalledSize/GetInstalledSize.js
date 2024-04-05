import * as Exec from '../Exec/Exec.js'

// see https://stackoverflow.com/questions/19029008/how-to-create-a-simply-debian-package-just-compress-extract-sources-or-any-file
export const getInstalledSize = async (cwd) => {
  const { stdout } = await Exec.exec(`du -ks usr|cut -f 1`, {
    cwd,
    shell: true,
  })
  const installedSize = Number.parseInt(stdout, 10)
  return installedSize
}
