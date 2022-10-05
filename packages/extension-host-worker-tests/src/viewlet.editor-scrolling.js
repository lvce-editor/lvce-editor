test('viewlet.editor-scrolling', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.json`,
    `{
  "annotations": {
    "list": [
      {
        "builtIn": 1,
        "datasource": "-- Grafana --",
        "enable": true,
        "hide": true,
        "iconColor": "rgba(0, 211, 255, 1)",
        "limit": 100,
        "name": "Annotations & Alerts",
        "showIn": 0,
        "type": "dashboard"
      },
      {
        "datasource": null,
        "enable": true,
        "expr": "resets(process_uptime_seconds{application=\\"$application\\", instance=\\"$instance\\"}[1m]) > 0",
        "iconColor": "rgba(255, 96, 96, 1)",
        "name": "Restart Detection",
        "showIn": 0,
        "step": "1m",
        "tagKeys": "restart-tag",
        "textFormat": "uptime reset",
        "titleFormat": "Restart"
      }
    ]
  },
  "description": "Che Server JVM",
  "editable": true
}
` + '\n'.repeat(50)
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.json`)

  // assert
  const descriptionToken = Locator('.Token', { hasText: 'description' })
  await expect(descriptionToken).toHaveClass('JsonPropertyName')

  // act
  await Editor.setDeltaY(40)
  await expect(descriptionToken).toHaveClass('JsonPropertyName')
})
