/**
 * API - ÁREAS
 * ============
 * GET: Obtener todas las áreas con sus problemas
 * POST: Crear nueva área
 */

import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// GET - Obtener todas las áreas con sus problemas
export async function GET() {
  try {
    // Obtener todas las áreas
    const areas = await query<any[]>(`
      SELECT * FROM areas ORDER BY codigo ASC
    `);

    // Obtener todos los problemas
    const problemas = await query<any[]>(`
      SELECT * FROM problemas ORDER BY id ASC
    `);

    // Agrupar problemas por área y calcular resumen
    const areasConProblemas = areas.map(area => {
      const problemasArea = problemas.filter(p => p.area_id === area.id);
      
      // Convertir valores numéricos (MySQL devuelve DECIMAL como string)
      const parseNum = (val: any) => parseFloat(val) || 0;
      
      return {
        id: area.id,
        codigo: area.codigo,
        nombre: area.nombre,
        descripcion: area.descripcion,
        prioridad: area.prioridad,
        isCustom: area.is_custom === 1,
        createdAt: area.created_at,
        createdBy: area.created_by,
        updatedAt: area.updated_at,
        updatedBy: area.updated_by,
        resumen: {
          numProblemas: problemasArea.length,
          inversionMin: problemasArea.reduce((sum, p) => sum + parseNum(p.coste_minimo), 0),
          inversionMax: problemasArea.reduce((sum, p) => sum + parseNum(p.coste_maximo), 0),
          ahorroMin: problemasArea.reduce((sum, p) => sum + Math.round(parseNum(p.coste_minimo) * parseNum(p.roi_minimo) / 100), 0),
          ahorroMax: problemasArea.reduce((sum, p) => sum + Math.round(parseNum(p.coste_maximo) * parseNum(p.roi_maximo) / 100), 0),
        },
        problemas: problemasArea.map(p => ({
          id: p.id,
          areaId: p.area_id,
          titulo: p.titulo,
          descripcion: p.descripcion,
          impacto: p.impacto,
          urgencia: p.urgencia,
          causas: JSON.parse(p.causas || '[]'),
          evidencias: JSON.parse(p.evidencias || '[]'),
          solucionPropuesta: p.solucion_propuesta,
          pasosImplementacion: JSON.parse(p.pasos_implementacion || '[]'),
          coste: {
            minimo: parseNum(p.coste_minimo),
            maximo: parseNum(p.coste_maximo),
            moneda: 'EUR',
          },
          roi: {
            minimo: parseNum(p.roi_minimo),
            maximo: parseNum(p.roi_maximo),
            justificacion: p.roi_justificacion,
          },
          dependencias: JSON.parse(p.dependencias || '[]'),
          tags: JSON.parse(p.tags || '[]'),
          isCustom: p.is_custom === 1,
          createdAt: p.created_at,
          createdBy: p.created_by,
          updatedAt: p.updated_at,
          updatedBy: p.updated_by,
        })),
      };
    });

    return NextResponse.json(areasConProblemas);
  } catch (error) {
    console.error('Error fetching areas:', error);
    return NextResponse.json(
      { error: 'Error al obtener las áreas' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva área
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { codigo, nombre, descripcion, prioridad, createdBy } = body;

    // Generar ID único
    const id = `area-custom-${Date.now()}`;

    await query(`
      INSERT INTO areas (id, codigo, nombre, descripcion, prioridad, is_custom, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, 1, ?, NOW())
    `, [id, codigo, nombre, descripcion, prioridad, createdBy]);

    const newArea = await queryOne<any>(`SELECT * FROM areas WHERE id = ?`, [id]);

    return NextResponse.json({
      id: newArea.id,
      codigo: newArea.codigo,
      nombre: newArea.nombre,
      descripcion: newArea.descripcion,
      prioridad: newArea.prioridad,
      isCustom: true,
      createdAt: newArea.created_at,
      createdBy: newArea.created_by,
      resumen: {
        numProblemas: 0,
        inversionMin: 0,
        inversionMax: 0,
        ahorroMin: 0,
        ahorroMax: 0,
      },
      problemas: [],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating area:', error);
    return NextResponse.json(
      { error: 'Error al crear el área' },
      { status: 500 }
    );
  }
}

