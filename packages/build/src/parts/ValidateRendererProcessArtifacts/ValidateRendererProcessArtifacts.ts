import { existsSync } from 'node:fs'
import * as Path from '../Path/Path.ts'

const artifactNames = ['rendererProcessMain.js', 'xterm.js']

export const validateRendererProcessArtifacts = ({ rendererProcessPath }) => {
  const distPath = Path.join(Path.absolute(rendererProcessPath), 'dist')
  for (const artifactName of artifactNames) {
    const artifactPath = Path.join(distPath, artifactName)
    if (!existsSync(artifactPath)) {
      throw new Error(`renderer process artifact not found: ${artifactPath}`)
    }
  }
}
