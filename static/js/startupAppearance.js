try {
  const savedLayout = JSON.parse(localStorage.getItem('Layout') || 'null')
  if (savedLayout?.aiNativeLayout === true) {
    let settings
    try {
      settings = JSON.parse(localStorage.getItem('settings') || 'null')
    } catch {
      settings = null
    }
    const root = document.documentElement
    root.classList.add('AiNativeLayoutStartup')
    const isClaudeTheme = settings?.['chat2.aiNativeTheme'] === 'claude'
    if (isClaudeTheme) {
      root.classList.add('AiNativeLayoutStartupClaude')
    }
    const observer = new MutationObserver(() => {
      if (document.querySelector('.Workbench.AiNativeLayout')) {
        root.classList.remove('AiNativeLayoutStartup', 'AiNativeLayoutStartupClaude')
        observer.disconnect()
      }
    })
    observer.observe(document, { attributes: true, childList: true, subtree: true, attributeFilter: ['class'] })
  }
} catch {
  // Storage can be unavailable in restricted browser contexts.
}
