/**
 * API - ÁREA INDIVIDUAL
 * ======================
 * GET: Obtener área por ID
 * PUT: Actualizar área
 * DELETE: Eliminar área
 */

import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// GET - Obtener área por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const area = await queryOne<any>(`SELECT * FROM areas WHERE id = ?`, [params.id]);

    if (!area) {
      return NextResponse.json(
        { error: 'Área no encontrada' },
        { status: 404 }
      );
    }

    const problemas = await query<any[]>(`
      SELECT * FROM problemas WHERE area_id = ? ORDER BY id ASC
    `, [params.id]);

    // Convertir valores numéricos (MySQL devuelve DECIMAL como string)
    const parseNum = (val: any) => parseFloat(val) || 0;

    return NextResponse.json({
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
        numProblemas: problemas.length,
        inversionMin: problemas.reduce((sum, p) => sum + parseNum(p.coste_minimo), 0),
        inversionMax: problemas.reduce((sum, p) => sum + parseNum(p.coste_maximo), 0),
        ahorroMin: problemas.reduce((sum, p) => sum + Math.round(parseNum(p.coste_minimo) * parseNum(p.roi_minimo) / 100), 0),
        ahorroMax: problemas.reduce((sum, p) => sum + Math.round(parseNum(p.coste_maximo) * parseNum(p.roi_maximo) / 100), 0),
      },
      problemas: problemas.map(p => ({
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
      })),
    });
  } catch (error) {
    console.error('Error fetching area:', error);
    return NextResponse.json(
      { error: 'Error al obtener el área' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar área
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { codigo, nombre, descripcion, prioridad, updatedBy } = body;

    await query(`
      UPDATE areas 
      SET codigo = ?, nombre = ?, descripcion = ?, prioridad = ?, 
          updated_by = ?, updated_at = NOW()
      WHERE id = ?
    `, [codigo, nombre, descripcion, prioridad, updatedBy, params.id]);

    const updatedArea = await queryOne<any>(`SELECT * FROM areas WHERE id = ?`, [params.id]);

    if (!updatedArea) {
      return NextResponse.json(
        { error: 'Área no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: updatedArea.id,
      codigo: updatedArea.codigo,
      nombre: updatedArea.nombre,
      descripcion: updatedArea.descripcion,
      prioridad: updatedArea.prioridad,
      isCustom: updatedArea.is_custom === 1,
      updatedAt: updatedArea.updated_at,
      updatedBy: updatedArea.updated_by,
    });
  } catch (error) {
    console.error('Error updating area:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el área' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar área
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Primero eliminar problemas asociados
    await query(`DELETE FROM problemas WHERE area_id = ?`, [params.id]);
    
    // Luego eliminar el área
    await query(`DELETE FROM areas WHERE id = ?`, [params.id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting area:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el área' },
      { status: 500 }
    );
  }
}

