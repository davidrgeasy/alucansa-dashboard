/**
 * UTILIDAD DE EXPORTACIÓN A PDF
 * ==============================
 * 
 * Funciones para exportar contenido HTML a PDF usando html2canvas y jsPDF.
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface ExportOptions {
  filename: string;
  title?: string;
  subtitle?: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter';
  margin?: number;
  quality?: number;
  scale?: number;
}

const DEFAULT_OPTIONS: Required<ExportOptions> = {
  filename: 'documento',
  title: '',
  subtitle: '',
  orientation: 'portrait',
  format: 'a4',
  margin: 10,
  quality: 0.95,
  scale: 2,
};

/**
 * Exporta un elemento HTML a PDF
 */
export async function exportToPdf(
  element: HTMLElement,
  options: ExportOptions
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Añadir clase para estilos de exportación
  element.classList.add('exporting-pdf');
  
  try {
    // Capturar el elemento como canvas
    const canvas = await html2canvas(element, {
      scale: opts.scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      // Ignorar elementos con esta clase
      ignoreElements: (el) => el.classList.contains('no-print'),
    });

    // Crear PDF
    const pdf = new jsPDF({
      orientation: opts.orientation,
      unit: 'mm',
      format: opts.format,
    });

    // Dimensiones de la página
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = opts.margin;
    const contentWidth = pageWidth - (margin * 2);

    // Añadir encabezado si hay título
    let yOffset = margin;
    
    if (opts.title) {
      pdf.setFontSize(18);
      pdf.setTextColor(25, 34, 57); // primary-900
      pdf.text(opts.title, margin, yOffset + 6);
      yOffset += 12;
    }

    if (opts.subtitle) {
      pdf.setFontSize(11);
      pdf.setTextColor(100, 116, 139); // slate-500
      pdf.text(opts.subtitle, margin, yOffset + 4);
      yOffset += 8;
    }

    if (opts.title || opts.subtitle) {
      // Línea separadora
      pdf.setDrawColor(226, 232, 240); // slate-200
      pdf.line(margin, yOffset + 2, pageWidth - margin, yOffset + 2);
      yOffset += 8;
    }

    // Calcular dimensiones de la imagen
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    const availableHeight = pageHeight - yOffset - margin;

    // Convertir canvas a imagen
    const imgData = canvas.toDataURL('image/jpeg', opts.quality);

    // Si la imagen cabe en una página
    if (imgHeight <= availableHeight) {
      pdf.addImage(imgData, 'JPEG', margin, yOffset, imgWidth, imgHeight);
    } else {
      // Dividir en múltiples páginas
      let remainingHeight = imgHeight;
      let sourceY = 0;
      let isFirstPage = true;

      while (remainingHeight > 0) {
        const currentAvailableHeight = isFirstPage ? availableHeight : pageHeight - (margin * 2);
        const sliceHeight = Math.min(currentAvailableHeight, remainingHeight);
        
        // Calcular la porción del canvas a usar
        const sourceHeight = (sliceHeight / imgHeight) * canvas.height;
        
        // Crear un canvas temporal para esta porción
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = sourceHeight;
        const ctx = tempCanvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(
            canvas,
            0, sourceY,
            canvas.width, sourceHeight,
            0, 0,
            canvas.width, sourceHeight
          );
          
          const sliceImgData = tempCanvas.toDataURL('image/jpeg', opts.quality);
          
          if (!isFirstPage) {
            pdf.addPage();
          }
          
          pdf.addImage(
            sliceImgData,
            'JPEG',
            margin,
            isFirstPage ? yOffset : margin,
            imgWidth,
            sliceHeight
          );
        }

        sourceY += sourceHeight;
        remainingHeight -= sliceHeight;
        isFirstPage = false;
      }
    }

    // Añadir pie de página con fecha
    const totalPages = pdf.getNumberOfPages();
    const now = new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184); // slate-400
      
      // Fecha a la izquierda
      pdf.text(`Generado: ${now}`, margin, pageHeight - 5);
      
      // Número de página a la derecha
      pdf.text(
        `Página ${i} de ${totalPages}`,
        pageWidth - margin - 25,
        pageHeight - 5
      );
    }

    // Guardar PDF
    pdf.save(`${opts.filename}.pdf`);
  } finally {
    // Remover clase de exportación
    element.classList.remove('exporting-pdf');
  }
}

/**
 * Exporta múltiples elementos a un solo PDF (uno por página)
 */
export async function exportMultipleToPdf(
  elements: HTMLElement[],
  options: ExportOptions
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const pdf = new jsPDF({
    orientation: opts.orientation,
    unit: 'mm',
    format: opts.format,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = opts.margin;
  const contentWidth = pageWidth - (margin * 2);

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.classList.add('exporting-pdf');

    try {
      if (i > 0) {
        pdf.addPage();
      }

      const canvas = await html2canvas(element, {
        scale: opts.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        ignoreElements: (el) => el.classList.contains('no-print'),
      });

      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/jpeg', opts.quality);

      pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, Math.min(imgHeight, pageHeight - margin * 2));
    } finally {
      element.classList.remove('exporting-pdf');
    }
  }

  // Añadir metadatos
  const now = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text(`Generado: ${now}`, margin, pageHeight - 5);
    pdf.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 25, pageHeight - 5);
  }

  pdf.save(`${opts.filename}.pdf`);
}

