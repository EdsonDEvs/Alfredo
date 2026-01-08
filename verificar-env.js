// Script para verificar se as variáveis de ambiente estão configuradas corretamente
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 Verificando configuração do .env.local...\n')

const envPath = path.join(__dirname, '.env.local')

// Verificar se o arquivo existe
if (!fs.existsSync(envPath)) {
  console.error('❌ Arquivo .env.local NÃO encontrado!')
  console.log('\n📝 Crie o arquivo .env.local na pasta:', __dirname)
  console.log('📝 Use o arquivo env.example como base\n')
  process.exit(1)
}

console.log('✅ Arquivo .env.local encontrado\n')

// Ler o arquivo
const envContent = fs.readFileSync(envPath, 'utf-8')
const lines = envContent.split('\n')

// Debug: mostrar todas as linhas (não vazias)
console.log('📋 Conteúdo do arquivo .env.local:\n')
let lineCount = 0
lines.forEach((line, index) => {
  const trimmed = line.trim()
  if (trimmed !== '') {
    lineCount++
    const display = line.replace(/\t/g, '  ') // Substituir tabs por espaços para melhor visualização
    console.log(`  Linha ${index + 1}: ${display}`)
  } else {
    console.log(`  Linha ${index + 1}: (vazia)`)
  }
})
console.log(`\n📊 Total de linhas: ${lines.length} (${lineCount} não vazias)\n`)

// Verificar variáveis Pluggy
let hasClientId = false
let hasClientSecret = false
let hasApiKey = false
const errors = []
const foundLines = []

console.log('📋 Verificando variáveis Pluggy:\n')

lines.forEach((line, index) => {
  const trimmedLine = line.trim()
  const originalLine = line
  
  // Ignorar comentários e linhas vazias
  if (trimmedLine.startsWith('#') || trimmedLine === '') {
    return
  }
  
  // Debug: mostrar linhas que contêm PLUGGY
  if (trimmedLine.toUpperCase().includes('PLUGGY')) {
    foundLines.push({ line: index + 1, content: trimmedLine })
  }

  // Verificar VITE_PLUGGY_CLIENT_ID (com regex mais flexível)
  if (trimmedLine.match(/^VITE_PLUGGY_CLIENT_ID\s*=/)) {
    hasClientId = true
    const match = trimmedLine.match(/^VITE_PLUGGY_CLIENT_ID\s*=\s*(.+)$/)
    const value = match ? match[1].trim() : ''
    
    // Remover aspas se houver
    const cleanValue = value.replace(/^["']|["']$/g, '')
    
    if (!cleanValue || cleanValue === '') {
      errors.push(`Linha ${index + 1}: VITE_PLUGGY_CLIENT_ID está vazio`)
    } else if (cleanValue.includes('sua_chave') || cleanValue.includes('SUA_CHAVE') || cleanValue.includes('seu_client_id')) {
      errors.push(`Linha ${index + 1}: VITE_PLUGGY_CLIENT_ID contém valor de exemplo`)
    } else {
      console.log(`  ✅ VITE_PLUGGY_CLIENT_ID encontrado na linha ${index + 1}`)
      console.log(`     Valor: ${cleanValue.substring(0, 20)}...`)
    }
  }

  // Verificar VITE_PLUGGY_CLIENT_SECRET (com regex mais flexível)
  if (trimmedLine.match(/^VITE_PLUGGY_CLIENT_SECRET\s*=/)) {
    hasClientSecret = true
    const match = trimmedLine.match(/^VITE_PLUGGY_CLIENT_SECRET\s*=\s*(.+)$/)
    const value = match ? match[1].trim() : ''
    
    // Remover aspas se houver
    const cleanValue = value.replace(/^["']|["']$/g, '')
    
    if (!cleanValue || cleanValue === '') {
      errors.push(`Linha ${index + 1}: VITE_PLUGGY_CLIENT_SECRET está vazio`)
    } else if (cleanValue.includes('sua_chave') || cleanValue.includes('SUA_CHAVE') || cleanValue.includes('seu_client_secret')) {
      errors.push(`Linha ${index + 1}: VITE_PLUGGY_CLIENT_SECRET contém valor de exemplo`)
    } else {
      console.log(`  ✅ VITE_PLUGGY_CLIENT_SECRET encontrado na linha ${index + 1}`)
      console.log(`     Valor: ${cleanValue.substring(0, 20)}...`)
    }
  }

  // Verificar VITE_PLUGGY_API_KEY (opcional)
  if (trimmedLine.startsWith('VITE_PLUGGY_API_KEY')) {
    hasApiKey = true
    const value = trimmedLine.split('=')[1]?.trim()
    
    if (value && value !== 'pk_test_sua_chave_aqui') {
      console.log(`  ✅ VITE_PLUGGY_API_KEY encontrado (opcional)`)
    }
  }

  // Verificar problemas comuns
  if (trimmedLine.includes('PLUGGY_CLIENT_ID') && !trimmedLine.startsWith('VITE_')) {
    errors.push(`Linha ${index + 1}: Variável sem prefixo VITE_ encontrada: ${trimmedLine.split('=')[0]}`)
  }
  
  if (trimmedLine.includes('PLUGGY_CLIENT_SECRET') && !trimmedLine.startsWith('VITE_')) {
    errors.push(`Linha ${index + 1}: Variável sem prefixo VITE_ encontrada: ${trimmedLine.split('=')[0]}`)
  }

  // Verificar espaços ao redor do =
  if (trimmedLine.includes(' = ') || trimmedLine.startsWith(' ') || trimmedLine.includes('= ')) {
    if (trimmedLine.includes('PLUGGY')) {
      errors.push(`Linha ${index + 1}: Espaços extras detectados: "${trimmedLine}"`)
    }
  }
})

// Mostrar linhas encontradas com PLUGGY
if (foundLines.length > 0) {
  console.log('\n🔍 Linhas encontradas contendo "PLUGGY":\n')
  foundLines.forEach(({ line, content }) => {
    console.log(`  Linha ${line}: ${content}`)
  })
  console.log('')
}

// Resultado final
console.log('\n📊 Resultado:\n')

if (!hasClientId && !hasClientSecret && !hasApiKey) {
  console.error('❌ Nenhuma credencial Pluggy encontrada!')
  
  if (foundLines.length > 0) {
    console.log('\n⚠️  Linhas com "PLUGGY" foram encontradas, mas não foram reconhecidas:')
    foundLines.forEach(({ line, content }) => {
      console.log(`  Linha ${line}: ${content}`)
      
      // Verificar problemas comuns
      if (!content.startsWith('VITE_')) {
        console.log(`    ❌ Problema: Falta prefixo VITE_`)
      }
      if (content.includes(' = ')) {
        console.log(`    ❌ Problema: Espaços ao redor do =`)
      }
      if (!content.includes('=')) {
        console.log(`    ❌ Problema: Falta o sinal =`)
      }
    })
  }
  
  console.log('\n📝 Adicione no .env.local:')
  console.log('   VITE_PLUGGY_CLIENT_ID=seu_client_id')
  console.log('   VITE_PLUGGY_CLIENT_SECRET=seu_client_secret\n')
  process.exit(1)
}

if (!hasClientId) {
  console.error('❌ VITE_PLUGGY_CLIENT_ID não encontrado')
} else if (!hasClientSecret) {
  console.error('❌ VITE_PLUGGY_CLIENT_SECRET não encontrado')
} else {
  console.log('✅ Todas as credenciais Pluggy encontradas!')
}

if (errors.length > 0) {
  console.log('\n⚠️  Problemas encontrados:\n')
  errors.forEach(error => console.error(`  ❌ ${error}`))
  console.log('\n')
  process.exit(1)
}

console.log('\n✅ Configuração parece estar correta!')
console.log('\n💡 Lembre-se:')
console.log('   1. Reinicie o servidor após modificar .env.local')
console.log('   2. Use Ctrl+C para parar e npm run dev para reiniciar\n')

