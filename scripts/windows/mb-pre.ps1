[CmdletBinding()]
param(
  [string]$Tool = "codex",
  [string]$Workspace = ""
)

$argsList = @("resume", "--for", $Tool)
if ($Workspace -ne "") {
  $argsList += @("--workspace", $Workspace)
}

& memory-bridge @argsList
exit $LASTEXITCODE

