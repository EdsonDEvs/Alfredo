# Script PowerShell para verificar .env.local
Write-Host "🔍 Verificando arquivo .env.local...`n" -ForegroundColor Cyan

$envPath = Join-Path $PSScriptRoot ".env.local"

if (-not (Test-Path $envPath)) {
    Write-Host "❌ Arquivo .env.local NÃO encontrado!" -ForegroundColor Red
    Write-Host "📝 Crie o arquivo na pasta: $PSScriptRoot`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Arquivo encontrado: $envPath`n" -ForegroundColor Green

# Ler o arquivo
$content = Get-Content $envPath -Raw
$lines = Get-Content $envPath

Write-Host "📋 Conteúdo do arquivo:`n" -ForegroundColor Cyan
$lines | ForEach-Object -Begin { $i = 1 } -Process {
    if ($_.Trim() -ne '') {
        Write-Host "  Linha $i : $_" -ForegroundColor White
    }
    $i++
}
Write-Host ""

# Verificar variáveis Pluggy
$hasClientId = $false
$hasClientSecret = $false
$pluggyLines = @()

$lines | ForEach-Object {
    $line = $_.Trim()
    
    if ($line -match 'PLUGGY') {
        $pluggyLines += $line
    }
    
    if ($line -match '^VITE_PLUGGY_CLIENT_ID\s*=') {
        $hasClientId = $true
        $value = ($line -split '=', 2)[1].Trim()
        if ($value -and $value -ne '' -and $value -notmatch 'sua_chave|SUA_CHAVE') {
            Write-Host "  ✅ VITE_PLUGGY_CLIENT_ID encontrado: $($value.Substring(0, [Math]::Min(20, $value.Length)))..." -ForegroundColor Green
        }
    }
    
    if ($line -match '^VITE_PLUGGY_CLIENT_SECRET\s*=') {
        $hasClientSecret = $true
        $value = ($line -split '=', 2)[1].Trim()
        if ($value -and $value -ne '' -and $value -notmatch 'sua_chave|SUA_CHAVE') {
            Write-Host "  ✅ VITE_PLUGGY_CLIENT_SECRET encontrado: $($value.Substring(0, [Math]::Min(20, $value.Length)))..." -ForegroundColor Green
        }
    }
}

Write-Host "`n📊 Resultado:`n" -ForegroundColor Cyan

if ($pluggyLines.Count -gt 0) {
    Write-Host "🔍 Linhas contendo 'PLUGGY':`n" -ForegroundColor Yellow
    $pluggyLines | ForEach-Object {
        Write-Host "  $_" -ForegroundColor White
        if ($_ -notmatch '^VITE_') {
            Write-Host "    ❌ Problema: Falta prefixo VITE_" -ForegroundColor Red
        }
        if ($_ -match '\s+=\s+') {
            Write-Host "    ❌ Problema: Espaços ao redor do =" -ForegroundColor Red
        }
    }
    Write-Host ""
}

if ($hasClientId -and $hasClientSecret) {
    Write-Host "✅ Todas as credenciais Pluggy encontradas!`n" -ForegroundColor Green
    Write-Host "💡 Lembre-se de reiniciar o servidor (Ctrl+C e depois npm run dev)`n" -ForegroundColor Yellow
} else {
    Write-Host "❌ Credenciais não encontradas ou incompletas!`n" -ForegroundColor Red
    if (-not $hasClientId) {
        Write-Host "  ❌ VITE_PLUGGY_CLIENT_ID não encontrado" -ForegroundColor Red
    }
    if (-not $hasClientSecret) {
        Write-Host "  ❌ VITE_PLUGGY_CLIENT_SECRET não encontrado" -ForegroundColor Red
    }
    Write-Host "`n📝 Adicione no .env.local:`n" -ForegroundColor Yellow
    Write-Host "   VITE_PLUGGY_CLIENT_ID=seu_client_id" -ForegroundColor White
    Write-Host "   VITE_PLUGGY_CLIENT_SECRET=seu_client_secret`n" -ForegroundColor White
    exit 1
}




