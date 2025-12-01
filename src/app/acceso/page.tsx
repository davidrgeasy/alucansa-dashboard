'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import { cn } from '@/lib/utils';
import { 
  Factory, 
  KeyRound, 
  ArrowRight, 
  AlertCircle,
  Lock,
  ShieldCheck
} from 'lucide-react';

// Código de acceso desde variable de entorno
const ACCESS_CODE = process.env.NEXT_PUBLIC_ACCESS_CODE || '0000';

export default function AccessCodePage() {
  const router = useRouter();
  const { hasAccessCode, setAccessCode, isAuthenticated } = useAuth();
  
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Redirigir si ya tiene acceso
  useEffect(() => {
    if (hasAccessCode && isAuthenticated) {
      router.push('/');
    } else if (hasAccessCode) {
      router.push('/login');
    }
  }, [hasAccessCode, isAuthenticated, router]);

  // Focus en el primer input al cargar
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, [inputRefs]);

  const handleInputChange = (index: number, value: string) => {
    // Solo permitir números
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    
    // Si pega múltiples caracteres
    if (value.length > 1) {
      const chars = value.slice(0, 4).split('');
      chars.forEach((char, i) => {
        if (index + i < 4) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);
      const nextIndex = Math.min(index + chars.length, 3);
      inputRefs[nextIndex].current?.focus();
      return;
    }

    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Mover al siguiente input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace: mover al anterior
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    
    // Enter: verificar código
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const enteredCode = code.join('');
    
    if (enteredCode.length !== 4) {
      setError('Introduce el código completo');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simular verificación
    await new Promise(resolve => setTimeout(resolve, 500));

    if (enteredCode === ACCESS_CODE) {
      setAccessCode(true);
      router.push('/login');
    } else {
      setError('Código incorrecto');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setCode(['', '', '', '']);
      inputRefs[0].current?.focus();
    }

    setIsLoading(false);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pastedData) {
      const newCode = pastedData.split('');
      while (newCode.length < 4) newCode.push('');
      setCode(newCode);
      const focusIndex = Math.min(pastedData.length, 3);
      inputRefs[focusIndex].current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-900 rounded-2xl mb-4 shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-primary-900">Acceso Restringido</h1>
          <p className="text-slate-500 mt-2">Panel de Mejora ALUCANSA</p>
        </div>

        {/* Formulario de código */}
        <div className="bg-white rounded-2xl shadow-industrial border border-slate-200 p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3">
              <KeyRound className="w-6 h-6 text-primary-700" />
            </div>
            <h2 className="text-lg font-semibold text-primary-900">
              Código de Acceso
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Introduce el código de 4 dígitos para continuar
            </p>
          </div>

          {/* Inputs de código */}
          <div 
            className={cn(
              'flex justify-center gap-3 mb-6',
              shake && 'animate-shake'
            )}
            onPaste={handlePaste}
          >
            {code.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  'w-14 h-16 text-center text-2xl font-bold border-2 rounded-xl',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  'transition-all duration-200',
                  error ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-slate-50',
                  digit && 'border-primary-400 bg-primary-50'
                )}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center justify-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Botón submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || code.some(d => !d)}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium',
              'bg-primary-900 text-white hover:bg-primary-800',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                Acceder
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="w-4 h-4" />
            <span>Contenido protegido</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Si no dispones del código de acceso, contacta con el administrador.
          </p>
        </div>
      </div>

      {/* Animación de shake */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

