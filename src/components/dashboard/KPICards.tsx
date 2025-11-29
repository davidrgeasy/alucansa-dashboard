'use client';

import { KPIs } from '@/types';
import { formatCurrency, formatCurrencyRange } from '@/lib/utils';
import { 
  AlertTriangle, 
  TrendingUp, 
  Wallet,
  PiggyBank,
  BarChart3
} from 'lucide-react';

interface KPICardsProps {
  kpis: KPIs;
}

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'blue' | 'orange' | 'green' | 'purple';
}

const colorStyles = {
  blue: {
    bg: 'bg-primary-50',
    icon: 'bg-primary-100 text-primary-600',
    value: 'text-primary-900',
  },
  orange: {
    bg: 'bg-accent-50',
    icon: 'bg-accent-100 text-accent-600',
    value: 'text-accent-700',
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'bg-emerald-100 text-emerald-600',
    value: 'text-emerald-700',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-100 text-purple-600',
    value: 'text-purple-700',
  },
};

function KPICard({ title, value, subtitle, icon, color }: KPICardProps) {
  const styles = colorStyles[color];

  return (
    <div className={`${styles.bg} rounded-xl p-5 border border-slate-100`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${styles.value} tracking-tight`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${styles.icon}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function KPICards({ kpis }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Total Problemas"
        value={kpis.totalProblemas}
        subtitle={`${kpis.problemasAltoImpacto} de alto impacto`}
        icon={<BarChart3 className="w-6 h-6" />}
        color="blue"
      />

      <KPICard
        title="Inversión Estimada"
        value={formatCurrencyRange(kpis.inversionMinima, kpis.inversionMaxima)}
        subtitle="Rango total de inversión"
        icon={<Wallet className="w-6 h-6" />}
        color="orange"
      />

      <KPICard
        title="Ahorro Potencial"
        value={formatCurrencyRange(Math.round(kpis.ahorroMinimo), Math.round(kpis.ahorroMaximo))}
        subtitle="Basado en ROI estimado"
        icon={<PiggyBank className="w-6 h-6" />}
        color="green"
      />

      <KPICard
        title="Problemas Críticos"
        value={kpis.problemasAltoImpacto}
        subtitle={`${kpis.problemasMedioImpacto} medio, ${kpis.problemasBajoImpacto} bajo`}
        icon={<AlertTriangle className="w-6 h-6" />}
        color="purple"
      />
    </div>
  );
}

