[CmdletBinding()]
param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$CliArgs
)

$packageRef = "git+https://github.com/leninejunior/engrene-memory-bridge.git"
$argsList = @("--yes", "--package=$packageRef", "memory-bridge")

if ($null -eq $CliArgs -or $CliArgs.Count -eq 0) {
  $argsList += @("--help")
} else {
  $argsList += $CliArgs
}

& npx @argsList
exit $LASTEXITCODE

