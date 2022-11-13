declare const KeyBoard: {
  /**
   * @deprecated this can lead to flaky tests, it might
   * be better execute the corresponding command instead
   *
   */
  readonly press: (key: string) => Promise<void>
}
