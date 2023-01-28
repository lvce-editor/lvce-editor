!include "EnvVarUpdate.nsh" #download http://nsis.sourceforge.net/mediawiki/images/a/ad/EnvVarUpdate.7z

!macro customInstall
  !system "echo '' > ${BUILD_RESOURCES_DIR}/customInstall"
  ${EnvVarUpdate} $0 "PATH" "A" "HKCU" "$INSTDIR\bin"
!macroend