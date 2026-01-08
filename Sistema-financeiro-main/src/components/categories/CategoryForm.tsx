
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCategories, Category } from '@/hooks/useCategories';

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CategoryForm({ category, onClose, onSuccess }: CategoryFormProps) {
  const [nome, setNome] = useState('');
  const [tags, setTags] = useState('');
  const { createCategory, updateCategory, isCreating, isUpdating } = useCategories();

  useEffect(() => {
    if (category) {
      setNome(category.nome);
      setTags(category.tags || '');
    } else {
      setNome('');
      setTags('');
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) return;

    try {
      let result;
      if (category) {
        result = await updateCategory({
          id: category.id,
          updates: { nome: nome.trim(), tags: tags.trim() },
        });
      } else {
        result = await createCategory({
          nome: nome.trim(),
          tags: tags.trim(),
        });
      }

      // Se a operação foi bem-sucedida, chamar callback de sucesso
      if (result) {
        onSuccess?.();
      }
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    }
  };

  const handleClose = () => {
    // Limpar formulário ao fechar
    setNome('');
    setTags('');
    onClose();
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Categoria *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Alimentação"
              required
              disabled={isCreating || isUpdating}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (opcional)</Label>
            <Textarea
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ex: Restaurantes, Supermercados, Cafés"
              rows={3}
              disabled={isCreating || isUpdating}
            />
            <p className="text-xs text-muted-foreground">
              Separe as tags com vírgulas para melhor organização
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isCreating || isUpdating}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!nome.trim() || isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {category ? 'Atualizando...' : 'Criando...'}
                </>
              ) : (
                category ? 'Atualizar' : 'Criar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
