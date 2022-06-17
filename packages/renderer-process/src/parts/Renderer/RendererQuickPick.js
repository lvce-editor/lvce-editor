export const renderTemplate = () => {
  const label = document.createElement('div')
  label.className = 'QuickPickItemLabel'
  const description = document.createElement('div')
  description.className = 'QuickPickItemDescription'
  const root = document.createElement('li')
  root.className = 'ListItem QuickPickItem'
  root.setAttribute('role', 'option')
  root.append(label, description)
  return {
    root,
    label,
    description,
  }
}

export const renderElement = (template, data, index) => {
  template.label.textContent = data.label
  template.description.textContent = data.description || '~/sample-folder'
  template.root.id = `item-${index}`
  for (const key of Object.keys(template.root.dataset)) {
    delete template.root.dataset[key]
  }
  template.root.dataset.index = index
  for (const [key, value] of Object.entries(data.dataset || {})) {
    template.root.dataset[key] = value
  }
  // template.root.dataset = data.dataset
}
