export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Não informado'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  } catch {
    return 'Data inválida'
  }
}

export const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return 'Não informado'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Data inválida'
  }
}

export const formatTime = (dateString: string | null): string => {
  if (!dateString) return 'Não informado'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Hora inválida'
  }
}

export const formatRelativeTime = (dateString: string | null): string => {
  if (!dateString) return 'Não informado'
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInMinutes < 1) return 'Agora mesmo'
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`
    if (diffInHours < 24) return `${diffInHours}h atrás`
    if (diffInDays < 7) return `${diffInDays} dias atrás`
    
    return formatDate(dateString)
  } catch {
    return 'Data inválida'
  }
}

export const formatDateWithDay = (dateString: string | null): string => {
  if (!dateString) return 'Não informado'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return 'Data inválida'
  }
}
