const State = {
  Top: 1,
  AfterSwitchStart: 2,
  AfterSwitchEnd: 3,
}

const firstLineNoIpcPostFix = (moduleId) => {
  return `import * as ${moduleId} from '../${moduleId}/${moduleId}.js'`
}

const firstLineIpcPostFix = (moduleId) => {
  return `import * as ${moduleId} from '../${moduleId}/${moduleId}.ipc.js'`
}

export const getNewModuleCode = (
  moduleCode,
  eagerlyLoadedModules,
  ipcPostFix,
  viewlet
) => {
  const lines = moduleCode.split('\n')
  const firstLine = ipcPostFix ? firstLineIpcPostFix : firstLineNoIpcPostFix
  const newLines = eagerlyLoadedModules.map(firstLine)
  let state = State.Top
  let moduleId = ''
  for (const line of lines) {
    switch (state) {
      case State.Top:
        newLines.push(line)
        if (line.trim().startsWith('switch')) {
          state = State.AfterSwitchStart
        }
        break
      case State.AfterSwitchStart:
        if (viewlet && line.trim().startsWith('case ViewletModuleId.')) {
          newLines.push(line)
          moduleId =
            'Viewlet' + line.slice('    case ViewletModuleId.'.length, -1)
        } else if (line.trim().startsWith('case ModuleId.')) {
          newLines.push(line)
          moduleId = line.slice('    case ModuleId.'.length, -1)
        } else if (line.trim().startsWith('return import')) {
          if (eagerlyLoadedModules.includes(moduleId)) {
            newLines.push(`      return ${moduleId}`)
          } else {
            newLines.push(line)
          }
        } else {
          newLines.push(line)
        }
        break
      default:
        newLines.push(line)
        break
    }
  }
  return newLines.join('\n')
}
