import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const copyWorkerArtifacts = async ({ from, to }: { from: string; to: string }): Promise<void> => {
  if (Path.baseName(Path.dirname(from)) !== 'dist') {
    await Copy.copyFile({ from, to })
    return
  }
  await Copy.copy({ from: Path.dirname(from), to: Path.dirname(to) })
  // Preserve the configured entry name when it differs from the package entry.
  if (Path.baseName(from) !== Path.baseName(to)) {
    await Copy.copyFile({ from, to })
  }
}
