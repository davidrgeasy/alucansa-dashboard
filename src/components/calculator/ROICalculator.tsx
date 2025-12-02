'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
  Users,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Euro,
  Calculator,
  AlertTriangle,
  ShoppingCart,
  Package,
  Clock,
  Info,
  Sparkles,
  PiggyBank,
  Target,
  Save,
  History,
  FileDown,
  ChevronDown,
  ChevronUp,
  Calendar,
  X,
} from 'lucide-react';

// =====================
// TIPOS
// =====================

interface Employee {
  id: string;
  nombre: string;
  costeHora: number;
  horasSemanalesMin: number;
  horasSemanalesMax: number;
}

export interface ROICalculation {
  id: string;
  fecha: string;
  nombre: string;
  employees: Employee[];
  sobrecostes: { mensual: number };
  ventasPerdidas: { mensual: number };
  perdidaProducto: { mensual: number };
  inversionMin: number;
  inversionMax: number;
  // Resultados calculados
  perdidasMin: number;
  perdidasMax: number;
  roiMin: number;
  roiMax: number;
  paybackMin: number;
  paybackMax: number;
}

interface ROICalculatorProps {
  problemId: string;
  initialInversionMin?: number;
  initialInversionMax?: number;
  savedCalculations?: ROICalculation[];
  onSaveCalculation?: (calculation: ROICalculation) => void;
  onDeleteCalculation?: (id: string) => void;
}

// =====================
// CONSTANTES
// =====================

const SEMANAS_POR_ANO = 52;
const MESES_POR_ANO = 12;

const generateId = () => Math.random().toString(36).substring(2, 9);

// =====================
// COMPONENTES AUXILIARES (fuera del componente principal)
// =====================

interface NumberInputProps {
  value: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  step?: number;
  className?: string;
  placeholder?: string;
}

function NumberInput({
  value,
  onChange,
  prefix = '',
  suffix = '',
  min = 0,
  step = 1,
  className = '',
  placeholder = '',
}: NumberInputProps) {
  const [localValue, setLocalValue] = useState(value.toString());
  
  // Sincronizar cuando el valor externo cambia (pero no durante la edición)
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    const numValue = parseFloat(newValue) || 0;
    onChange(Math.max(min, numValue));
  };

  const handleBlur = () => {
    // Al perder foco, asegurar formato correcto
    const numValue = parseFloat(localValue) || 0;
    setLocalValue(Math.max(min, numValue).toString());
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      {prefix && (
        <span className="absolute left-3 text-slate-400 text-sm pointer-events-none z-10">
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        step={step}
        placeholder={placeholder}
        className={cn(
          "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
          "transition-all duration-200",
          prefix && "pl-8",
          suffix && "pr-12"
        )}
      />
      {suffix && (
        <span className="absolute right-3 text-slate-400 text-sm pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

interface TextInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

function TextInput({ value, onChange, placeholder, className }: TextInputProps) {
  const [localValue, setLocalValue] = useState(value);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={cn(
        "font-medium text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-slate-700",
        className
      )}
    />
  );
}

// =====================
// COMPONENTE DE TARJETA DE EMPLEADO
// =====================

interface EmployeeCardProps {
  employee: Employee;
  onUpdate: (field: keyof Employee, value: string | number) => void;
  onRemove: () => void;
  annualCostMin: number;
  annualCostMax: number;
}

function EmployeeCard({ employee, onUpdate, onRemove, annualCostMin, annualCostMax }: EmployeeCardProps) {
  return (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
      <div className="flex items-center justify-between">
        <TextInput
          value={employee.nombre}
          onChange={(val) => onUpdate('nombre', val)}
          placeholder="Nombre del empleado"
        />
        <button
          onClick={onRemove}
          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">€/hora</label>
          <NumberInput
            value={employee.costeHora}
            onChange={(val) => onUpdate('costeHora', val)}
            prefix="€"
            step={0.5}
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">H/sem mín</label>
          <NumberInput
            value={employee.horasSemanalesMin}
            onChange={(val) => onUpdate('horasSemanalesMin', val)}
            suffix="h"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">H/sem máx</label>
          <NumberInput
            value={employee.horasSemanalesMax}
            onChange={(val) => onUpdate('horasSemanalesMax', Math.max(val, employee.horasSemanalesMin))}
            suffix="h"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 flex justify-between text-xs">
        <span className="text-slate-500">Coste anual estimado:</span>
        <span className="font-semibold text-slate-700">
          {formatCurrency(annualCostMin)} - {formatCurrency(annualCostMax)}
        </span>
      </div>
    </div>
  );
}

// =====================
// COMPONENTE DE INFORME PARA EXPORTAR
// =====================

interface ROIReportProps {
  calculation: ROICalculation;
  problemId: string;
}

export function ROIReport({ calculation, problemId }: ROIReportProps) {
  return (
    <div className="bg-white p-8 max-w-[210mm] mx-auto" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="border-b-2 border-primary-600 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-primary-900">Análisis de ROI</h1>
            <p className="text-sm text-slate-500 mt-1">Problema: {problemId}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Fecha del análisis</p>
            <p className="font-semibold">{new Date(calculation.fecha).toLocaleDateString('es-ES', { 
              day: 'numeric', month: 'long', year: 'numeric' 
            })}</p>
          </div>
        </div>
        {calculation.nombre && (
          <p className="mt-2 text-lg font-medium text-primary-700">{calculation.nombre}</p>
        )}
      </div>

      {/* Resumen Ejecutivo */}
      <div className="mb-8 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
        <h2 className="text-lg font-bold text-primary-900 mb-4">Resumen Ejecutivo</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-600">Pérdidas Anuales Actuales</p>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(calculation.perdidasMin)} - {formatCurrency(calculation.perdidasMax)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Inversión Requerida</p>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(calculation.inversionMin)} - {formatCurrency(calculation.inversionMax)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">ROI Primer Año</p>
            <p className="text-xl font-bold text-emerald-600">
              {calculation.roiMin}% - {calculation.roiMax}%
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Tiempo de Recuperación</p>
            <p className="text-xl font-bold text-indigo-600">
              {calculation.paybackMin} - {calculation.paybackMax} meses
            </p>
          </div>
        </div>
      </div>

      {/* Desglose de Costes */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-primary-900 mb-4">Desglose de Costes Actuales</h2>
        
        {/* Personal */}
        {calculation.employees.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-slate-700 mb-2">Costes de Personal</h3>
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left p-2">Empleado</th>
                  <th className="text-right p-2">€/hora</th>
                  <th className="text-right p-2">Horas/sem</th>
                  <th className="text-right p-2">Coste Anual</th>
                </tr>
              </thead>
              <tbody>
                {calculation.employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-slate-100">
                    <td className="p-2">{emp.nombre}</td>
                    <td className="text-right p-2">{formatCurrency(emp.costeHora)}</td>
                    <td className="text-right p-2">{emp.horasSemanalesMin}-{emp.horasSemanalesMax}h</td>
                    <td className="text-right p-2 font-medium">
                      {formatCurrency(emp.costeHora * emp.horasSemanalesMin * SEMANAS_POR_ANO)} - {formatCurrency(emp.costeHora * emp.horasSemanalesMax * SEMANAS_POR_ANO)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Otros costes */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-xs text-slate-500">Sobrecostes Operativos</p>
            <p className="font-semibold text-red-600">{formatCurrency(calculation.sobrecostes.mensual * 12)}/año</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-slate-500">Ventas Perdidas</p>
            <p className="font-semibold text-purple-600">{formatCurrency(calculation.ventasPerdidas.mensual * 12)}/año</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <p className="text-xs text-slate-500">Pérdida de Producto</p>
            <p className="font-semibold text-orange-600">{formatCurrency(calculation.perdidaProducto.mensual * 12)}/año</p>
          </div>
        </div>
      </div>

      {/* Fórmula */}
      <div className="mb-8 p-4 bg-slate-50 rounded-lg">
        <h2 className="text-lg font-bold text-primary-900 mb-2">Metodología de Cálculo</h2>
        <p className="text-sm text-slate-600 mb-2">
          El ROI se calcula como el porcentaje de retorno sobre la inversión inicial en el primer año:
        </p>
        <div className="bg-white p-3 rounded border text-center font-mono">
          ROI = (Pérdidas Evitadas - Inversión) / Inversión × 100
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 pt-4 mt-8 text-xs text-slate-400 text-center">
        Informe generado automáticamente • Panel de Mejora ALUCANSA
      </div>
    </div>
  );
}

// =====================
// COMPONENTE PRINCIPAL
// =====================

export function ROICalculator({ 
  problemId,
  initialInversionMin = 0, 
  initialInversionMax = 0,
  savedCalculations = [],
  onSaveCalculation,
  onDeleteCalculation,
}: ROICalculatorProps) {
  // Estado de empleados
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  // Estado de otros gastos
  const [sobrecostes, setSobrecostes] = useState({ mensual: 0 });
  const [ventasPerdidas, setVentasPerdidas] = useState({ mensual: 0 });
  const [perdidaProducto, setPerdidaProducto] = useState({ mensual: 0 });
  
  // Estado de inversión
  const [inversionMin, setInversionMin] = useState(initialInversionMin);
  const [inversionMax, setInversionMax] = useState(initialInversionMax);
  
  // Estado para el nombre del cálculo
  const [calculationName, setCalculationName] = useState('');
  
  // Estado para mostrar histórico
  const [showHistory, setShowHistory] = useState(false);
  
  // Ref para exportar
  const reportRef = useRef<HTMLDivElement>(null);

  // Sincronizar inversión inicial
  useEffect(() => {
    setInversionMin(initialInversionMin);
    setInversionMax(initialInversionMax);
  }, [initialInversionMin, initialInversionMax]);

  // Handlers memorizados para empleados
  const addEmployee = useCallback(() => {
    setEmployees((prev) => [
      ...prev,
      {
        id: generateId(),
        nombre: `Empleado ${prev.length + 1}`,
        costeHora: 15,
        horasSemanalesMin: 2,
        horasSemanalesMax: 5,
      },
    ]);
  }, []);

  const removeEmployee = useCallback((id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateEmployee = useCallback((id: string, field: keyof Employee, value: string | number) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  }, []);

  // Cálculos derivados
  const calculations = useMemo(() => {
    const costeEmpleadosMin = employees.reduce((sum, emp) => {
      return sum + emp.costeHora * emp.horasSemanalesMin * SEMANAS_POR_ANO;
    }, 0);
    
    const costeEmpleadosMax = employees.reduce((sum, emp) => {
      return sum + emp.costeHora * emp.horasSemanalesMax * SEMANAS_POR_ANO;
    }, 0);

    const sobrecostesAnual = sobrecostes.mensual * MESES_POR_ANO;
    const ventasPerdidasAnual = ventasPerdidas.mensual * MESES_POR_ANO;
    const perdidaProductoAnual = perdidaProducto.mensual * MESES_POR_ANO;

    const perdidasTotalesMin = costeEmpleadosMin + sobrecostesAnual + ventasPerdidasAnual + perdidaProductoAnual;
    const perdidasTotalesMax = costeEmpleadosMax + sobrecostesAnual + ventasPerdidasAnual + perdidaProductoAnual;

    const roiMin = inversionMax > 0 
      ? Math.round(((perdidasTotalesMin - inversionMax) / inversionMax) * 100) 
      : 0;
    const roiMax = inversionMin > 0 
      ? Math.round(((perdidasTotalesMax - inversionMin) / inversionMin) * 100) 
      : 0;

    const paybackMin = perdidasTotalesMax > 0 
      ? Math.ceil((inversionMin / (perdidasTotalesMax / 12))) 
      : 0;
    const paybackMax = perdidasTotalesMin > 0 
      ? Math.ceil((inversionMax / (perdidasTotalesMin / 12))) 
      : 0;

    return {
      costeEmpleadosMin,
      costeEmpleadosMax,
      sobrecostesAnual,
      ventasPerdidasAnual,
      perdidaProductoAnual,
      perdidasTotalesMin,
      perdidasTotalesMax,
      roiMin,
      roiMax,
      paybackMin,
      paybackMax,
    };
  }, [employees, sobrecostes, ventasPerdidas, perdidaProducto, inversionMin, inversionMax]);

  // Guardar cálculo
  const handleSaveCalculation = () => {
    if (!onSaveCalculation) return;
    
    const calculation: ROICalculation = {
      id: generateId(),
      fecha: new Date().toISOString(),
      nombre: calculationName || `Cálculo ${new Date().toLocaleDateString('es-ES')}`,
      employees: [...employees],
      sobrecostes: { ...sobrecostes },
      ventasPerdidas: { ...ventasPerdidas },
      perdidaProducto: { ...perdidaProducto },
      inversionMin,
      inversionMax,
      perdidasMin: calculations.perdidasTotalesMin,
      perdidasMax: calculations.perdidasTotalesMax,
      roiMin: calculations.roiMin,
      roiMax: calculations.roiMax,
      paybackMin: calculations.paybackMin,
      paybackMax: calculations.paybackMax,
    };
    
    onSaveCalculation(calculation);
    setCalculationName('');
  };

  // Limpiar formulario para nuevo cálculo
  const handleNewCalculation = () => {
    setEmployees([]);
    setSobrecostes({ mensual: 0 });
    setVentasPerdidas({ mensual: 0 });
    setPerdidaProducto({ mensual: 0 });
    setInversionMin(initialInversionMin);
    setInversionMax(initialInversionMax);
    setCalculationName('');
  };

  // Cargar un cálculo guardado
  const loadCalculation = (calc: ROICalculation) => {
    setEmployees(calc.employees);
    setSobrecostes(calc.sobrecostes);
    setVentasPerdidas(calc.ventasPerdidas);
    setPerdidaProducto(calc.perdidaProducto);
    setInversionMin(calc.inversionMin);
    setInversionMax(calc.inversionMax);
    setCalculationName(calc.nombre);
    setShowHistory(false);
  };

  // Exportar a PDF
  const handleExport = async () => {
    if (!reportRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`roi-${problemId}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error exportando PDF:', error);
    }
  };

  // Cálculo actual para exportar
  const currentCalculation: ROICalculation = {
    id: 'current',
    fecha: new Date().toISOString(),
    nombre: calculationName || 'Cálculo actual',
    employees,
    sobrecostes,
    ventasPerdidas,
    perdidaProducto,
    inversionMin,
    inversionMax,
    perdidasMin: calculations.perdidasTotalesMin,
    perdidasMax: calculations.perdidasTotalesMax,
    roiMin: calculations.roiMin,
    roiMax: calculations.roiMax,
    paybackMin: calculations.paybackMin,
    paybackMax: calculations.paybackMax,
  };

  return (
    <div className="space-y-6">
      {/* Informe oculto para exportar */}
      <div className="fixed left-[-9999px] top-0">
        <div ref={reportRef}>
          <ROIReport calculation={currentCalculation} problemId={problemId} />
        </div>
      </div>

      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-4 border border-primary-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Calculator className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-900">Calculadora de ROI Personalizada</h3>
            <p className="text-sm text-slate-600 mt-1">
              Los cálculos se actualizan en tiempo real mientras escribes.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {savedCalculations.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              Histórico ({savedCalculations.length})
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <FileDown className="w-4 h-4" />
            Exportar PDF
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewCalculation}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo
          </Button>
        </div>
      </div>

      {/* Panel de histórico */}
      {showHistory && savedCalculations.length > 0 && (
        <Card className="border-l-4 border-l-indigo-400 animate-fade-in">
          <CardHeader className="pb-2">
            <h4 className="flex items-center gap-2 font-semibold text-slate-800">
              <History className="w-4 h-4 text-indigo-500" />
              Cálculos Guardados
            </h4>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {savedCalculations.map((calc) => (
                <div
                  key={calc.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{calc.nombre}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(calc.fecha).toLocaleDateString('es-ES')}
                      </span>
                      <span className="text-emerald-600 font-medium">
                        ROI: {calc.roiMin}% - {calc.roiMax}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => loadCalculation(calc)}
                      className="px-3 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded transition-colors"
                    >
                      Cargar
                    </button>
                    {onDeleteCalculation && (
                      <button
                        onClick={() => onDeleteCalculation(calc.id)}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLUMNA IZQUIERDA - GASTOS ACTUALES */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-primary-900">Gastos Actuales</h3>
            <span className="text-xs text-slate-500">(Sin la solución)</span>
          </div>

          {/* 1. COSTES DE PERSONAL */}
          <Card className="border-l-4 border-l-amber-400">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-semibold text-slate-800">
                  <Users className="w-4 h-4 text-amber-500" />
                  Costes de Personal
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addEmployee}
                  className="text-primary-600 hover:text-primary-700 gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Añadir
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Tiempo dedicado por empleados a tareas que la solución automatizaría
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {employees.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">
                    Añade empleados para calcular costes de personal
                  </p>
                </div>
              ) : (
                employees.map((emp) => (
                  <EmployeeCard
                    key={emp.id}
                    employee={emp}
                    onUpdate={(field, value) => updateEmployee(emp.id, field, value)}
                    onRemove={() => removeEmployee(emp.id)}
                    annualCostMin={emp.costeHora * emp.horasSemanalesMin * SEMANAS_POR_ANO}
                    annualCostMax={emp.costeHora * emp.horasSemanalesMax * SEMANAS_POR_ANO}
                  />
                ))
              )}

              {employees.length > 0 && (
                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                  <span className="text-sm font-medium text-slate-600">Total Personal Anual:</span>
                  <span className="text-sm font-bold text-amber-600">
                    {formatCurrency(calculations.costeEmpleadosMin)} - {formatCurrency(calculations.costeEmpleadosMax)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. SOBRECOSTES */}
          <Card className="border-l-4 border-l-red-400">
            <CardHeader className="pb-3">
              <h4 className="flex items-center gap-2 font-semibold text-slate-800">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Sobrecostes Operativos
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Costes adicionales por ineficiencias, errores, reprocesos, etc.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Sobrecoste mensual</label>
                  <NumberInput
                    value={sobrecostes.mensual}
                    onChange={(val) => setSobrecostes({ mensual: val })}
                    prefix="€"
                    step={100}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Proyección anual</label>
                  <div className="px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-sm font-semibold text-red-600">
                    {formatCurrency(calculations.sobrecostesAnual)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. VENTAS PERDIDAS */}
          <Card className="border-l-4 border-l-purple-400">
            <CardHeader className="pb-3">
              <h4 className="flex items-center gap-2 font-semibold text-slate-800">
                <ShoppingCart className="w-4 h-4 text-purple-500" />
                Ventas Potenciales Perdidas
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Facturación que se pierde por no poder atender demanda, retrasos, etc.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Facturación mensual perdida</label>
                  <NumberInput
                    value={ventasPerdidas.mensual}
                    onChange={(val) => setVentasPerdidas({ mensual: val })}
                    prefix="€"
                    step={100}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Proyección anual</label>
                  <div className="px-3 py-2 bg-purple-50 border border-purple-100 rounded-lg text-sm font-semibold text-purple-600">
                    {formatCurrency(calculations.ventasPerdidasAnual)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. PÉRDIDA DE PRODUCTO */}
          <Card className="border-l-4 border-l-orange-400">
            <CardHeader className="pb-3">
              <h4 className="flex items-center gap-2 font-semibold text-slate-800">
                <Package className="w-4 h-4 text-orange-500" />
                Pérdida o Deterioro de Producto
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Valor del producto perdido, deteriorado o que hay que desechar
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Valor mensual perdido</label>
                  <NumberInput
                    value={perdidaProducto.mensual}
                    onChange={(val) => setPerdidaProducto({ mensual: val })}
                    prefix="€"
                    step={100}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Proyección anual</label>
                  <div className="px-3 py-2 bg-orange-50 border border-orange-100 rounded-lg text-sm font-semibold text-orange-600">
                    {formatCurrency(calculations.perdidaProductoAnual)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RESUMEN PÉRDIDAS TOTALES */}
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <h4 className="font-bold text-red-800">Pérdidas Anuales Totales</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Mínimo</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(calculations.perdidasTotalesMin)}
                  </p>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Máximo</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(calculations.perdidasTotalesMax)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUMNA DERECHA - INVERSIÓN Y ROI */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-semibold text-primary-900">Inversión y Retorno</h3>
          </div>

          {/* INVERSIÓN EN LA SOLUCIÓN */}
          <Card className="border-l-4 border-l-blue-400">
            <CardHeader className="pb-3">
              <h4 className="flex items-center gap-2 font-semibold text-slate-800">
                <PiggyBank className="w-4 h-4 text-blue-500" />
                Inversión en la Solución
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Coste estimado de implementar la solución propuesta
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Inversión mínima</label>
                  <NumberInput
                    value={inversionMin}
                    onChange={setInversionMin}
                    prefix="€"
                    step={500}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Inversión máxima</label>
                  <NumberInput
                    value={inversionMax}
                    onChange={(val) => setInversionMax(Math.max(val, inversionMin))}
                    prefix="€"
                    step={500}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROI CALCULADO */}
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
            <CardHeader className="pb-3">
              <h4 className="flex items-center gap-2 font-bold text-emerald-800">
                <Target className="w-5 h-5 text-emerald-500" />
                ROI Primer Año
              </h4>
              <p className="text-xs text-emerald-600">
                Retorno de la inversión esperado en el primer año
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-white/70 rounded-xl shadow-sm">
                  <p className="text-xs text-slate-500 mb-1">Mínimo</p>
                  <p className={cn(
                    "text-3xl font-bold",
                    calculations.roiMin >= 0 ? "text-emerald-600" : "text-red-600"
                  )}>
                    {calculations.roiMin}%
                  </p>
                </div>
                <div className="text-center p-4 bg-white/70 rounded-xl shadow-sm">
                  <p className="text-xs text-slate-500 mb-1">Máximo</p>
                  <p className={cn(
                    "text-3xl font-bold",
                    calculations.roiMax >= 0 ? "text-emerald-600" : "text-red-600"
                  )}>
                    {calculations.roiMax}%
                  </p>
                </div>
              </div>

              {/* Barra de ROI visual */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0%</span>
                  <span>100%</span>
                  <span>200%</span>
                  <span>300%+</span>
                </div>
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden relative">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      calculations.roiMax >= 100 
                        ? "bg-gradient-to-r from-emerald-400 to-emerald-600" 
                        : calculations.roiMax >= 0 
                          ? "bg-gradient-to-r from-amber-400 to-amber-600"
                          : "bg-gradient-to-r from-red-400 to-red-600"
                    )}
                    style={{ width: `${Math.min(Math.max(calculations.roiMax, 0) / 3, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TIEMPO DE RECUPERACIÓN */}
          <Card className="border-l-4 border-l-indigo-400">
            <CardHeader className="pb-3">
              <h4 className="flex items-center gap-2 font-semibold text-slate-800">
                <Clock className="w-4 h-4 text-indigo-500" />
                Tiempo de Recuperación (Payback)
              </h4>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Mejor caso</p>
                  <p className="text-xl font-bold text-indigo-600">
                    {calculations.paybackMin > 0 ? `${calculations.paybackMin} meses` : '-'}
                  </p>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Peor caso</p>
                  <p className="text-xl font-bold text-indigo-600">
                    {calculations.paybackMax > 0 ? `${calculations.paybackMax} meses` : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ANÁLISIS Y RECOMENDACIÓN */}
          <Card className={cn(
            "border-l-4",
            calculations.roiMax >= 100 
              ? "border-l-emerald-500 bg-emerald-50/50" 
              : calculations.roiMax >= 50 
                ? "border-l-amber-500 bg-amber-50/50"
                : "border-l-red-500 bg-red-50/50"
          )}>
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  calculations.roiMax >= 100 
                    ? "bg-emerald-100" 
                    : calculations.roiMax >= 50 
                      ? "bg-amber-100"
                      : "bg-red-100"
                )}>
                  {calculations.roiMax >= 100 ? (
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                  ) : calculations.roiMax >= 50 ? (
                    <Info className="w-5 h-5 text-amber-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <h5 className={cn(
                    "font-semibold",
                    calculations.roiMax >= 100 
                      ? "text-emerald-800" 
                      : calculations.roiMax >= 50 
                        ? "text-amber-800"
                        : "text-red-800"
                  )}>
                    {calculations.roiMax >= 100 
                      ? "Inversión Muy Recomendable" 
                      : calculations.roiMax >= 50 
                        ? "Inversión Moderadamente Atractiva"
                        : "Revisa los Datos Introducidos"}
                  </h5>
                  <p className="text-sm text-slate-600 mt-1">
                    {calculations.roiMax >= 100 
                      ? `Con un ROI entre ${calculations.roiMin}% y ${calculations.roiMax}%, la inversión se recuperaría en ${calculations.paybackMin}-${calculations.paybackMax} meses.` 
                      : calculations.roiMax >= 50 
                        ? `El retorno esperado (${calculations.roiMin}%-${calculations.roiMax}%) es positivo pero moderado.`
                        : calculations.perdidasTotalesMin === 0
                          ? "Introduce datos de gastos actuales para calcular el ROI."
                          : "El ROI sugiere revisar tanto los gastos como la inversión."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GUARDAR CÁLCULO */}
          {onSaveCalculation && (
            <Card className="border-2 border-dashed border-primary-200 bg-primary-50/30">
              <CardContent className="py-4">
                <h4 className="flex items-center gap-2 font-semibold text-slate-800 mb-3">
                  <Save className="w-4 h-4 text-primary-500" />
                  Guardar este Cálculo
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={calculationName}
                    onChange={(e) => setCalculationName(e.target.value)}
                    placeholder="Nombre del cálculo (opcional)"
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveCalculation}
                    disabled={calculations.perdidasTotalesMin === 0 && inversionMin === 0}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* FÓRMULA */}
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="py-4">
              <h5 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <Info className="w-4 h-4 text-slate-500" />
                ¿Cómo se calcula el ROI?
              </h5>
              <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-sm text-center">
                <span className="text-slate-500">ROI = </span>
                <span className="text-emerald-600">(Pérdidas Evitadas - Inversión)</span>
                <span className="text-slate-500"> / </span>
                <span className="text-blue-600">Inversión</span>
                <span className="text-slate-500"> × 100</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
