'use client';

import { useState, useRef } from 'react';
import { Download, Upload, AlertTriangle, Check, X, Trash2, Database } from 'lucide-react';
import { useProblems, ExportedData } from '@/store/useProblems';
import { useTracking } from '@/store/useTracking';
import { Modal } from '@/components/ui/Modal';

interface FullExportData {
  version: string;
  exportedAt: string;
  appName: string;
  problems: ExportedData;
  tracking: {
    trackingData: Record<string, any>;
    roiCalculations: Record<string, any>;
  };
}

export function DataManager() {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Stores
  const { exportData: exportProblems, importData: importProblems, clearAllData: clearProblems } = useProblems();
  const trackingStore = useTracking();

  // Exportar todos los datos
  const handleExport = () => {
    const problemsData = exportProblems();
    const trackingData = {
      trackingData: trackingStore.trackingData,
      roiCalculations: trackingStore.roiCalculations,
    };
    
    const fullData: FullExportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      appName: 'ALUCANSA Panel de Mejora',
      problems: problemsData,
      tracking: trackingData,
    };
    
    // Crear y descargar archivo
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `alucansa-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setImportStatus({
      type: 'success',
      message: 'Datos exportados correctamente',
    });
    
    setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
  };

  // Importar datos
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as FullExportData;
        
        // Validar estructura
        if (!data.version || !data.appName) {
          setImportStatus({
            type: 'error',
            message: 'Archivo inválido: no es un backup de ALUCANSA',
          });
          return;
        }
        
        // Importar problemas
        if (data.problems) {
          const result = importProblems(data.problems);
          if (!result.success) {
            setImportStatus({
              type: 'error',
              message: result.message,
            });
            return;
          }
        }
        
        // Importar tracking
        if (data.tracking) {
          useTracking.setState({
            trackingData: data.tracking.trackingData || {},
            roiCalculations: data.tracking.roiCalculations || {},
          });
        }
        
        setImportStatus({
          type: 'success',
          message: '¡Datos importados correctamente! La página se recargará.',
        });
        
        // Recargar para aplicar los cambios
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        
      } catch (error) {
        setImportStatus({
          type: 'error',
          message: 'Error al leer el archivo. Asegúrate de que es un archivo JSON válido.',
        });
      }
    };
    
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Limpiar todos los datos
  const handleClearAll = () => {
    clearProblems();
    useTracking.setState({
      trackingData: {},
      roiCalculations: {},
    });
    setShowConfirmClear(false);
    setImportStatus({
      type: 'success',
      message: 'Todos los datos personalizados han sido eliminados',
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title="Gestionar datos"
      >
        <Database className="w-4 h-4" />
        <span className="hidden sm:inline">Datos</span>
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Gestión de Datos"
        size="md"
      >
        <div className="space-y-6">
          {/* Descripción */}
          <p className="text-sm text-gray-600">
            Exporta tus datos para hacer una copia de seguridad o importa datos de un backup anterior.
            Esto incluye problemas personalizados, ediciones, seguimiento y cálculos de ROI.
          </p>

          {/* Estado de importación */}
          {importStatus.type && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                importStatus.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {importStatus.type === 'success' ? (
                <Check className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
              <span className="text-sm">{importStatus.message}</span>
            </div>
          )}

          {/* Botones principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Exportar */}
            <button
              onClick={handleExport}
              className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
                <Download className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">Exportar Datos</p>
                <p className="text-xs text-gray-500 mt-1">Descargar copia de seguridad</p>
              </div>
            </button>

            {/* Importar */}
            <label className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer">
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">Importar Datos</p>
                <p className="text-xs text-gray-500 mt-1">Restaurar desde backup</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 mb-3">Zona de peligro</p>
            
            {/* Limpiar datos */}
            {!showConfirmClear ? (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar todos los datos personalizados
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">
                      ¿Estás seguro?
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      Se eliminarán todos los problemas personalizados, ediciones y datos de seguimiento. 
                      Los datos originales del sistema se mantendrán. Esta acción no se puede deshacer.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleClearAll}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      >
                        Sí, eliminar todo
                      </button>
                      <button
                        onClick={() => setShowConfirmClear(false)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info adicional */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600">
              <strong>Consejo:</strong> Exporta regularmente tus datos para evitar perderlos si cambias 
              de navegador o limpias el caché. Los archivos de backup se pueden abrir con cualquier 
              editor de texto.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}

