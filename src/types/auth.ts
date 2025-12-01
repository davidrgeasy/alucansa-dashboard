/**
 * TIPOS PARA SISTEMA DE AUTENTICACIÓN Y ROLES
 * =============================================
 */

/**
 * Roles disponibles en el sistema
 */
export type UserRole = 'admin' | 'direccion' | 'usuario';

/**
 * Configuración de cada rol
 */
export interface RoleConfig {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  canEdit: boolean;
}

/**
 * Usuario del sistema
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * Credenciales de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Configuración de roles
 */
export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  admin: {
    label: 'Administrador',
    description: 'Consultoría - Acceso completo',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    canEdit: true,
  },
  direccion: {
    label: 'Dirección',
    description: 'Dirección ALUCANSA - Puede editar seguimientos',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    canEdit: true,
  },
  usuario: {
    label: 'Usuario',
    description: 'Solo lectura',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    canEdit: false,
  },
};

/**
 * Usuarios demo para pruebas (en producción vendrían de una API)
 */
export const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: 'admin-1',
    name: 'Consultor Admin',
    email: 'admin@consultoria.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 'dir-1',
    name: 'Director ALUCANSA',
    email: 'direccion@alucansa.com',
    password: 'direccion123',
    role: 'direccion',
  },
  {
    id: 'user-1',
    name: 'Usuario Operativo',
    email: 'usuario@alucansa.com',
    password: 'usuario123',
    role: 'usuario',
  },
];

