import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const result = await authService.login(email, password);
        if (result.success) {
            setUser(result.data.user);
        }
        return result;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    // Check if user has a specific permission
    const hasPermission = (permission) => {
        if (!user) return false;
        // Admin has all permissions
        if (user.role === 'administrator') return true;
        return user.permissions?.includes(permission) || false;
    };

    // Check if user has any of the specified permissions
    const hasAnyPermission = (permissions) => {
        if (!user) return false;
        if (user.role === 'administrator') return true;
        return permissions.some(p => user.permissions?.includes(p));
    };

    // Check if user has a specific role
    const hasRole = (role) => {
        if (!user) return false;
        return user.role === role;
    };

    // Check if user has any of the specified roles
    const hasAnyRole = (roles) => {
        if (!user) return false;
        return roles.includes(user.role);
    };

    // Role hierarchy check
    const isAdmin = () => hasRole('administrator');
    const isHR = () => hasAnyRole(['administrator', 'hr_officer']);
    const isManager = () => hasAnyRole(['administrator', 'hr_officer', 'manager']);

    const value = {
        user,
        loading,
        login,
        logout,
        hasPermission,
        hasAnyPermission,
        hasRole,
        hasAnyRole,
        isAdmin,
        isHR,
        isManager,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
