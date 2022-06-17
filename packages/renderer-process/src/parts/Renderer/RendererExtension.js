// TODO this is business logic and does not belong to ui logic
const manage = async (event) => {
  const $Target = event.target
  const $Extension = $Target.parentNode
  const extensionId = $Extension.dataset.id
  if (!extensionId) {
    return
  }
  if ($Target.dataset.type === 'install') {
    $Target.textContent = 'installing'
    // TODO delay should be in renderer worker
    // await minDelay(
    //   new Promise((resolve) => {
    //     const callbackId = Callback.register(resolve)
    //     // SharedProcess.send([
    //     //   /* ExtensionManagement.install */ 511,
    //     //   /* callbackId */ callbackId,
    //     //   /* extensionId */ extensionId,
    //     // ])
    //   })
    // )
    $Target.dataset.type = 'uninstall'
    $Target.textContent = 'uninstall'
  } else {
    $Target.textContent = 'uninstalling'
    // TODO delay should be in renderer worker
    // await minDelay(
    //   new Promise((resolve) => {
    //     const callbackId = Callback.register(resolve)
    //     // SharedProcess.send([
    //     //   /* ExtensionManagement.uninstall */ 512,
    //     //   /* callbackId */ callbackId,
    //     //   /* extensionId */ extensionId,
    //     // ])
    //   })
    // )
    $Target.dataset.type = 'install'
    $Target.textContent = 'install'
  }
}

export const renderTemplate = () => {
  const name = document.createElement('div')
  name.className = 'ExtensionName'
  const author = document.createElement('div')
  author.className = 'ExtensionAuthorName'
  const description = document.createElement('div')
  description.className = 'ExtensionDescription'
  const icon = document.createElement('img')
  icon.className = 'ExtensionIcon'
  const buttonManage = document.createElement('button')
  buttonManage.className = 'ExtensionManage'
  buttonManage.onclick = manage
  const root = document.createElement('div')
  root.className = 'Extension'
  root.append(name, author, description, icon, buttonManage)
  return {
    root,
    name,
    description,
    author,
    icon,
    buttonManage,
  }
}

export const renderElement = (template, data, index) => {
  template.root.dataset.id = data.id
  template.name.textContent = data.displayName || data.name
  template.author.textContent = data.publisherDisplayName
  template.description.textContent = data.description
  template.icon.src = data.icon
  template.buttonManage.dataset.type = data.installed ? 'uninstall' : 'install'
  template.buttonManage.textContent = data.installed ? 'uninstall' : 'install'
}
