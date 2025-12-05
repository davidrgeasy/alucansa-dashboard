/**
 * CONEXIÓN A BASE DE DATOS MYSQL
 * ================================
 * Configuración de conexión a MySQL usando mysql2/promise
 */

import mysql from 'mysql2/promise';

// Configuración de conexión
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Pool de conexiones (reutilizable)
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Función helper para ejecutar queries
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  const pool = getPool();
  const [results] = await pool.execute(sql, params);
  return results as T;
}

// Función helper para obtener una sola fila
export async function queryOne<T>(sql: string, params?: any[]): Promise<T | null> {
  const results = await query<T[]>(sql, params);
  return Array.isArray(results) && results.length > 0 ? results[0] : null;
}

// Función para cerrar el pool (útil en tests)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

