import React, { createContext, useState, useContext, ReactNode } from 'react';

type Role = 'customer' | 'service_provider' | 'admin' | null;

interface User {
    identifier: string | null; // Using phone number for customers
}

interface AuthContextType {
    role: Role;
    user: User | null;
    login: (role: Role, userIdentifier?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<Role>(null);
    const [user, setUser] = useState<User | null>(null);

    const login = (selectedRole: Role, userIdentifier?: string) => {
        setRole(selectedRole);
        setUser({ identifier: userIdentifier || null });
    };

    return (
        <AuthContext.Provider value={{ role, user, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
