export const id = 'git'

export const label = 'Git'

export const acceptInputCommand = 'git.commit'

const RE_ONLY_WHITESPACE = /^\s+$/

export const validateInput = (text) => {
  if (RE_ONLY_WHITESPACE.test(text)) {
    return {
      message: 'Current commit message only contains whitespace characters',
      type: 'warning',
    }
  }
  return undefined
}

const vscode = {}

export const activate = () => {
  const sourceControlProvider = vscode.createSourceControlProvider({
    providerId: 'git',
    label: 'Git',
    acceptInput(text) {},
    validateInput,
  })

  const mergeGroup = vscode.createSourceControlResourceGroup({
    providerId: 'git',
    groupId: 'merge',
    label: 'Merge Changes',
  })

  const indexGroup = vscode.createSourceControlResourceGroup({
    providerId: 'git',
    groupId: 'index',
    label: 'Staged Changes',
  })

  const workingTreeGroup = vscode.createSourceControlResourceGroup({
    providerId: 'git',
    groupId: 'workingTree',
    label: 'Untracked Changes',
  })

  const untrackedGroup = vscode.createSourceControlResourceGroup({
    providerId: 'git',
    groupId: 'untracked',
    label: 'Untracked Changes',
  })

  sourceControlProvider.setCount(111)
}

export const deactivate = () => {
  vscode.unregisterSourceControlProvider('git')
}
