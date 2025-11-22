
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Modal, AmountDisplay } from '../components/Shared';
import { 
  Wallet, Target, CheckCircle, PlayCircle, Star, 
  Gamepad2, Sparkles, ChevronRight, Trophy, PiggyBank, CreditCard, Plus, ShoppingBag, Settings, PenTool, Palette, X,
  ArrowRightLeft, Lock, Unlock, MoreHorizontal, Hash, Gauge, Clock
} from 'lucide-react';
import { generateFinancialTip } from '../services/geminiService';
import { ChoreStatus, Mission } from '../types';

export const ChildApp: React.FC = () => {
  const { currentUser, activeChildId, transactions, chores, goals, missions, updateChoreStatus, addSavings, cardSettings, updateCardSettings } = useApp();
  
  const [activeTab, setActiveTab] = useState<'home' | 'card' | 'earn' | 'save' | 'learn'>('home');
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  
  // Mission State
  const [quizState, setQuizState] = useState<any>(null);
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);

  const settings = cardSettings[currentUser?.id || 'c1'];
  const balance = currentUser?.balance || 0;
  const savingsTotal = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalMoney = balance + savingsTotal;

  // Mock data for the "Spent this week" view from screenshot
  const spentThisWeek = 19.80;
  const availableToSpend = balance;

  const handleStartMission = async (mission: Mission) => {
    setActiveMission(mission);
    setQuizResult(null);
    const content = await generateFinancialTip(mission.title);
    setQuizState(content);
  };

  const handleQuizAnswer = (index: number) => {
     if (index === quizState.correctAnswer) {
         setQuizResult('correct');
     } else {
         setQuizResult('wrong');
     }
  };

  const closeMission = () => {
      setActiveMission(null);
      setQuizState(null);
      setQuizResult(null);
  };

  const renderHome = () => (
    <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen pb-24">
        {/* Purple Header */}
        <div className="bg-brand-600 pt-10 pb-24 px-6 rounded-b-[3rem] text-white relative z-0 text-center shadow-lg shadow-brand-900/20">
            <div className="mb-6">
                <h1 className="font-display font-bold text-xl mb-1">Hi {currentUser?.name}!</h1>
                <p className="text-brand-200 text-sm font-medium">Your spending limit is ₵{settings.dailyLimit * 7} per week</p>
            </div>

            <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-left">
                    <div className="flex items-center gap-1 text-brand-200 font-bold text-3xl">
                         ₵{spentThisWeek.toFixed(2)} <ChevronRight size={20} className="opacity-50" />
                    </div>
                    <p className="text-brand-200/80 text-xs font-medium">Spent this week</p>
                </div>
                <div className="text-left">
                     <div className="text-white font-bold text-3xl">
                         ₵{availableToSpend.toFixed(2)}
                    </div>
                    <p className="text-brand-200/80 text-xs font-medium">Available to spend</p>
                </div>
            </div>
        </div>

        {/* Overlapping Card Section */}
        <div className="px-4 -mt-16 relative z-10">
            <div className="bg-white rounded-[2rem] shadow-xl p-6 relative">
                
                {/* Avatar Bubble */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 p-1.5 bg-white rounded-full shadow-sm">
                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-2xl border-4 border-slate-50">
                        {currentUser?.avatar}
                    </div>
                </div>

                {/* Card Content Split */}
                <div className="flex justify-between items-center mt-6">
                    {/* Left: Card Visual (Click to Card Tab) */}
                    <div 
                        className="flex-1 flex flex-col items-center text-center gap-2 cursor-pointer group"
                        onClick={() => setActiveTab('card')}
                    >
                         <div className={`w-20 h-12 ${settings.design.color} rounded-lg relative shadow-md flex items-center justify-center transition-transform group-hover:scale-105 ring-2 ring-transparent group-hover:ring-brand-200`}>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full absolute top-2 right-2 opacity-50"></div>
                            <span className="text-[9px] text-white font-bold opacity-90 tracking-widest">{settings.design.label}</span>
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-lg">₵{balance.toFixed(2)}</p>
                            <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
                                On your card
                            </p>
                         </div>
                    </div>

                    {/* Center Plus */}
                    <div className="text-slate-300">
                        <Plus size={20} />
                    </div>

                    {/* Right: Savings */}
                    <div className="flex-1 flex flex-col items-center text-center gap-2">
                         <div className="w-10 h-8 text-brand-600 flex items-center justify-center">
                            <PiggyBank size={32} strokeWidth={1.5} />
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-lg">₵{savingsTotal.toFixed(2)}</p>
                            <p className="text-xs text-slate-400 font-medium">In your savings</p>
                         </div>
                    </div>
                </div>

                {/* Footer Total */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-bold text-sm">All your money</span>
                    <span className="text-slate-900 font-bold text-lg">₵{totalMoney.toFixed(2)}</span>
                </div>
            </div>
        </div>

        {/* Activity List */}
        <div className="px-6 mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider">Activity</h3>
                <button className="text-brand-600 font-bold text-sm hover:underline">See all</button>
            </div>
            
            <div className="space-y-0 bg-white rounded-3xl shadow-sm overflow-hidden">
                {transactions.slice(0, 5).map((t, i) => (
                    <div key={t.id} className={`flex items-center justify-between p-4 ${i !== transactions.length - 1 ? 'border-b border-slate-50' : ''}`}>
                        <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                 t.type === 'spend' ? 'bg-brand-50 text-brand-600' : 
                                 t.type === 'earn' ? 'bg-green-50 text-green-600' :
                                 'bg-blue-50 text-blue-600'
                             }`}>
                                 {t.type === 'spend' ? <ShoppingBag size={18} /> : t.type === 'earn' ? <CheckCircle size={18} /> : <Wallet size={18} />}
                             </div>
                             <div>
                                 <p className="font-bold text-slate-800 text-sm">{t.description}</p>
                                 <p className="text-xs text-slate-400">{new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                             </div>
                        </div>
                        <div className="text-right">
                            <AmountDisplay amount={t.amount} className={`text-sm block ${t.amount > 0 ? 'text-green-600' : 'text-slate-900'}`} />
                            {t.type === 'spend' && <span className="text-xs text-slate-400">₵{availableToSpend.toFixed(2)}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderCardPage = () => (
    <div className="animate-in slide-in-from-right-10 duration-300 bg-slate-50 min-h-screen pb-24">
        {/* Clean Header */}
        <div className="bg-brand-600 text-white p-6 pt-10 flex justify-between items-center">
            <div className="w-8"></div> {/* Spacer */}
            <h1 className="font-display font-bold text-lg">Card</h1>
            <div className="w-8 flex justify-end">
                <Settings size={20} className="opacity-80" />
            </div>
        </div>

        {/* Card Visual Area */}
        <div className="bg-white pb-8 pt-6 rounded-b-[3rem] shadow-sm relative z-10">
            <div className="text-center mb-6">
                 <h2 className="text-3xl font-bold text-slate-900 tracking-tight">₵{balance.toFixed(2)}</h2>
                 <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Available Balance</p>
            </div>
            
            {/* Realistic Card */}
            <div className="flex justify-center mb-6 px-6">
                <div className={`w-full max-w-sm aspect-[1.58/1] ${settings.design.color} rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-500 text-white p-6 flex flex-col justify-between`}>
                    {/* Background decoration */}
                    <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-black/10 rounded-full blur-xl"></div>
                    
                    {/* Top Row */}
                    <div className="flex justify-between items-start">
                        <span className="font-display font-bold text-xl italic tracking-wide opacity-90">PennyPilot</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-8 border-r border-white/20"></div>
                            <div className="text-white/80">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M5 12v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* Chip */}
                    <div className="flex gap-4 items-center mt-2">
                        <div className="w-12 h-9 bg-yellow-400/90 rounded-lg border border-yellow-600/20 relative overflow-hidden shadow-sm">
                            <div className="absolute inset-0 border border-black/10 rounded-lg"></div>
                            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/10"></div>
                            <div className="absolute left-1/2 top-0 w-[1px] h-full bg-black/10"></div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div>
                         <p className="font-mono text-lg tracking-widest mb-2 opacity-90 shadow-black drop-shadow-sm">
                             •••• •••• •••• 4829
                         </p>
                         <div className="flex justify-between items-end">
                             <div>
                                 <p className="text-[9px] uppercase opacity-60 font-bold mb-0.5">Cardholder</p>
                                 <p className="font-bold tracking-wider uppercase text-sm truncate max-w-[180px]">
                                     {settings.design.label || currentUser?.name}
                                 </p>
                             </div>
                             <div className="font-bold italic text-2xl opacity-90">VISA</div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Account Details Pill */}
            <div className="flex justify-center">
                <div className="bg-slate-100 px-6 py-3 rounded-2xl font-mono text-slate-600 font-bold tracking-wider text-sm flex items-center gap-2 shadow-inner">
                    04-00-29 19283841
                </div>
            </div>
        </div>

        {/* Actions Grid */}
        <div className="px-6 py-8">
             <div className="flex justify-between items-start px-2">
                 <button className="flex flex-col items-center gap-2 group">
                     <div className="w-14 h-14 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-700 group-active:scale-95 transition hover:border-brand-200 hover:text-brand-600">
                         <ArrowRightLeft size={22} />
                     </div>
                     <span className="text-xs font-bold text-slate-600">Payments</span>
                 </button>

                 <button 
                    onClick={() => updateCardSettings(currentUser!.id, { isFrozen: !settings.isFrozen })}
                    className="flex flex-col items-center gap-2 group"
                >
                     <div className={`w-14 h-14 rounded-full border shadow-sm flex items-center justify-center group-active:scale-95 transition ${settings.isFrozen ? 'bg-red-500 text-white border-red-500' : 'bg-white border-slate-100 text-slate-700 hover:border-brand-200 hover:text-brand-600'}`}>
                         {settings.isFrozen ? <Lock size={22} /> : <Unlock size={22} />}
                     </div>
                     <span className="text-xs font-bold text-slate-600">{settings.isFrozen ? 'Unfreeze' : 'Block'}</span>
                 </button>

                 <button className="flex flex-col items-center gap-2 group">
                     <div className="w-14 h-14 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-700 group-active:scale-95 transition hover:border-brand-200 hover:text-brand-600">
                         <Hash size={22} />
                     </div>
                     <span className="text-xs font-bold text-slate-600">PIN</span>
                 </button>

                 <button 
                    onClick={() => setIsCustomizeOpen(true)}
                    className="flex flex-col items-center gap-2 group"
                >
                     <div className="w-14 h-14 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-700 group-active:scale-95 transition hover:border-brand-200 hover:text-brand-600">
                         <Palette size={22} />
                     </div>
                     <span className="text-xs font-bold text-slate-600">Design</span>
                 </button>

                 <button className="flex flex-col items-center gap-2 group">
                     <div className="w-14 h-14 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-700 group-active:scale-95 transition hover:border-brand-200 hover:text-brand-600">
                         <Gauge size={22} />
                     </div>
                     <span className="text-xs font-bold text-slate-600">Limits</span>
                 </button>
             </div>
        </div>

        {/* History Section */}
        <div className="px-6">
            <h3 className="font-bold text-slate-900 text-lg mb-4">This week</h3>
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                            <Wallet size={18} />
                        </div>
                        <div>
                             <p className="font-bold text-slate-800 text-sm">Allowance</p>
                             <p className="text-xs text-slate-400">24 August 2024</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="font-bold text-green-600 text-sm">+₵10.00</span>
                        <span className="block text-xs text-slate-400">₵30.00</span>
                    </div>
                </div>
                
                {transactions.filter(t => t.type === 'spend').slice(0, 4).map((t, i) => (
                    <div key={t.id} className="p-5 border-b border-slate-50 flex items-center justify-between last:border-0">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
                                <ShoppingBag size={18} />
                            </div>
                            <div>
                                 <p className="font-bold text-slate-800 text-sm">{t.description}</p>
                                 <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <AmountDisplay amount={t.amount} className="text-sm block text-slate-900" />
                            <span className="block text-xs text-slate-400">₵{availableToSpend.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderEarn = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300 p-6 pt-12">
         <div className="flex items-center justify-between mb-4">
             <h1 className="font-display font-bold text-3xl text-slate-900">Tasks</h1>
             <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                 Earn ₵{chores.reduce((acc, c) => c.status === ChoreStatus.PENDING ? acc + c.reward : acc, 0)} more
             </div>
         </div>

         <div className="space-y-3">
             {chores.map(chore => (
                 <div key={chore.id} className={`p-5 rounded-[2rem] border-2 transition-all ${
                     chore.status === ChoreStatus.COMPLETED ? 'bg-slate-50 border-slate-100 opacity-60' : 
                     chore.status === ChoreStatus.REVIEW ? 'bg-yellow-50 border-yellow-200' :
                     'bg-white border-slate-100 shadow-md hover:scale-[1.02]'
                 }`}>
                     <div className="flex justify-between items-center">
                         <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                chore.status === ChoreStatus.COMPLETED ? 'bg-green-100 text-green-600' : 'bg-brand-50 text-brand-600'
                            }`}>
                                <CheckCircle size={20} />
                            </div>
                             <div>
                                 <h4 className="font-bold text-slate-800 text-lg">{chore.title}</h4>
                                 <p className="text-sm text-slate-500 font-medium">
                                     <span className="text-green-600 font-bold">+₵{chore.reward}</span> reward
                                 </p>
                                 {chore.dueDate && (
                                     <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                         <Clock size={10} /> Due: {new Date(chore.dueDate).toLocaleDateString()}
                                     </p>
                                 )}
                             </div>
                         </div>
                         {chore.status === ChoreStatus.PENDING ? (
                             <button 
                                onClick={() => updateChoreStatus(chore.id, ChoreStatus.REVIEW)}
                                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-200"
                             >
                                Done
                             </button>
                         ) : (
                             <span className="px-3 py-1 bg-white/50 rounded-lg text-xs font-bold uppercase tracking-wide text-slate-500">
                                 {chore.status}
                             </span>
                         )}
                     </div>
                 </div>
             ))}
         </div>
    </div>
  );

  const renderSave = () => (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300 p-6 pt-12">
        <h1 className="font-display font-bold text-3xl text-slate-900">Savings Goals</h1>
        <div className="grid grid-cols-1 gap-4">
            {goals.map(goal => (
                <div key={goal.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-md">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-3xl">
                            {goal.emoji}
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400 font-bold uppercase">Target</p>
                            <p className="text-xl font-display font-bold text-slate-900">₵{goal.targetAmount}</p>
                        </div>
                    </div>
                    
                    <h3 className="font-bold text-slate-800 text-xl mb-2">{goal.title}</h3>
                    
                    <div className="relative pt-2">
                        <div className="flex justify-between text-sm font-bold mb-1">
                            <span className="text-brand-600">₵{goal.currentAmount}</span>
                            <span className="text-slate-400">{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                        </div>
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-brand-500 rounded-full transition-all duration-1000" 
                                style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Button fullWidth variant="primary" className="!py-2" onClick={() => addSavings(goal.id, 5)}>
                             Add ₵5
                        </Button>
                    </div>
                </div>
            ))}
            
            <button className="p-6 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Plus size={24} />
                </div>
                New Goal
            </button>
        </div>
      </div>
  );

  const renderLearn = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300 p-6 pt-12">
         <h1 className="font-display font-bold text-3xl text-slate-900">Missions</h1>
         
         <div className="grid grid-cols-1 gap-4">
            {missions.map(mission => (
                <div 
                    key={mission.id} 
                    onClick={() => handleStartMission(mission)}
                    className="bg-white p-1.5 rounded-[2rem] border border-slate-100 shadow-md hover:shadow-xl transition cursor-pointer group"
                >
                    <div className="bg-gradient-to-br from-brand-50 to-white p-5 rounded-[1.7rem] flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
                        
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-brand-600 group-hover:scale-110 transition">
                                <Gamepad2 size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{mission.title}</h3>
                                <p className="text-xs text-slate-500 font-medium">{mission.description}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end relative z-10">
                            <span className="bg-yellow-400 text-yellow-950 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                                <Star size={12} fill="currentColor" /> {mission.reward} pts
                            </span>
                        </div>
                    </div>
                </div>
            ))}
         </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Content Area */}
      <main>
          {activeTab === 'home' && renderHome()}
          {activeTab === 'card' && renderCardPage()}
          {activeTab === 'earn' && renderEarn()}
          {activeTab === 'save' && renderSave()}
          {activeTab === 'learn' && renderLearn()}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-6 flex justify-around items-center z-40">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'home' ? 'text-brand-600' : 'text-slate-300 hover:text-slate-400'}`}
          >
              <Wallet size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Home</span>
          </button>
          <button 
             onClick={() => setActiveTab('card')}
             className={`flex flex-col items-center gap-1 transition ${activeTab === 'card' ? 'text-brand-600' : 'text-slate-300 hover:text-slate-400'}`}
          >
              <CreditCard size={24} strokeWidth={activeTab === 'card' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Card</span>
          </button>
          <button 
             onClick={() => setActiveTab('earn')}
             className={`flex flex-col items-center gap-1 transition ${activeTab === 'earn' ? 'text-brand-600' : 'text-slate-300 hover:text-slate-400'}`}
          >
              <CheckCircle size={24} strokeWidth={activeTab === 'earn' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Tasks</span>
          </button>
          <button 
             onClick={() => setActiveTab('save')}
             className={`flex flex-col items-center gap-1 transition ${activeTab === 'save' ? 'text-brand-600' : 'text-slate-300 hover:text-slate-400'}`}
          >
              <PiggyBank size={24} strokeWidth={activeTab === 'save' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Save</span>
          </button>
          <button 
             onClick={() => setActiveTab('learn')}
             className={`flex flex-col items-center gap-1 transition ${activeTab === 'learn' ? 'text-brand-600' : 'text-slate-300 hover:text-slate-400'}`}
          >
              <Gamepad2 size={24} strokeWidth={activeTab === 'learn' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Learn</span>
          </button>
      </nav>

      {/* Customize Modal */}
      <Modal isOpen={isCustomizeOpen} onClose={() => setIsCustomizeOpen(false)} title="Customize Your Card">
          <div className="space-y-6">
              <div className="flex justify-center py-6">
                   <div className={`w-56 h-36 ${settings.design.color} rounded-2xl relative shadow-xl transition-all duration-500 flex flex-col justify-between p-5`}>
                      <div className="w-10 h-7 bg-yellow-400/80 rounded-md"></div>
                      <div className="text-white/90 font-display font-bold text-xl tracking-widest shadow-black drop-shadow-md">
                          {settings.design.label}
                      </div>
                   </div>
              </div>
              
              <div>
                  <h4 className="font-bold text-slate-700 mb-3 text-sm">Pick a Color</h4>
                  <div className="flex gap-3 justify-center">
                      {['bg-slate-900', 'bg-brand-600', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500'].map(color => (
                          <button 
                              key={color}
                              onClick={() => updateCardSettings(currentUser!.id, { design: { ...settings.design, color } })}
                              className={`w-12 h-12 rounded-full ${color} border-4 transition-all ${settings.design.color === color ? 'border-white shadow-xl scale-110 ring-2 ring-slate-200' : 'border-transparent hover:scale-105'}`}
                          />
                      ))}
                  </div>
              </div>

              <div>
                  <h4 className="font-bold text-slate-700 mb-3 text-sm">Card Name</h4>
                  <input 
                      type="text" 
                      value={settings.design.label}
                      maxLength={12}
                      onChange={(e) => updateCardSettings(currentUser!.id, { design: { ...settings.design, label: e.target.value } })}
                      className="w-full p-4 rounded-xl border border-slate-200 font-bold text-slate-800 text-center uppercase outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
              </div>

              <Button fullWidth onClick={() => setIsCustomizeOpen(false)}>Looks Awesome!</Button>
          </div>
      </Modal>

      {/* Active Mission Overlay */}
      {activeMission && (
          <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6">
              <div className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 relative">
                   {/* Close Button */}
                   <button onClick={closeMission} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 z-10">
                       <X size={20} />
                   </button>

                   {!quizState ? (
                       <div className="p-10 flex flex-col items-center text-center gap-4">
                           <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                           <p className="font-bold text-slate-600">Loading your mission...</p>
                       </div>
                   ) : (
                       <div className="p-6">
                            <div className="bg-brand-50 rounded-2xl p-6 mb-6 text-center relative overflow-hidden">
                                <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-brand-200/50 rounded-full blur-xl"></div>
                                <h2 className="text-2xl font-display font-bold text-brand-900 mb-2 relative z-10">{quizState.title}</h2>
                                <p className="text-brand-800 leading-relaxed relative z-10">{quizState.content}</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-900 text-center">{quizState.quizQuestion}</h3>
                                <div className="space-y-2">
                                    {quizState.options.map((opt: string, i: number) => (
                                        <button 
                                            key={i}
                                            onClick={() => handleQuizAnswer(i)}
                                            disabled={quizResult !== null}
                                            className={`w-full p-4 rounded-xl font-bold text-sm transition-all border-2 ${
                                                quizResult === null 
                                                    ? 'bg-white border-slate-100 hover:border-brand-500 hover:text-brand-600 text-slate-600' 
                                                    : i === quizState.correctAnswer
                                                        ? 'bg-green-50 border-green-500 text-green-700'
                                                        : quizResult === 'wrong' && i !== quizState.correctAnswer // Don't highlight wrong answers unless selected? Simplified: highlight correct always
                                                            ? 'bg-white border-slate-100 text-slate-400 opacity-50'
                                                            : 'bg-white border-slate-100 text-slate-400'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {quizResult && (
                                <div className={`mt-6 p-4 rounded-xl text-center animate-in slide-in-from-bottom-4 ${quizResult === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    <p className="font-bold text-lg mb-1">
                                        {quizResult === 'correct' ? '🎉 Correct!' : '😅 Oops, try again next time!'}
                                    </p>
                                    {quizResult === 'correct' && (
                                        <p className="text-sm">You earned {activeMission.reward} points!</p>
                                    )}
                                    <Button fullWidth onClick={closeMission} className="mt-4">
                                        Continue
                                    </Button>
                                </div>
                            )}
                       </div>
                   )}
              </div>
          </div>
      )}
    </div>
  );
};
