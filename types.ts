
export enum UserRole {
  PARENT = 'PARENT',
  CHILD = 'CHILD'
}

export interface User {
  id: string;
  name: string; // Display name (First Name)
  role: UserRole;
  avatar: string; // URL or Emoji
  balance?: number; // For children
  dob?: string; // Date of Birth
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'spend' | 'earn' | 'transfer';
  category?: string;
  userId: string; // Who owns this transaction
}

export enum ChoreStatus {
  PENDING = 'PENDING',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED'
}

export interface Chore {
  id: string;
  title: string;
  reward: number;
  status: ChoreStatus;
  assigneeId: string;
  dueDate?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  ownerId: string;
  emoji: string;
}

export interface CardDesign {
  color: string; // Tailwind class or hex
  label: string;
  theme: 'default' | 'dark' | 'fun';
}

export interface AllowanceSettings {
  active: boolean;
  amount: number;
  frequency: 'weekly' | 'monthly';
  day: string; // e.g., 'Friday'
}

export interface CardSettings {
  isFrozen: boolean;
  dailyLimit: number;
  blockedCategories: string[];
  design: CardDesign;
  allowance: AllowanceSettings;
}

// Gemini AI Related Types
export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  type: 'quiz' | 'lesson';
  content?: string; // The AI generated lesson
}
