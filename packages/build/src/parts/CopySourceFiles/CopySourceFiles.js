import { execSync } from 'node:child_process'
import { dirname } from 'node:path'
import * as Mkdir from '../Mkdir/Mkdir.js'
import * as Path from '../Path/Path.js'
import * as Shared from '../Shared/Shared.js'

/**
 * Get all git-tracked files from the repository root
 * @returns {string[]}
 */
const getGitTrackedFiles = () => {
  try {
    const output = execSync('git ls-files', { encoding: 'utf-8', cwd: Path.absolute('.') })
    return output
      .trim()
      .split('\n')
      .filter((file) => file.length > 0)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.warn('Failed to get git tracked files:', errorMessage)
    return []
  }
}

/**
 * Filter files that should be included in the source code viewer
 * @param {string} file
 * @returns {boolean}
 */
const shouldIncludeFile = (file) => {
  // Exclude certain files and directories
  const excludePatterns = [
    /^\.git/,
    /^\.github/,
    /^node_modules/,
    /^packages\/build\/.tmp/,
    /^packages\/.*\/\.tmp/,
    /^packages\/build\/node_modules/,
    /^\.vscode/,
    /^dist\//,
    /^build\//,
    /package-lock\.json$/,
    /\.nvmrc$/,
    /^scripts\/(run-electron|download|update|cyclic-dependencies)/,
  ]

  return !excludePatterns.some((pattern) => pattern.test(file))
}

/**
 * Copy git tracked source files to the playground directory
 * @param {string} destination - Target directory for source files
 * @param {string} root - Repository root
 */
export const copySourceFiles = async (destination, root = Path.absolute('.')) => {
  await Mkdir.mkdir(destination)

  const files = getGitTrackedFiles()
  const filteredFiles = files.filter(shouldIncludeFile)

  console.log(`Copying ${filteredFiles.length} tracked files to playground/source`)

  for (const file of filteredFiles) {
    const sourcePath = Path.join(root, file)
    const destPath = Path.join(destination, file)
    const destDir = dirname(destPath)

    try {
      // Create directory structure
      await Mkdir.mkdir(destDir)
      // Copy the file
      await Shared.copyFile(sourcePath, destPath)
    } catch (error) {
      // Skip files that can't be copied (might be symlinks or permission issues)
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.debug(`Skipped copying ${file}:`, errorMessage)
    }
  }
}
