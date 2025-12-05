/**
 * API - FOLLOW-UPS DE TRACKING
 * =============================
 * POST: Añadir follow-up
 * DELETE: Eliminar follow-up
 */

import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// Obtener o crear tracking ID para un problema
async function getOrCreateTrackingId(problemaId: string): Promise<number> {
  let tracking = await queryOne<any>(`
    SELECT id FROM tracking WHERE problema_id = ?
  `, [problemaId]);

  if (!tracking) {
    await query(`
      INSERT INTO tracking (problema_id, status, internal_priority, progress, created_at, updated_at)
      VALUES (?, 'pendiente', 'media', 0, NOW(), NOW())
    `, [problemaId]);
    
    tracking = await queryOne<any>(`
      SELECT id FROM tracking WHERE problema_id = ?
    `, [problemaId]);
  }

  return tracking.id;
}

// POST - Añadir follow-up
export async function POST(
  request: NextRequest,
  { params }: { params: { problemaId: string } }
) {
  try {
    const body = await request.json();
    const { type, content, author } = body;

    const trackingId = await getOrCreateTrackingId(params.problemaId);

    // Generar ID único
    const followUpId = `fu-${Date.now()}`;

    await query(`
      INSERT INTO follow_ups (id, tracking_id, type, content, author, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [followUpId, trackingId, type, content, author]);

    // Actualizar fecha de tracking
    await query(`UPDATE tracking SET updated_at = NOW() WHERE id = ?`, [trackingId]);

    const newFollowUp = await queryOne<any>(`SELECT * FROM follow_ups WHERE id = ?`, [followUpId]);

    return NextResponse.json({
      id: newFollowUp.id,
      type: newFollowUp.type,
      content: newFollowUp.content,
      author: newFollowUp.author,
      createdAt: newFollowUp.created_at,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating follow-up:', error);
    return NextResponse.json(
      { error: 'Error al crear el follow-up' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar follow-up
export async function DELETE(
  request: NextRequest,
  { params }: { params: { problemaId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const followUpId = searchParams.get('id');

    if (!followUpId) {
      return NextResponse.json(
        { error: 'ID del follow-up requerido' },
        { status: 400 }
      );
    }

    await query(`DELETE FROM follow_ups WHERE id = ?`, [followUpId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting follow-up:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el follow-up' },
      { status: 500 }
    );
  }
}

