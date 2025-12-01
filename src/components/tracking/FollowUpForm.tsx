'use client';

import { useState } from 'react';
import { FollowUpType, FOLLOWUP_TYPE_CONFIG } from '@/types/tracking';
import { useCanEdit } from '@/store/useAuth';
import { ReadOnlyBadge } from '@/components/auth';
import { cn } from '@/lib/utils';
import { 
  Send, 
  FileText, 
  RefreshCw, 
  AlertOctagon, 
  CheckSquare, 
  GitBranch,
  Flag,
  Lock
} from 'lucide-react';

interface FollowUpFormProps {
  onSubmit: (data: { type: FollowUpType; content: string; author: string }) => void;
  defaultAuthor?: string;
  className?: string;
}

const TYPE_ICONS: Record<FollowUpType, React.ReactNode> = {
  nota: <FileText className="w-4 h-4" />,
  actualizacion: <RefreshCw className="w-4 h-4" />,
  bloqueo: <AlertOctagon className="w-4 h-4" />,
  resolucion: <CheckSquare className="w-4 h-4" />,
  decision: <GitBranch className="w-4 h-4" />,
  hito: <Flag className="w-4 h-4" />,
};

export function FollowUpForm({ onSubmit, defaultAuthor = '', className }: FollowUpFormProps) {
  const [type, setType] = useState<FollowUpType>('nota');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(defaultAuthor);
  const [isExpanded, setIsExpanded] = useState(false);
  const canEdit = useCanEdit();

  // Si no puede editar, mostrar mensaje
  if (!canEdit) {
    return (
      <div className={cn(
        'flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-500',
        className
      )}>
        <Lock className="w-5 h-5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">Solo lectura</p>
          <p className="text-xs">Solo Dirección y Consultoría pueden añadir seguimientos.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !author.trim()) return;

    onSubmit({ type, content: content.trim(), author: author.trim() });
    setContent('');
    setIsExpanded(false);
  };

  const typeConfig = FOLLOWUP_TYPE_CONFIG[type];

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-3', className)}>
      {/* Campo de texto principal */}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="Añadir un seguimiento, nota o actualización..."
          rows={isExpanded ? 3 : 1}
          className={cn(
            'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl resize-none',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'transition-all duration-200 placeholder:text-slate-400'
          )}
        />
      </div>

      {/* Opciones expandidas */}
      {isExpanded && (
        <div className="flex flex-wrap items-center gap-3 animate-fade-in">
          {/* Selector de tipo */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {(Object.keys(FOLLOWUP_TYPE_CONFIG) as FollowUpType[]).map((t) => {
              const config = FOLLOWUP_TYPE_CONFIG[t];
              const isSelected = t === type;
              
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  title={config.label}
                  className={cn(
                    'p-2 rounded-md transition-all duration-200',
                    isSelected 
                      ? cn(config.bgColor, config.color)
                      : 'text-slate-500 hover:bg-white hover:text-slate-700'
                  )}
                >
                  {TYPE_ICONS[t]}
                </button>
              );
            })}
          </div>

          {/* Tipo seleccionado */}
          <span className={cn('text-sm font-medium', typeConfig.color)}>
            {typeConfig.label}
          </span>

          {/* Autor */}
          <div className="flex items-center gap-2 ml-auto">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Tu nombre"
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 w-32"
            />

            {/* Botón enviar */}
            <button
              type="submit"
              disabled={!content.trim() || !author.trim()}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
                'bg-primary-900 text-white hover:bg-primary-800',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
              Añadir
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

