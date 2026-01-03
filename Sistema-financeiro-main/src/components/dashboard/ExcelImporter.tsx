import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Upload, FileSpreadsheet, Download, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { readExcelFile, createExcelTemplate, type ParsedTransaction } from '@/services/excelImporter'
import { TransacoesService } from '@/services/transacoes'
import { useAuth } from '@/hooks/useAuth'
import { notifyTransacoesUpdate } from '@/hooks/useTransacoesSync'
import { toast } from '@/hooks/use-toast'

interface ExcelImporterProps {
  onImportComplete?: () => void
}

export function ExcelImporter({ onImportComplete }: ExcelImporterProps) {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [importResult, setImportResult] = useState<{
    success: number
    errors: string[]
    total: number
  } | null>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar extensão
    const validExtensions = ['.xlsx', '.xls', '.csv']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!validExtensions.includes(fileExtension)) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo Excel (.xlsx, .xls) ou CSV",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    setProgress(0)
    setImportResult(null)

    try {
      // Ler e processar arquivo
      setProgress(20)
      const transactions = await readExcelFile(file)
      
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      setProgress(40)

      // Importar transações (category_id será tratado pelo serviço)
      const result = await TransacoesService.importTransacoes(
        user.id,
        transactions.map(t => ({
          ...t,
          userid: user.id,
          // category_id será tratado pelo serviço (não enviar string vazia)
        }))
      )

      setProgress(100)

      setImportResult({
        success: result.success,
        errors: result.errors,
        total: transactions.length,
      })

      if (result.success > 0) {
        toast({
          title: "Importação concluída",
          description: `${result.success} transação(ões) importada(s) com sucesso!`,
        })
        
        // Notificar todas as páginas sobre a atualização
        notifyTransacoesUpdate()
        
        // Chamar callback para atualizar lista
        if (onImportComplete) {
          onImportComplete()
        }
      }

      if (result.errors.length > 0) {
        toast({
          title: "Aviso",
          description: `${result.errors.length} erro(s) durante a importação`,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error('Erro ao importar planilha:', error)
      toast({
        title: "Erro ao importar",
        description: error.message || "Ocorreu um erro ao processar a planilha",
        variant: "destructive",
      })
      setImportResult({
        success: 0,
        errors: [error.message || 'Erro desconhecido'],
        total: 0,
      })
    } finally {
      setIsImporting(false)
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDownloadTemplate = () => {
    createExcelTemplate()
    toast({
      title: "Template baixado",
      description: "O arquivo template_transacoes.xlsx foi baixado",
    })
  }

  const handleClose = () => {
    setIsOpen(false)
    setImportResult(null)
    setProgress(0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Importar Planilha
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Transações do Excel
          </DialogTitle>
          <DialogDescription>
            Importe suas transações de uma planilha Excel ou CSV. O sistema aceita qualquer formato e detecta automaticamente as colunas analisando o conteúdo dos dados!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Botão de download do template */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Template de Planilha</CardTitle>
            <CardDescription>
              Baixe o template como exemplo (opcional). O sistema aceita qualquer formato!
            </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                className="w-full gap-2"
                disabled={isImporting}
              >
                <Download className="h-4 w-4" />
                Baixar Template
              </Button>
            </CardContent>
          </Card>

          {/* Upload de arquivo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Selecionar Arquivo</CardTitle>
              <CardDescription>
                Selecione um arquivo Excel (.xlsx, .xls) ou CSV com suas transações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isImporting}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="w-full gap-2"
              >
                <Upload className="h-4 w-4" />
                {isImporting ? 'Importando...' : 'Selecionar Arquivo'}
              </Button>

              {/* Progress bar */}
              {isImporting && (
                <div className="mt-4 space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-muted-foreground">
                    Processando... {progress}%
                  </p>
                </div>
              )}

              {/* Resultado da importação */}
              {importResult && !isImporting && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {importResult.success > 0 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>
                      {importResult.success} de {importResult.total} transação(ões) importada(s)
                    </span>
                  </div>

                  {importResult.errors.length > 0 && (
                    <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                      <div className="flex items-center gap-2 text-sm font-medium text-red-600 mb-2">
                        <AlertCircle className="h-4 w-4" />
                        Erros encontrados:
                      </div>
                      <ul className="text-xs text-red-600 space-y-1">
                        {importResult.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <p className="text-xs text-blue-600">
                      <strong>✨ Sistema Inteligente:</strong> Aceita qualquer formato de planilha! O sistema detecta automaticamente as colunas analisando o conteúdo.
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      <strong>Colunas necessárias:</strong> Data (DD/MM/YYYY, YYYY-MM-DD, ou qualquer formato), Estabelecimento (qualquer nome), Valor (R$, $, € ou número)
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      <strong>Colunas opcionais:</strong> Tipo (Receita/Despesa ou detectado automaticamente), Detalhes (observações)
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      <strong>Formatos aceitos:</strong> Excel (.xlsx, .xls) ou CSV. O sistema identifica automaticamente datas, valores monetários e tipos de transação.
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      <strong>Exemplos de nomes aceitos:</strong> Data/Date/Dia, Estabelecimento/Local/Loja/Descrição/Onde, Valor/Amount/Preço/R$/Total, Tipo/Type/Categoria
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botão de fechar */}
          <div className="flex justify-end">
            <Button onClick={handleClose} variant="outline">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

