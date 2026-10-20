export const name = 'viewlet.editor-toggle-comment-html'
export const originalText = `<script type="module">
  const value = 1
  console.log(value)
</script>
<style>
  body { color: red }
</style>
<div>content</div>`

export const test = async ({ FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.html`, originalText)
  await Workspace.setUri(tmpDir)
  await Main.openUri(`${tmpDir}/file.html`)
}
