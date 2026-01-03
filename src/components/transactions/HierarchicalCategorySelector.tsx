import React, { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TransacoesService } from '@/services/transacoes'
import { Categoria } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface HierarchicalCategorySelectorProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function HierarchicalCategorySelector({
  value,
  onValueChange,
  placeholder = "Selecione a categoria",
  className = ""
}: HierarchicalCategorySelectorProps) {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      loadCategories()
    }
  }, [user?.id])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await TransacoesService.getCategorias(user!.id)
      setCategories(data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryDisplayName = (category: Categoria) => {
    return `${category.icon || ''} ${category.nome}`
  }

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger className={className}>
          <SelectValue placeholder="Carregando categorias..." />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {categories.map((mainCategory) => (
          <div key={mainCategory.id}>
            <SelectItem
              value={mainCategory.id}
              className="font-semibold text-primary"
            >
              {getCategoryDisplayName(mainCategory)}
            </SelectItem>

            {mainCategory.subcategorias?.map((subCategory) => (
              <SelectItem
                key={subCategory.id}
                value={subCategory.id}
                className="ml-4 text-sm"
              >
                {getCategoryDisplayName(subCategory)}
              </SelectItem>
            ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  )
}
