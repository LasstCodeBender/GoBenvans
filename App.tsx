
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ParentApp } from './apps/ParentApp';
import { ChildApp } from './apps/ChildApp';
import { UserRole } from './types';
import { Repeat } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, switchUser, children } = useApp();

  // Login Screen / Role Selector
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 relative overflow-hidden flex flex-col items-center justify-center p-6 font-sans">
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-600/30 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-md space-y-8 text-center relative z-10">
           <div className="space-y-2">
               <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-brand-500/40 mb-6">
                   <span className="text-3xl">🚀</span>
               </div>
               <h1 className="text-4xl font-display font-bold text-white tracking-tight">PennyPilot</h1>
               <p className="text-slate-400 text-lg">The smart money app for modern families.</p>
           </div>
           
           <div className="space-y-4 mt-10">
               {/* Parent Login */}
               <button 
                 onClick={() => switchUser(UserRole.PARENT)}
                 className="w-full bg-white/10 backdrop-blur-md border border-white/10 group hover:bg-white/20 transition-all p-5 rounded-[2rem] flex items-center gap-5 text-left"
               >
                   <div className="w-14 h-14 bg-brand-100 text-2xl flex items-center justify-center rounded-full group-hover:scale-110 transition shadow-lg">👨‍💼</div>
                   <div>
                       <h3 className="font-bold text-white text-lg">Parent View</h3>
                       <p className="text-slate-300 text-sm">Manage allowances & controls</p>
                   </div>
               </button>

               {/* Children Login List */}
               <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-6">
                   <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Kid View Login</h3>
                   <div className="space-y-3">
                       {children.map(child => (
                           <button 
                             key={child.id}
                             onClick={() => switchUser(UserRole.CHILD, child.id)}
                             className="w-full bg-white/5 hover:bg-white/10 border border-white/5 transition p-3 rounded-2xl flex items-center gap-4 text-left"
                           >
                               <div className="w-10 h-10 bg-fun-100 text-xl flex items-center justify-center rounded-full shadow-sm">
                                   {child.avatar}
                               </div>
                               <div>
                                   <h4 className="font-bold text-white text-sm">{child.name}</h4>
                                   <p className="text-slate-400 text-xs">£{child.balance?.toFixed(2)}</p>
                               </div>
                           </button>
                       ))}
                   </div>
               </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Floating Switcher for Demo Purposes */}
      <div className="fixed bottom-24 right-4 z-50 md:top-4 md:right-4 md:bottom-auto">
          <button 
            onClick={() => {
                // Toggle simple switch or log out to switch child
                if (currentUser.role === UserRole.PARENT) {
                    switchUser(UserRole.CHILD); // Defaults to first child if no ID passed
                } else {
                    switchUser(UserRole.PARENT);
                }
            }}
            className="bg-slate-900/90 text-white backdrop-blur-md pl-3 pr-4 py-2 rounded-full shadow-2xl border border-white/10 flex items-center gap-2 text-xs font-bold hover:scale-105 transition"
          >
            <div className="p-1 bg-white/20 rounded-full">
                <Repeat size={12} />
            </div>
            Switch View
          </button>
      </div>

      {currentUser.role === UserRole.PARENT ? <ParentApp /> : <ChildApp />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
