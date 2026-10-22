import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

export const TEACHER_INVITE_CODE = 'BAKER2026';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isTeacher: boolean;
  register: (username: string, email: string, password: string, inviteCode?: string) => { success: boolean; error?: string };
  login: (identity: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  switchUserRole: (role: Role) => void;
  usersList: User[];
}

const STORAGE_KEY_USER = 'brielle_quiz_current_user';
const STORAGE_KEY_ALL_USERS = 'brielle_quiz_registered_users';

// Pre-seeded accounts matching spec
const DEFAULT_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'u-teacher-1',
    username: 'ChefBrielle',
    email: 'brielle@baking.quiz',
    role: 'teacher',
    createdAt: new Date().toISOString(),
    passwordHash: 'baker123',
  },
  {
    id: 'u-player-1',
    username: 'PastryPupil',
    email: 'pupil@baking.quiz',
    role: 'player',
    createdAt: new Date().toISOString(),
    passwordHash: 'cookie123',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<(User & { passwordHash: string })[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALL_USERS);
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : DEFAULT_USERS[0]; // Default logged in as ChefBrielle for convenience
    } catch {
      return DEFAULT_USERS[0];
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (err) {
      console.error('Failed to sync current user', err);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(users));
    } catch (err) {
      console.error('Failed to sync all users', err);
    }
  }, [users]);

  const register = (username: string, email: string, password: string, inviteCode?: string) => {
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Validation per spec
    if (!/^[A-Za-z0-9_-]{3,30}$/.test(cleanUsername)) {
      return {
        success: false,
        error: 'Username must be 3-30 characters (letters, numbers, underscores, and dashes only).',
      };
    }

    if (!cleanEmail.includes('@') || cleanEmail.length < 5) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Check unique username and email
    if (users.some((u) => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
      return { success: false, error: 'Username is already taken. Please choose another.' };
    }

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    // Role assignment: Teacher if invite code matches, otherwise Player
    let assignedRole: Role = 'player';
    if (inviteCode && inviteCode.trim().toUpperCase() === TEACHER_INVITE_CODE) {
      assignedRole = 'teacher';
    } else if (inviteCode && inviteCode.trim().length > 0) {
      return {
        success: false,
        error: 'Invalid Teacher Invite Code. Leave blank to register as a Player or enter a valid code.',
      };
    }

    const newUser: User & { passwordHash: string } = {
      id: `u-${Date.now()}`,
      username: cleanUsername,
      email: cleanEmail,
      role: assignedRole,
      createdAt: new Date().toISOString(),
      passwordHash: password, // In production backed by bcryptjs
    };

    setUsers((prev) => [...prev, newUser]);

    // Strip passwordHash before setting user in session
    const { passwordHash: _, ...publicUser } = newUser;
    setCurrentUser(publicUser);

    return { success: true };
  };

  const login = (identity: string, password: string) => {
    const cleanIdentity = identity.trim().toLowerCase();
    const cleanPassword = password.trim();

    const user = users.find(
      (u) =>
        (u.email.toLowerCase() === cleanIdentity || u.username.toLowerCase() === cleanIdentity) &&
        u.passwordHash === cleanPassword
    );

    if (!user) {
      return { success: false, error: 'Invalid username/email or password.' };
    }

    const { passwordHash: _, ...publicUser } = user;
    setCurrentUser(publicUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUserRole = (newRole: Role) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role: newRole };
    setCurrentUser(updated);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, role: newRole } : u))
    );
  };

  const isTeacher = currentUser?.role === 'teacher';
  const isAuthenticated = currentUser !== null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isTeacher,
        register,
        login,
        logout,
        switchUserRole,
        usersList: users.map(({ passwordHash: _, ...safe }) => safe),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
