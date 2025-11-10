
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <header className="h-16 flex items-center justify-between px-6 bg-card border-b shadow-sm sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/d58baa4c-1273-42fb-83d0-950387ad313b.png" 
                  alt="ALFREDO" 
                  className="h-8 w-auto" 
                />
                <h1 className="text-lg font-semibold title-color hidden sm:block">
                  ALFREDO - Seu Assistente Financeiro
                </h1>
              </div>
            </div>
            <ThemeToggle />
          </header>
          <div className="flex-1 p-6 bg-background">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
