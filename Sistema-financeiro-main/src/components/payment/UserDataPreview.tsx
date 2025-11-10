import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Lock, CheckCircle } from 'lucide-react';

interface UserDataPreviewProps {
  userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  };
}

export function UserDataPreview({ userData }: UserDataPreviewProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle>Dados Confirmados</CardTitle>
        <CardDescription>
          Estes dados serão usados para criar sua conta no sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-sm">Nome Completo</p>
              <p className="text-sm text-muted-foreground">{userData.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-sm">Email</p>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
            </div>
          </div>
          
                     <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
             <Phone className="h-5 w-5 text-primary" />
             <div>
               <p className="font-medium text-sm">Telefone</p>
               <p className="text-sm text-muted-foreground">{userData.phone}</p>
             </div>
           </div>
           
           <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
             <Lock className="h-5 w-5 text-primary" />
             <div>
               <p className="font-medium text-sm">Senha</p>
               <p className="text-sm text-muted-foreground">••••••••</p>
             </div>
           </div>
        </div>
        
                 <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
           <p className="text-sm text-blue-700 dark:text-blue-300">
             <strong>Importante:</strong> Sua conta será criada com estes dados. Você poderá fazer login usando seu email e senha após o pagamento.
           </p>
         </div>
      </CardContent>
    </Card>
  );
}
