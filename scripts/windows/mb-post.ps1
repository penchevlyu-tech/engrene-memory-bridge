[CmdletBinding()]
param(
  [string]$Tool = "codex",
  [Parameter(Mandatory = $true)][string]$Intent,
  [Parameter(Mandatory = $true)][string]$Summary,
  [string]$Actions = "",
  [string]$Artifacts = "",
  [string]$Tags = "",
  [string]$Workspace = ""
)

$logArgs = @(
  "log",
  "--tool", $Tool,
  "--intent", $Intent,
  "--summary", $Summary
)

if ($Actions -ne "") {
  $logArgs += @("--actions", $Actions)
}
if ($Artifacts -ne "") {
  $logArgs += @("--artifacts", $Artifacts)
}
if ($Tags -ne "") {
  $logArgs += @("--tags", $Tags)
}
if ($Workspace -ne "") {
  $logArgs += @("--workspace", $Workspace)
}

& memory-bridge @logArgs
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

$handoffArgs = @("handoff", "build")
if ($Workspace -ne "") {
  $handoffArgs += @("--workspace", $Workspace)
}

& memory-bridge @handoffArgs
exit $LASTEXITCODE

