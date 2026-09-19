!include "EnvVarUpdate.nsh" #download http://nsis.sourceforge.net/mediawiki/images/a/ad/EnvVarUpdate.7z

; Prepare an update without uninstalling, closing the editor, or registering a
; second installation. Extract through the official installer so Windows keeps
; its normal installation provenance. The caller supplies a fresh sibling path.
!macro customInit
  Var /GLOBAL lvceStage
  ${GetParameters} $R0
  ClearErrors
  ${GetOptions} $R0 "/LVCESTAGE=" $lvceStage
  IfErrors lvceStageNormal
  StrCmp $lvceStage "" lvceStageFailed
  IfFileExists "$lvceStage" lvceStageFailed
  ClearErrors
  CreateDirectory "$lvceStage"
  IfErrors lvceStageFailed
  InitPluginsDir
  SetOutPath "$lvceStage"
  !ifdef APP_ARM64
    File /oname=$PLUGINSDIR\lvce-stage.7z "${APP_ARM64}"
  !else ifdef APP_64
    File /oname=$PLUGINSDIR\lvce-stage.7z "${APP_64}"
  !else
    !error "Staged updates require x64 or arm64"
  !endif
  ClearErrors
  Nsis7z::Extract "$PLUGINSDIR\lvce-stage.7z"
  IfErrors lvceStageFailed
  IfFileExists "$lvceStage\resources\app\config.json" 0 lvceStageFailed
  IfFileExists "$lvceStage\${APP_EXECUTABLE_FILENAME}" 0 lvceStageFailed
  FileOpen $R0 "$lvceStage\.lvce-stage-complete" w
  FileWrite $R0 "complete"
  FileClose $R0
  IfErrors lvceStageFailed
  SetErrorLevel 0
  Quit
  lvceStageFailed:
  SetErrorLevel 2
  Quit
  lvceStageNormal:
!macroend

!macro customInstall
  !system "echo '' > ${BUILD_RESOURCES_DIR}/customInstall"
  ${EnvVarUpdate} $0 "PATH" "A" "HKCU" "$INSTDIR\bin"
!macroend
