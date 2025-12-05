/**
 * API - PROBLEMAS
 * ================
 * GET: Obtener todos los problemas
 * POST: Crear nuevo problema
 */

import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// GET - Obtener todos los problemas
export async function GET() {
  try {
    const problemas = await query<any[]>(`
      SELECT * FROM problemas ORDER BY id ASC
    `);

    // Convertir valores numéricos (MySQL devuelve DECIMAL como string)
    const parseNum = (val: any) => parseFloat(val) || 0;

    const result = problemas.map(p => ({
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
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching problemas:', error);
    return NextResponse.json(
      { error: 'Error al obtener los problemas' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo problema
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      areaId,
      titulo,
      descripcion,
      impacto,
      urgencia,
      causas,
      evidencias,
      solucionPropuesta,
      pasosImplementacion,
      coste,
      roi,
      dependencias,
      tags,
      createdBy,
    } = body;

    await query(`
      INSERT INTO problemas (
        id, area_id, titulo, descripcion, impacto, urgencia,
        causas, evidencias, solucion_propuesta, pasos_implementacion,
        coste_minimo, coste_maximo, roi_minimo, roi_maximo, roi_justificacion,
        dependencias, tags, is_custom, created_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, NOW())
    `, [
      id,
      areaId,
      titulo,
      descripcion,
      impacto,
      urgencia,
      JSON.stringify(causas || []),
      JSON.stringify(evidencias || []),
      solucionPropuesta,
      JSON.stringify(pasosImplementacion || []),
      coste?.minimo || 0,
      coste?.maximo || 0,
      roi?.minimo || 0,
      roi?.maximo || 0,
      roi?.justificacion || '',
      JSON.stringify(dependencias || []),
      JSON.stringify(tags || []),
      createdBy,
    ]);

    const newProblema = await queryOne<any>(`SELECT * FROM problemas WHERE id = ?`, [id]);

    // Convertir valores numéricos
    const parseNum = (val: any) => parseFloat(val) || 0;

    return NextResponse.json({
      id: newProblema.id,
      areaId: newProblema.area_id,
      titulo: newProblema.titulo,
      descripcion: newProblema.descripcion,
      impacto: newProblema.impacto,
      urgencia: newProblema.urgencia,
      causas: JSON.parse(newProblema.causas || '[]'),
      evidencias: JSON.parse(newProblema.evidencias || '[]'),
      solucionPropuesta: newProblema.solucion_propuesta,
      pasosImplementacion: JSON.parse(newProblema.pasos_implementacion || '[]'),
      coste: {
        minimo: parseNum(newProblema.coste_minimo),
        maximo: parseNum(newProblema.coste_maximo),
        moneda: 'EUR',
      },
      roi: {
        minimo: parseNum(newProblema.roi_minimo),
        maximo: parseNum(newProblema.roi_maximo),
        justificacion: newProblema.roi_justificacion,
      },
      dependencias: JSON.parse(newProblema.dependencias || '[]'),
      tags: JSON.parse(newProblema.tags || '[]'),
      isCustom: true,
      createdAt: newProblema.created_at,
      createdBy: newProblema.created_by,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating problema:', error);
    return NextResponse.json(
      { error: 'Error al crear el problema' },
      { status: 500 }
    );
  }
}

