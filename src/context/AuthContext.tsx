import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

export const TEACHER_INVITE_CODE = 'BAKER2026';
// Recognized passwords that grant teacher access
export const TEACHER_PASSWORDS = ['baker123', 'BAKER2026', 'teacher123'];

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isTeacher: boolean;
  loginOrRegister: (username: string, email: string, password?: string) => { success: boolean; user: User };
  login: (identity: string, password?: string) => { success: boolean; error?: string };
  register: (username: string, email: string, password: string, inviteCode?: string) => { success: boolean; error?: string };
  logout: () => void;
  switchUserRole: (role: Role) => void;
  usersList: User[];
  deleteSavedUser: (userId: string) => void;
}

const STORAGE_KEY_USER = 'brielle_quiz_current_user';
const STORAGE_KEY_ALL_USERS = 'brielle_quiz_registered_users';

// Initial default accounts
const DEFAULT_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'u-brielle',
    username: 'Brielle',
    email: 'brielle@baking.quiz',
    role: 'player',
    createdAt: new Date().toISOString(),
    passwordHash: 'any',
  },
  {
    id: 'u-teacher-1',
    username: 'ChefBrielle',
    email: 'chef@baking.quiz',
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
      return saved ? JSON.parse(saved) : DEFAULT_USERS[0];
    } catch {
      return DEFAULT_USERS[0];
    }
  });

  // Save current user anytime it changes
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

  // Save all registered/logged-in users anytime the list changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(users));
    } catch (err) {
      console.error('Failed to sync all users', err);
    }
  }, [users]);

  // Main login/sign up method:
  // When signing in as a teacher, teachers have access by the password (e.g. baker123, BAKER2026, teacher123)
  const loginOrRegister = (usernameInput: string, emailInput: string, passwordInput: string = '') => {
    const cleanUsername = usernameInput.trim() || 'Player';
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim() || 'saved-password';

    // Teacher access by password
    const grantsTeacherRole = TEACHER_PASSWORDS.some(
      (tp) => tp.toLowerCase() === cleanPassword.toLowerCase()
    );

    // Check if user with this username or email already exists
    const existingIndex = users.findIndex(
      (u) =>
        u.email.toLowerCase() === cleanEmail ||
        u.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    let loggedInUser: User;

    if (existingIndex >= 0) {
      // Existing user: update their details, granting teacher role if teacher password is used
      const existing = users[existingIndex];
      const updatedUser: User & { passwordHash: string } = {
        ...existing,
        username: cleanUsername,
        email: cleanEmail,
        passwordHash: cleanPassword,
        role: grantsTeacherRole ? 'teacher' : existing.role,
      };

      const updatedList = [...users];
      updatedList[existingIndex] = updatedUser;
      setUsers(updatedList);

      const { passwordHash: _, ...safeUser } = updatedUser;
      loggedInUser = safeUser;
    } else {
      // Brand new user: role is teacher if using teacher password, otherwise player
      const newUser: User & { passwordHash: string } = {
        id: `u-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        username: cleanUsername,
        email: cleanEmail,
        role: grantsTeacherRole ? 'teacher' : 'player',
        createdAt: new Date().toISOString(),
        passwordHash: cleanPassword,
      };

      setUsers((prev) => [newUser, ...prev]);

      const { passwordHash: _, ...safeUser } = newUser;
      loggedInUser = safeUser;
    }

    setCurrentUser(loggedInUser);
    return { success: true, user: loggedInUser };
  };

  const login = (identity: string, password: string = '') => {
    const defaultEmail = identity.includes('@') ? identity : `${identity.toLowerCase()}@baking.quiz`;
    const defaultUser = identity.includes('@') ? identity.split('@')[0] : identity;
    const res = loginOrRegister(defaultUser, defaultEmail, password);
    return { success: true };
  };

  const register = (username: string, email: string, password: string, inviteCode?: string) => {
    const res = loginOrRegister(username, email, password);
    if (inviteCode && inviteCode.trim().toUpperCase() === TEACHER_INVITE_CODE) {
      switchUserRole('teacher');
    }
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

  const deleteSavedUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  const isTeacher = currentUser?.role === 'teacher';
  const isAuthenticated = currentUser !== null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isTeacher,
        loginOrRegister,
        login,
        register,
        logout,
        switchUserRole,
        usersList: users.map(({ passwordHash: _, ...safe }) => safe),
        deleteSavedUser,
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
