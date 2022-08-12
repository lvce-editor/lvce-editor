class TreeView {
  constructor(props) {
    this.props = props
    this.$Viewlet = document.createElement('div')
    this.$Viewlet.className = 'ListItems Viewlet'
    this.$Viewlet.tabIndex = 0
    this.$Viewlet.dataset.viewletId = 'Explorer'
    // @ts-ignore
    this.$Viewlet.role = 'tree'
    this.$Viewlet.addEventListener('keydown', this.handleKeyDown.bind(this))
    this.$Viewlet.addEventListener('mousedown', this.handleMouseDown.bind(this))
    this.$Viewlet.addEventListener(
      'contextmenu',
      this.handleContextMenu.bind(this)
    )
  }

  handleKeyDown() {}

  handleMouseDown() {
    const index = -1
    this.props.handleClick(index)
  }

  handleContextMenu() {
    const index = -1
    this.props.handleContextMenu(index)
  }
}

export const createTreeView = () => new TreeView()
