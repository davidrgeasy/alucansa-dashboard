/**
 * API - PROBLEMA INDIVIDUAL
 * ==========================
 * GET: Obtener problema por ID
 * PUT: Actualizar problema
 * DELETE: Eliminar problema
 */

import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// GET - Obtener problema por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const problema = await queryOne<any>(`SELECT * FROM problemas WHERE id = ?`, [params.id]);

    if (!problema) {
      return NextResponse.json(
        { error: 'Problema no encontrado' },
        { status: 404 }
      );
    }

    // Convertir valores numéricos (MySQL devuelve DECIMAL como string)
    const parseNum = (val: any) => parseFloat(val) || 0;

    return NextResponse.json({
      id: problema.id,
      areaId: problema.area_id,
      titulo: problema.titulo,
      descripcion: problema.descripcion,
      impacto: problema.impacto,
      urgencia: problema.urgencia,
      causas: JSON.parse(problema.causas || '[]'),
      evidencias: JSON.parse(problema.evidencias || '[]'),
      solucionPropuesta: problema.solucion_propuesta,
      pasosImplementacion: JSON.parse(problema.pasos_implementacion || '[]'),
      coste: {
        minimo: parseNum(problema.coste_minimo),
        maximo: parseNum(problema.coste_maximo),
        moneda: 'EUR',
      },
      roi: {
        minimo: parseNum(problema.roi_minimo),
        maximo: parseNum(problema.roi_maximo),
        justificacion: problema.roi_justificacion,
      },
      dependencias: JSON.parse(problema.dependencias || '[]'),
      tags: JSON.parse(problema.tags || '[]'),
      isCustom: problema.is_custom === 1,
      createdAt: problema.created_at,
      createdBy: problema.created_by,
      updatedAt: problema.updated_at,
      updatedBy: problema.updated_by,
    });
  } catch (error) {
    console.error('Error fetching problema:', error);
    return NextResponse.json(
      { error: 'Error al obtener el problema' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar problema
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
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
      updatedBy,
    } = body;

    await query(`
      UPDATE problemas SET
        titulo = ?, descripcion = ?, impacto = ?, urgencia = ?,
        causas = ?, evidencias = ?, solucion_propuesta = ?, pasos_implementacion = ?,
        coste_minimo = ?, coste_maximo = ?, roi_minimo = ?, roi_maximo = ?, roi_justificacion = ?,
        dependencias = ?, tags = ?, updated_by = ?, updated_at = NOW()
      WHERE id = ?
    `, [
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
      updatedBy,
      params.id,
    ]);

    const updatedProblema = await queryOne<any>(`SELECT * FROM problemas WHERE id = ?`, [params.id]);

    if (!updatedProblema) {
      return NextResponse.json(
        { error: 'Problema no encontrado' },
        { status: 404 }
      );
    }

    // Convertir valores numéricos
    const parseNum = (val: any) => parseFloat(val) || 0;

    return NextResponse.json({
      id: updatedProblema.id,
      areaId: updatedProblema.area_id,
      titulo: updatedProblema.titulo,
      descripcion: updatedProblema.descripcion,
      impacto: updatedProblema.impacto,
      urgencia: updatedProblema.urgencia,
      causas: JSON.parse(updatedProblema.causas || '[]'),
      evidencias: JSON.parse(updatedProblema.evidencias || '[]'),
      solucionPropuesta: updatedProblema.solucion_propuesta,
      pasosImplementacion: JSON.parse(updatedProblema.pasos_implementacion || '[]'),
      coste: {
        minimo: parseNum(updatedProblema.coste_minimo),
        maximo: parseNum(updatedProblema.coste_maximo),
        moneda: 'EUR',
      },
      roi: {
        minimo: parseNum(updatedProblema.roi_minimo),
        maximo: parseNum(updatedProblema.roi_maximo),
        justificacion: updatedProblema.roi_justificacion,
      },
      dependencias: JSON.parse(updatedProblema.dependencias || '[]'),
      tags: JSON.parse(updatedProblema.tags || '[]'),
      isCustom: updatedProblema.is_custom === 1,
      updatedAt: updatedProblema.updated_at,
      updatedBy: updatedProblema.updated_by,
    });
  } catch (error) {
    console.error('Error updating problema:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el problema' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar problema
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // También eliminar tracking asociado
    await query(`DELETE FROM tracking WHERE problema_id = ?`, [params.id]);
    
    // Eliminar el problema
    await query(`DELETE FROM problemas WHERE id = ?`, [params.id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting problema:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el problema' },
      { status: 500 }
    );
  }
}

