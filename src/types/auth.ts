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
 * Parsea los usuarios desde la variable de entorno
 * Formato: email:password:name:role,email:password:name:role,...
 */
function parseUsersFromEnv(): Array<User & { password: string }> {
  const envUsers = process.env.NEXT_PUBLIC_DEMO_USERS || '';
  
  if (!envUsers) {
    // Usuarios por defecto si no hay variable de entorno
    console.warn('⚠️ NEXT_PUBLIC_DEMO_USERS no configurado. Usando usuarios por defecto.');
    return [
      { id: 'admin-1', name: 'Admin', email: 'admin@demo.com', password: 'demo', role: 'admin' },
      { id: 'dir-1', name: 'Dirección', email: 'dir@demo.com', password: 'demo', role: 'direccion' },
      { id: 'user-1', name: 'Usuario', email: 'user@demo.com', password: 'demo', role: 'usuario' },
    ];
  }

  return envUsers.split(',').map((userStr, index) => {
    const [email, password, name, role] = userStr.split(':');
    return {
      id: `user-${index + 1}`,
      email: email?.trim() || '',
      password: password?.trim() || '',
      name: name?.trim() || '',
      role: (role?.trim() as UserRole) || 'usuario',
    };
  });
}

/**
 * Usuarios demo para pruebas (configurados vía variables de entorno)
 */
export const DEMO_USERS: Array<User & { password: string }> = parseUsersFromEnv();

