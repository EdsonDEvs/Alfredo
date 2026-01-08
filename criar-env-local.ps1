# Script para criar/corrigir o arquivo .env.local
# Execute: powershell -ExecutionPolicy Bypass -File criar-env-local.ps1

Write-Host "🔧 Criando/Corrigindo arquivo .env.local...`n" -ForegroundColor Cyan

$envPath = Join-Path $PSScriptRoot ".env.local"

# Verificar se já existe
if (Test-Path $envPath) {
    Write-Host "⚠️  Arquivo .env.local já existe!" -ForegroundColor Yellow
    $backup = "$envPath.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Copy-Item $envPath $backup
    Write-Host "📋 Backup criado: $backup`n" -ForegroundColor Gray
}

# Solicitar credenciais ao usuário
Write-Host "📝 Por favor, informe suas credenciais:`n" -ForegroundColor Yellow

$supabaseUrl = Read-Host "VITE_SUPABASE_URL [Enter para usar padrão]"
if ([string]::IsNullOrWhiteSpace($supabaseUrl)) {
    $supabaseUrl = "https://qgyjfzsihoxtrvrheqvc.supabase.co"
}

$supabaseKey = Read-Host "VITE_SUPABASE_ANON_KEY [Enter para manter valor existente]"
if ([string]::IsNullOrWhiteSpace($supabaseKey) -and (Test-Path $envPath)) {
    # Tentar ler do arquivo existente
    $existing = Get-Content $envPath -Raw
    if ($existing -match "VITE_SUPABASE_ANON_KEY=(.+)") {
        $supabaseKey = $matches[1].Trim()
        Write-Host "   Usando valor existente" -ForegroundColor Gray
    }
}
if ([string]::IsNullOrWhiteSpace($supabaseKey)) {
    $supabaseKey = "SUBSTITUA_PELA_CHAVE_ANONIMA_DO_SEU_PROJETO"
}

Write-Host "`n🔑 Credenciais Pluggy (obtenha em: https://dashboard.pluggy.ai/applications):" -ForegroundColor Yellow
$pluggyClientId = Read-Host "VITE_PLUGGY_CLIENT_ID"
$pluggyClientSecret = Read-Host "VITE_PLUGGY_CLIENT_SECRET"

if ([string]::IsNullOrWhiteSpace($pluggyClientId)) {
    Write-Host "⚠️  CLIENT_ID não informado, continuando sem Pluggy" -ForegroundColor Yellow
}

# Criar conteúdo do arquivo
$content = @"
# Supabase Configuration
VITE_SUPABASE_URL=$supabaseUrl
VITE_SUPABASE_ANON_KEY=$supabaseKey

# Pluggy Open Finance
# Obtenha suas credenciais em: https://dashboard.pluggy.ai/applications
"@

if (-not [string]::IsNullOrWhiteSpace($pluggyClientId)) {
    $content += @"

VITE_PLUGGY_CLIENT_ID=$pluggyClientId
VITE_PLUGGY_CLIENT_SECRET=$pluggyClientSecret
"@
} else {
    $content += @"

# VITE_PLUGGY_CLIENT_ID=seu_client_id_aqui
# VITE_PLUGGY_CLIENT_SECRET=seu_client_secret_aqui
"@
}

$content += @"

# App Configuration
VITE_APP_NAME=Poupe Agora
VITE_APP_VERSION=1.0.0
"@

# Salvar arquivo
$content | Out-File -FilePath $envPath -Encoding UTF8 -NoNewline

Write-Host "`n✅ Arquivo .env.local criado/atualizado com sucesso!`n" -ForegroundColor Green
Write-Host "📂 Localização: $envPath`n" -ForegroundColor Gray

# Verificar se foi salvo corretamente
$verify = Get-Content $envPath -Raw
$lines = ($verify -split "`n").Count
Write-Host "📊 Linhas no arquivo: $lines" -ForegroundColor Gray

if ($verify -match "VITE_PLUGGY_CLIENT_ID") {
    Write-Host "✅ VITE_PLUGGY_CLIENT_ID encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  VITE_PLUGGY_CLIENT_ID não encontrado" -ForegroundColor Yellow
}

if ($verify -match "VITE_PLUGGY_CLIENT_SECRET") {
    Write-Host "✅ VITE_PLUGGY_CLIENT_SECRET encontrado`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  VITE_PLUGGY_CLIENT_SECRET não encontrado`n" -ForegroundColor Yellow
}

Write-Host "💡 Próximos passos:`n" -ForegroundColor Cyan
Write-Host "   1. Verifique o arquivo .env.local" -ForegroundColor White
Write-Host "   2. Reinicie o servidor: npm run dev" -ForegroundColor White
Write-Host "   3. Teste a conexão Pluggy no Dashboard`n" -ForegroundColor White

