declare const Main: {
  /**
   * Open a file.
   * @param uri The file to be opened
   */
  readonly openUri: (uri: string) => Promise<void>
  /**
   * Focus the previous tab.
   */
  readonly focusPreviousTab: () => Promise<void>
  /**
   * Focus the next tab.
   */
  readonly focusNextTab: () => Promise<void>
  /**
   * Close the other tabs.
   */
  readonly closeOtherTabs: () => Promise<void>
}
