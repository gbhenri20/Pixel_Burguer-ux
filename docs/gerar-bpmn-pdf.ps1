# Gera PDF do BPMN (Pixel Burguer)
# Requer Microsoft Edge instalado.
# Uso: clique com o botão direito > Executar com PowerShell
#  ou: powershell -ExecutionPolicy Bypass -File .\gerar-bpmn-pdf.ps1

$ErrorActionPreference = "Stop"
$docs = $PSScriptRoot
$html = Join-Path $docs "BPMN.html"
$pdf  = Join-Path $docs "BPMN-Pixel-Burguer.pdf"

if (-not (Test-Path $html)) {
  Write-Error "Arquivo nao encontrado: $html"
}

$edgeCandidates = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe"
)
$edge = $edgeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $edge) {
  Write-Host "Edge nao encontrado. Abrindo o HTML no navegador padrao..."
  Write-Host "Use Ctrl+P > 'Salvar como PDF' / 'Microsoft Print to PDF'."
  Start-Process $html
  exit 0
}

$uri = ([Uri]$html).AbsoluteUri
Write-Host "Gerando PDF com Edge..."
Write-Host "  HTML: $html"
Write-Host "  PDF:  $pdf"

& $edge --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$pdf" $uri

if (Test-Path $pdf) {
  Write-Host "OK: $pdf"
  Start-Process $pdf
} else {
  Write-Host "Falha ao gerar PDF. Abrindo HTML para impressao manual (Ctrl+P)."
  Start-Process $html
}
