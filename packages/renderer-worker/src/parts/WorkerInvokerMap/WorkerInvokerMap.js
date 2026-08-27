import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'
import * as ActivityBarWorker from '../ActivityBarWorker/ActivityBarWorker.js'
import * as ChatDebugViewWorker from '../ChatDebugViewWorker/ChatDebugViewWorker.js'
import * as ChatViewWorker from '../ChatViewWorker/ChatViewWorker.js'
import * as DialogWorker from '../DialogWorker/DialogWorker.js'
import * as DiffViewWorker from '../DiffViewWorker/DiffViewWorker.js'
import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'
import * as ExtensionDetailViewWorker from '../ExtensionDetailViewWorker/ExtensionDetailViewWorker.js'
import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'
import * as IframeInspectorWorker from '../IframeInspectorWorker/IframeInspectorWorker.js'
import * as KeyBindingsViewWorker from '../KeyBindingsViewWorker/KeyBindingsViewWorker.js'
import * as LanguageModelsViewWorker from '../LanguageModelsViewWorker/LanguageModelsViewWorker.js'
import * as MainAreaWorker from '../MainAreaWorker/MainAreaWorker.js'
import * as NotificationCenterViewWorker from '../NotificationCenterViewWorker/NotificationCenterViewWorker.js'
import * as OutputViewWorker from '../OutputViewWorker/OutputViewWorker.js'
import * as PanelWorker from '../PanelWorker/PanelWorker.js'
import * as PreviewWorker from '../PreviewWorker/PreviewWorker.js'
import * as ProblemsWorker from '../ProblemsWorker/ProblemsWorker.ts'
import * as ProcessExplorerWorker from '../ProcessExplorerWorker/ProcessExplorerWorker.js'
import * as QuickPickWorker from '../QuickPickWorker/QuickPickWorker.js'
import * as RunningExtensionsViewWorker from '../RunningExtensionsViewWorker/RunningExtensionsViewWorker.ts'
import * as SecretsViewWorker from '../SecretsViewWorker/SecretsViewWorker.ts'
import * as SettingsViewWorker from '../SettingsViewWorker/SettingsViewWorker.js'
import * as StatusBarWorker from '../StatusBarWorker/StatusBarWorker.js'
import * as TextSearchViewWorker from '../TextSearchViewWorker/TextSearchViewWorker.js'
import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'

const workerInvokers = {
  aboutWorker: AboutViewWorker,
  activityBar: ActivityBarWorker,
  chatDebug: ChatDebugViewWorker,
  chatView: ChatViewWorker,
  dialogWorker: DialogWorker,
  diffView: DiffViewWorker,
  explorer: ExplorerViewWorker,
  extensionDetail: ExtensionDetailViewWorker,
  extensionSearch: ExtensionSearchViewWorker,
  iframeInspector: IframeInspectorWorker,
  keyBindings: KeyBindingsViewWorker,
  languageModels: LanguageModelsViewWorker,
  mainArea: MainAreaWorker,
  notificationCenterView: NotificationCenterViewWorker,
  output: OutputViewWorker,
  panel: PanelWorker,
  preview: PreviewWorker,
  problemsViewWorker: ProblemsWorker,
  processExplorer: ProcessExplorerWorker,
  quickPickWorker: QuickPickWorker,
  runningExtensionsView: RunningExtensionsViewWorker,
  secretsView: SecretsViewWorker,
  settingsView: SettingsViewWorker,
  statusBar: StatusBarWorker,
  textSearchView: TextSearchViewWorker,
  titleBar: TitleBarWorker,
}

export const getWorkerInvoker = (workerId) => {
  const worker = workerInvokers[workerId]
  if (!worker) {
    throw new Error(`worker invoker not found: ${workerId}`)
  }
  return worker
}
