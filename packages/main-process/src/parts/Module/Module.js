const ModuleId = require('../ModuleId/ModuleId.js')

// prettier-ignore
exports.load = async (moduleId) => {
  switch (moduleId) {
    case ModuleId.App: return require('../App/App.ipc.js')
    case ModuleId.AppWindow: return require('../AppWindow/AppWindow.ipc.js')
    case ModuleId.Beep: return require('../ElectronBeep/ElectronBeep.js')
    case ModuleId.Developer: return require('../ElectronDeveloper/ElectronDeveloper.ipc.js')
    case ModuleId.Dialog: return require('../ElectronDialog/ElectronDialog.ipc.js')
    case ModuleId.ElectronWindowAbout: return require('../ElectronWindowAbout/ElectronWindowAbout.ipc.js')
    case ModuleId.ElectronWindowProcessExplorer: return require('../ElectronWindowProcessExplorer/ElectronWindowProcessExplorer.ipc.js')
    case ModuleId.Window: return require('../ElectronWindow/ElectronWindow.ipc.js')
    default: throw new Error('unknown module')
  }
}
