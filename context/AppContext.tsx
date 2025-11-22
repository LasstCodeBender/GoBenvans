
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Transaction, Chore, ChoreStatus, SavingsGoal, CardSettings, Mission } from '../types';

// Mock Initial Data
const INITIAL_PARENT: User = { id: 'p1', name: 'Alex', role: UserRole.PARENT, avatar: '👨‍💼' };
const INITIAL_CHILD: User = { id: 'c1', name: 'Leo', role: UserRole.CHILD, avatar: '🛹', balance: 45.50, dob: '2014-05-20' };

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', amount: -5.00, description: 'Roblox Credits', date: '2023-10-24', type: 'spend', category: 'Gaming', userId: 'c1' },
  { id: 't2', amount: 10.00, description: 'Weekly Allowance', date: '2023-10-23', type: 'transfer', userId: 'c1' },
  { id: 't3', amount: 5.00, description: 'Chore: Lawn Mowing', date: '2023-10-22', type: 'earn', userId: 'c1' },
];

const INITIAL_CHORES: Chore[] = [
  { id: 'ch1', title: 'Wash the Dishes', reward: 3.00, status: ChoreStatus.PENDING, assigneeId: 'c1', dueDate: '2023-10-25' },
  { id: 'ch2', title: 'Clean Room', reward: 5.00, status: ChoreStatus.REVIEW, assigneeId: 'c1' },
];

const INITIAL_GOALS: SavingsGoal[] = [
  { id: 'g1', title: 'New Skateboard', targetAmount: 120, currentAmount: 45, ownerId: 'c1', emoji: '🛹' }
];

interface AppContextType {
  currentUser: User | null;
  activeChildId: string; // For parent view
  parent: User;
  children: User[];
  transactions: Transaction[];
  chores: Chore[];
  goals: SavingsGoal[];
  cardSettings: Record<string, CardSettings>;
  missions: Mission[];
  isParentOnboarded: boolean;
  
  // Actions
  switchUser: (role: UserRole, userId?: string) => void;
  addChild: (firstName: string, lastName: string, dob: string, avatar: string) => void;
  setActiveChild: (id: string) => void;
  addTransaction: (t: Transaction) => void;
  updateChoreStatus: (choreId: string, status: ChoreStatus) => void;
  addChore: (title: string, reward: number, childId: string, dueDate?: string) => void;
  transferMoney: (amount: number, fromId: string, toId: string) => void;
  updateCardSettings: (childId: string, settings: Partial<CardSettings>) => void;
  addSavings: (goalId: string, amount: number) => void;
  withdrawSavings: (goalId: string, amount: number) => void;
  completeParentOnboarding: (details: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [currentUser, setCurrentUser] = useState<User | null>(null); 
  const [parent, setParent] = useState<User>(INITIAL_PARENT);
  const [childrenList, setChildrenList] = useState<User[]>([INITIAL_CHILD]);
  const [activeChildId, setActiveChildId] = useState<string>(INITIAL_CHILD.id);
  const [isParentOnboarded, setIsParentOnboarded] = useState(false);
  
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [chores, setChores] = useState<Chore[]>(INITIAL_CHORES);
  const [goals, setGoals] = useState<SavingsGoal[]>(INITIAL_GOALS);
  
  // Default card settings with new fields
  const [cardSettings, setCardSettings] = useState<Record<string, CardSettings>>({
    'c1': { 
        isFrozen: false, 
        dailyLimit: 20, 
        blockedCategories: ['Gambling'],
        design: { color: 'bg-slate-900', label: 'Leo', theme: 'default' },
        allowance: { active: true, amount: 10, frequency: 'weekly', day: 'Friday' }
    }
  });

  const [missions] = useState<Mission[]>([
    { id: 'm1', title: 'Inflation Fighter', description: 'Learn why prices go up', reward: 2, completed: false, type: 'lesson' },
    { id: 'm2', title: 'Budget Boss', description: 'Pass the weekly budget quiz', reward: 5, completed: false, type: 'quiz' },
  ]);

  const switchUser = (role: UserRole, userId?: string) => {
    if (role === UserRole.PARENT) {
      setCurrentUser(parent);
    } else {
      const child = childrenList.find(c => c.id === userId) || childrenList[0];
      setCurrentUser(child);
      setActiveChildId(child.id); // Sync active child view when logging in as child
    }
  };

  const setActiveChild = (id: string) => {
    setActiveChildId(id);
  };

  const completeParentOnboarding = (details: Partial<User>) => {
      setParent(prev => ({ ...prev, ...details }));
      if (currentUser?.role === UserRole.PARENT) {
          setCurrentUser(prev => prev ? ({ ...prev, ...details }) : null);
      }
      setIsParentOnboarded(true);
  };

  const addChild = (firstName: string, lastName: string, dob: string, avatar: string) => {
    const newChildId = `c${Date.now()}`;
    const newChild: User = {
      id: newChildId,
      name: firstName, // Display name is first name
      role: UserRole.CHILD,
      avatar: avatar,
      balance: 0,
      dob: dob
    };

    setChildrenList(prev => [...prev, newChild]);
    
    // Initialize Settings for new child
    setCardSettings(prev => ({
      ...prev,
      [newChildId]: {
        isFrozen: false,
        dailyLimit: 10,
        blockedCategories: [],
        design: { color: 'bg-brand-600', label: firstName, theme: 'default' },
        allowance: { active: false, amount: 5, frequency: 'weekly', day: 'Friday' }
      }
    }));

    setActiveChildId(newChildId);
  };

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
    // Update balance if it's a child
    if (t.userId) {
        setChildrenList(prev => prev.map(child => {
            if (child.id === t.userId) {
                const newBal = (child.balance || 0) + t.amount;
                return { ...child, balance: newBal };
            }
            return child;
        }));
    }
  };

  const transferMoney = (amount: number, fromId: string, toId: string) => {
     addTransaction({
        id: Date.now().toString(),
        amount: amount,
        description: 'Transfer from Parent',
        date: new Date().toISOString().split('T')[0],
        type: 'transfer',
        userId: toId
     });
  };

  const addChore = (title: string, reward: number, childId: string, dueDate?: string) => {
    setChores(prev => [...prev, {
      id: Date.now().toString(),
      title,
      reward,
      status: ChoreStatus.PENDING,
      assigneeId: childId,
      dueDate
    }]);
  };

  const updateChoreStatus = (choreId: string, status: ChoreStatus) => {
    setChores(prev => prev.map(c => {
      if (c.id === choreId) {
        // If moving to COMPLETED (Parent Approved), pay the child
        if (status === ChoreStatus.COMPLETED && c.status !== ChoreStatus.COMPLETED) {
            addTransaction({
                id: `pay-${Date.now()}`,
                amount: c.reward,
                description: `Chore Payout: ${c.title}`,
                date: new Date().toISOString().split('T')[0],
                type: 'earn',
                userId: c.assigneeId
            });
        }
        return { ...c, status };
      }
      return c;
    }));
  };

  const updateCardSettings = (childId: string, settings: Partial<CardSettings>) => {
    setCardSettings(prev => ({
        ...prev,
        [childId]: { ...prev[childId], ...settings }
    }));
  };

  const addSavings = (goalId: string, amount: number) => {
     const goal = goals.find(g => g.id === goalId);
     if (!goal) return;
     
     addTransaction({
        id: `save-${Date.now()}`,
        amount: -amount,
        description: `Saved for ${goal.title}`,
        date: new Date().toISOString().split('T')[0],
        type: 'transfer',
        userId: goal.ownerId
     });

     setGoals(prev => prev.map(g => {
         if (g.id === goalId) return { ...g, currentAmount: g.currentAmount + amount };
         return g;
     }));
  };

  const withdrawSavings = (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    addTransaction({
        id: `withdraw-${Date.now()}`,
        amount: amount,
        description: `Withdrawn from ${goal.title}`,
        date: new Date().toISOString().split('T')[0],
        type: 'transfer',
        userId: goal.ownerId
     });

     setGoals(prev => prev.map(g => {
         if (g.id === goalId) return { ...g, currentAmount: Math.max(0, g.currentAmount - amount) };
         return g;
     }));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      parent,
      children: childrenList,
      activeChildId, 
      transactions,
      chores,
      goals,
      cardSettings,
      missions,
      isParentOnboarded,
      switchUser,
      addChild,
      setActiveChild,
      addTransaction,
      updateChoreStatus,
      addChore,
      transferMoney,
      updateCardSettings,
      addSavings,
      withdrawSavings,
      completeParentOnboarding
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
