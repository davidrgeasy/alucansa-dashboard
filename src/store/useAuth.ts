/**
 * STORE DE AUTENTICACIÓN - ZUSTAND CON PERSISTENCIA
 * ==================================================
 * 
 * Gestiona el estado de autenticación y roles del usuario.
 * Persiste en localStorage para mantener la sesión.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserRole, DEMO_USERS, ROLE_CONFIG } from '@/types/auth';

interface AuthState {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  hasAccessCode: boolean;
  
  // Acciones
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  setAccessCode: (hasCode: boolean) => void;
  
  // Para demo: cambiar rol directamente
  setRole: (role: UserRole) => void;
  
  // Helpers
  canEdit: () => boolean;
  getRoleConfig: () => typeof ROLE_CONFIG[UserRole] | null;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hasAccessCode: false,
      
      login: (email: string, password: string) => {
        // Buscar usuario en la lista demo
        const user = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ 
            user: userWithoutPassword, 
            isAuthenticated: true 
          });
          return { success: true };
        }
        
        return { 
          success: false, 
          error: 'Credenciales incorrectas' 
        };
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, hasAccessCode: false });
      },
      
      setAccessCode: (hasCode: boolean) => {
        set({ hasAccessCode: hasCode });
      },
      
      // Para demo: permite cambiar el rol sin reloguear
      setRole: (role: UserRole) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { ...currentUser, role } 
          });
        }
      },
      
      canEdit: () => {
        const user = get().user;
        if (!user) return false;
        return ROLE_CONFIG[user.role].canEdit;
      },
      
      getRoleConfig: () => {
        const user = get().user;
        if (!user) return null;
        return ROLE_CONFIG[user.role];
      },
    }),
    {
      name: 'alucansa-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        hasAccessCode: state.hasAccessCode
      }),
    }
  )
);

/**
 * Hook para verificar si el usuario puede editar
 */
export function useCanEdit(): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return ROLE_CONFIG[user.role].canEdit;
}

/**
 * Hook para obtener el rol actual
 */
export function useCurrentRole(): UserRole | null {
  const { user } = useAuth();
  return user?.role || null;
}

