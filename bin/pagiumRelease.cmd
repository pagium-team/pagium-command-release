@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\pagium-command-release" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\pagium-command-release" %*
)