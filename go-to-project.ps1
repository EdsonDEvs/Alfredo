# Script para navegar para o diretorio do projeto e executar comandos npm
# Uso: .\go-to-project.ps1 [comando]
# Exemplo: .\go-to-project.ps1 "npm run dev"

$projectPath = Join-Path $PSScriptRoot "Sistema-financeiro-main"

if (-not (Test-Path $projectPath)) {
    Write-Host "Erro: Diretorio do projeto nao encontrado: $projectPath" -ForegroundColor Red
    exit 1
}

Set-Location $projectPath

if ($args.Count -gt 0) {
    $command = $args -join " "
    Write-Host "Navegando para: $projectPath" -ForegroundColor Green
    Write-Host "Executando: $command" -ForegroundColor Cyan
    Invoke-Expression $command
} else {
    Write-Host "Navegado para: $projectPath" -ForegroundColor Green
    Write-Host "Dica: Execute 'npm run dev' para iniciar o servidor de desenvolvimento" -ForegroundColor Yellow
}
