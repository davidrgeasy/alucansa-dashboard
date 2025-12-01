'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import { DEMO_USERS } from '@/types/auth';
import { cn } from '@/lib/utils';
import { 
  Factory, 
  Mail, 
  Lock, 
  LogIn, 
  AlertCircle,
  User,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, hasAccessCode } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Verificar acceso y autenticación
  useEffect(() => {
    if (isHydrated) {
      // Si no tiene código de acceso, ir a /acceso
      if (!hasAccessCode) {
        router.push('/acceso');
      } else if (isAuthenticated) {
        // Si ya está autenticado, ir al dashboard
        router.push('/');
      }
    }
  }, [isHydrated, isAuthenticated, hasAccessCode, router]);

  // Mostrar loading mientras se hidrata o redirige
  if (!isHydrated || !hasAccessCode) {
    return (
      <div className="min-h-screen bg-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = login(email, password);
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Error al iniciar sesión');
    }
    
    setIsLoading(false);
  };

  const handleQuickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-900 rounded-2xl mb-4">
            <Factory className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-primary-900">Panel de Mejora</h1>
          <p className="text-slate-500 mt-1">ALUCANSA</p>
        </div>

        {/* Formulario de login */}
        <div className="bg-white rounded-2xl shadow-industrial border border-slate-200 p-8">
          <h2 className="text-lg font-semibold text-primary-900 mb-6">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                    'transition-colors duration-200',
                    error ? 'border-red-300' : 'border-slate-300'
                  )}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={cn(
                    'w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                    'transition-colors duration-200',
                    error ? 'border-red-300' : 'border-slate-300'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Botón submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium',
                'bg-primary-900 text-white hover:bg-primary-800',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'transition-colors duration-200',
                'disabled:opacity-70 disabled:cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>
        </div>

        {/* Usuarios demo */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">
              Usuarios de demostración
            </span>
          </div>
          <div className="space-y-2">
            {DEMO_USERS.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleQuickLogin(user.email, user.password)}
                className={cn(
                  'w-full flex items-center gap-3 p-2 rounded-lg text-left text-sm',
                  'bg-white border border-amber-200 hover:bg-amber-100',
                  'transition-colors duration-200'
                )}
              >
                <User className="w-4 h-4 text-amber-600" />
                <div className="flex-1">
                  <p className="font-medium text-slate-700">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <span className={cn(
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  user.role === 'admin' && 'bg-purple-100 text-purple-700',
                  user.role === 'direccion' && 'bg-blue-100 text-blue-700',
                  user.role === 'usuario' && 'bg-slate-100 text-slate-600'
                )}>
                  {user.role === 'admin' ? 'Admin' : user.role === 'direccion' ? 'Dirección' : 'Usuario'}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-amber-700 mt-3">
            Haz clic en un usuario para rellenar sus credenciales automáticamente.
          </p>
        </div>
      </div>
    </div>
  );
}

