/**
 * API - TRACKING
 * ================
 * GET: Obtener todo el tracking
 * POST: Crear o actualizar tracking de un problema
 */

import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// GET - Obtener todo el tracking
export async function GET() {
  try {
    const trackingList = await query<any[]>(`
      SELECT * FROM tracking
    `);

    const result: Record<string, any> = {};
    
    for (const t of trackingList) {
      // Obtener follow-ups del tracking
      const followUps = await query<any[]>(`
        SELECT * FROM follow_ups WHERE tracking_id = ? ORDER BY created_at DESC
      `, [t.id]);

      // Obtener cálculos ROI
      const roiCalculations = await query<any[]>(`
        SELECT * FROM roi_calculations WHERE tracking_id = ? ORDER BY created_at DESC
      `, [t.id]);

      result[t.problema_id] = {
        status: t.status,
        internalPriority: t.internal_priority,
        assignee: t.assignee,
        progress: t.progress,
        startDate: t.start_date,
        targetDate: t.target_date,
        completedDate: t.completed_date,
        lastUpdated: t.updated_at || t.created_at,
        customCost: t.custom_cost_min && t.custom_cost_max ? {
          minimo: t.custom_cost_min,
          maximo: t.custom_cost_max,
          moneda: 'EUR',
        } : null,
        followUps: followUps.map(f => ({
          id: f.id,
          type: f.type,
          content: f.content,
          author: f.author,
          createdAt: f.created_at,
        })),
        roiCalculations: roiCalculations.map(r => ({
          id: r.id,
          name: r.name,
          inversion: r.inversion,
          ahorroAnual: r.ahorro_anual,
          roi: r.roi,
          paybackMeses: r.payback_meses,
          notas: r.notas,
          createdAt: r.created_at,
        })),
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching tracking:', error);
    return NextResponse.json(
      { error: 'Error al obtener el tracking' },
      { status: 500 }
    );
  }
}

// POST - Crear o actualizar tracking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { problemaId, ...trackingData } = body;

    // Verificar si ya existe tracking para este problema
    const existing = await queryOne<any>(`
      SELECT id FROM tracking WHERE problema_id = ?
    `, [problemaId]);

    if (existing) {
      // Actualizar
      await query(`
        UPDATE tracking SET
          status = ?, internal_priority = ?, assignee = ?, progress = ?,
          start_date = ?, target_date = ?, completed_date = ?,
          custom_cost_min = ?, custom_cost_max = ?, updated_at = NOW()
        WHERE problema_id = ?
      `, [
        trackingData.status || 'pendiente',
        trackingData.internalPriority || 'media',
        trackingData.assignee || null,
        trackingData.progress || 0,
        trackingData.startDate || null,
        trackingData.targetDate || null,
        trackingData.completedDate || null,
        trackingData.customCost?.minimo || null,
        trackingData.customCost?.maximo || null,
        problemaId,
      ]);
    } else {
      // Crear nuevo
      await query(`
        INSERT INTO tracking (
          problema_id, status, internal_priority, assignee, progress,
          start_date, target_date, completed_date, custom_cost_min, custom_cost_max,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        problemaId,
        trackingData.status || 'pendiente',
        trackingData.internalPriority || 'media',
        trackingData.assignee || null,
        trackingData.progress || 0,
        trackingData.startDate || null,
        trackingData.targetDate || null,
        trackingData.completedDate || null,
        trackingData.customCost?.minimo || null,
        trackingData.customCost?.maximo || null,
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving tracking:', error);
    return NextResponse.json(
      { error: 'Error al guardar el tracking' },
      { status: 500 }
    );
  }
}

