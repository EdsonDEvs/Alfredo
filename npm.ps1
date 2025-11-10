# Wrapper para npm que sempre executa no diretorio correto do projeto
# Uso: .\npm.ps1 [comando npm]
# Exemplo: .\npm.ps1 install
# Exemplo: .\npm.ps1 run dev

$projectPath = Join-Path $PSScriptRoot "Sistema-financeiro-main"

if (-not (Test-Path $projectPath)) {
    Write-Host "Erro: Diretorio do projeto nao encontrado: $projectPath" -ForegroundColor Red
    exit 1
}

$originalLocation = Get-Location
Set-Location $projectPath

try {
    if ($args.Count -eq 0) {
        Write-Host "Executando npm no diretorio: $projectPath" -ForegroundColor Green
        npm.cmd
    } else {
        $command = $args -join " "
        Write-Host "Executando: npm $command" -ForegroundColor Green
        Write-Host "Diretorio: $projectPath" -ForegroundColor Gray
        npm.cmd $args
    }
} finally {
    Set-Location $originalLocation
}
