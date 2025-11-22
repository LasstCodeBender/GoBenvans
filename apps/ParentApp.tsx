
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Modal, AmountDisplay } from '../components/Shared';
import { 
  Wallet, ShieldAlert, CheckCircle2, PlusCircle, Lock, Unlock, 
  TrendingUp, CreditCard, Ban, Sparkles, ChevronRight, ArrowRightLeft, Calendar,
  Banknote, Bell, AlertTriangle, Plus, UserPlus, Upload, Image as ImageIcon,
  Home, PieChart as PieChartIcon, Menu, Link as LinkIcon, Copy, Share2, Users, ChevronDown,
  Clock, ScanFace, UserCheck, ArrowRight
} from 'lucide-react';
import { generateChoreSuggestions } from '../services/geminiService';
import { ChoreStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AVATARS = ['🛹', '🎨', '⚽️', '🎮', '🚀', '🎸', '🦄', '🦖', '📚', '🍕'];
const COLORS = ['#7c3aed', '#fb7185', '#facc15', '#38bdf8', '#4ade80'];

// --- Onboarding Component ---
const OnboardingWizard: React.FC = () => {
    const { completeParentOnboarding } = useApp();
    const [step, setStep] = useState(0); // 0: Bio, 1: ID, 2: Success
    const [isLoading, setIsLoading] = useState(false);
    
    // Bio State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    
    // ID State
    const [idImage, setIdImage] = useState<string | null>(null);
    
    const handleNext = () => setStep(prev => prev + 1);

    const handleIdUpload = () => {
        setIsLoading(true);
        // Mock verification delay
        setTimeout(() => {
            setIdImage('mock_id');
            setIsLoading(false);
        }, 2000);
    };

    const handleFinalize = () => {
        completeParentOnboarding({ name: firstName, avatar: '👨‍💼' });
    };

    const steps = [
        // STEP 0: BIO
        (
            <form key="bio" onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6 animate-in slide-in-from-right duration-300">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Welcome! 👋</h1>
                    <p className="text-slate-500">Let's set up your parent account.</p>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">First Name</label>
                            <input 
                                required autoFocus
                                value={firstName} onChange={e => setFirstName(e.target.value)}
                                className="w-full p-4 rounded-2xl border border-slate-200 bg-white font-medium outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition" placeholder="e.g. Ama"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Last Name</label>
                            <input 
                                required
                                value={lastName} onChange={e => setLastName(e.target.value)}
                                className="w-full p-4 rounded-2xl border border-slate-200 bg-white font-medium outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition" placeholder="e.g. Osei"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mobile Number (MoMo)</label>
                        <input 
                            type="tel" required
                            value={phone} onChange={e => setPhone(e.target.value)}
                            className="w-full p-4 rounded-2xl border border-slate-200 bg-white font-medium outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition" placeholder="024 456 7890"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                        <input 
                            type="email" required
                            value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full p-4 rounded-2xl border border-slate-200 bg-white font-medium outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition" placeholder="you@example.com"
                        />
                    </div>
                </div>

                <Button fullWidth type="submit" className="mt-4">
                    Continue <ArrowRight size={18} />
                </Button>
            </form>
        ),
        // STEP 1: ID VERIFICATION
        (
            <div key="id" className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ScanFace size={32} />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">Verify Identity</h1>
                    <p className="text-slate-500">We need to verify it's really you. Please scan your Ghana Card or Government ID.</p>
                </div>

                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-[2rem] h-48 flex flex-col items-center justify-center relative overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                            <span className="text-sm font-bold text-brand-600">Verifying ID...</span>
                        </div>
                    ) : idImage ? (
                        <div className="text-center animate-in zoom-in">
                             <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                 <CheckCircle2 size={24} />
                             </div>
                             <p className="font-bold text-slate-800">Verification Complete</p>
                             <p className="text-xs text-slate-400">ID ending in ****8921</p>
                        </div>
                    ) : (
                        <button onClick={handleIdUpload} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-3 hover:bg-slate-100 transition">
                            <div className="bg-white p-3 rounded-xl shadow-sm"><ImageIcon className="text-slate-400" /></div>
                            <span className="font-bold text-slate-500 text-sm">Tap to Scan ID</span>
                        </button>
                    )}
                </div>

                <div className="flex gap-4">
                     <button onClick={() => setStep(0)} className="px-6 py-3 font-bold text-slate-400 hover:text-slate-600">Back</button>
                     <Button fullWidth onClick={handleNext} disabled={!idImage}>Verify & Continue</Button>
                </div>
            </div>
        ),
        // STEP 2: SUCCESS
        (
            <div key="success" className="space-y-8 animate-in zoom-in duration-500 text-center py-8">
                 <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100">
                     <UserCheck size={48} />
                 </div>
                 <div>
                     <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">You're All Set!</h1>
                     <p className="text-slate-500">Your account has been created and verified. You can now add your children and start managing.</p>
                 </div>
                 <Button fullWidth onClick={handleFinalize} size="lg" className="shadow-xl shadow-brand-200">
                     Go to Dashboard
                 </Button>
            </div>
        )
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-lg p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                {/* Step Indicator */}
                <div className="flex justify-center gap-2 mb-8">
                    {[0, 1, 2].map(i => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-brand-600' : 'w-2 bg-slate-200'}`}></div>
                    ))}
                </div>
                {steps[step]}
            </div>
        </div>
    );
};

// --- Main Parent Dashboard (Original Content) ---
const ParentDashboard: React.FC = () => {
  const { children, activeChildId, setActiveChild, addChild, transactions, chores, goals, cardSettings, updateCardSettings, updateChoreStatus, addChore, transferMoney, withdrawSavings, parent } = useApp();
  
  const [activeTab, setActiveTab] = useState<'home' | 'kids' | 'analytics' | 'more'>('home');

  const activeChild = children.find(c => c.id === activeChildId) || children[0];
  const childTransactions = transactions.filter(t => t.userId === activeChild.id);
  const childChores = chores.filter(c => c.assigneeId === activeChild.id);
  const childGoals = goals.filter(g => g.ownerId === activeChild.id);
  const settings = cardSettings[activeChild.id];

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isChoreModalOpen, setIsChoreModalOpen] = useState(false);
  const [isAllowanceModalOpen, setIsAllowanceModalOpen] = useState(false);
  const [isControlsModalOpen, setIsControlsModalOpen] = useState(false);
  
  // Add Child State
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [newChildFirstName, setNewChildFirstName] = useState('');
  const [newChildLastName, setNewChildLastName] = useState('');
  const [newChildDob, setNewChildDob] = useState('');
  const [newChildImage, setNewChildImage] = useState<string | null>(null);
  
  // Payment Link State
  const [isPaymentLinkOpen, setIsPaymentLinkOpen] = useState(false);
  const [paymentLinkAmount, setPaymentLinkAmount] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Chore Creation State
  const [newChoreTitle, setNewChoreTitle] = useState('');
  const [newChoreReward, setNewChoreReward] = useState('5');
  const [newChoreDueDate, setNewChoreDueDate] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleAiSuggest = async () => {
    setIsLoadingAi(true);
    const suggestions = await generateChoreSuggestions(10, ['gaming', 'skateboarding']);
    setAiSuggestions(suggestions);
    setIsLoadingAi(false);
  };

  const handleAddChore = () => {
    if (newChoreTitle) {
        addChore(newChoreTitle, parseFloat(newChoreReward), activeChild.id, newChoreDueDate);
        setNewChoreTitle('');
        setNewChoreDueDate('');
        setIsChoreModalOpen(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewChildImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleAddChild = () => {
      if (newChildFirstName && newChildLastName && newChildDob) {
          const finalImage = newChildImage || AVATARS[0];
          addChild(newChildFirstName, newChildLastName, newChildDob, finalImage);
          setIsAddChildOpen(false);
          setNewChildFirstName('');
          setNewChildLastName('');
          setNewChildDob('');
          setNewChildImage(null);
      }
  };

  const toggleCategory = (category: string) => {
      const current = settings.blockedCategories;
      const updated = current.includes(category) 
        ? current.filter(c => c !== category)
        : [...current, category];
      updateCardSettings(activeChild.id, { blockedCategories: updated });
  };

  const generatePaymentLink = () => {
      setGeneratedLink(`https://pennypilot.app/pay/${activeChild.id}/${Date.now()}`);
  };

  // --- VIEW RENDERERS ---

  const renderHomeView = () => {
      const totalFamilyBalance = children.reduce((acc, child) => acc + (child.balance || 0), 0);
      
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
             {/* Header */}
             <div className="bg-brand-900 p-6 pb-12 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6 text-brand-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-800 rounded-full flex items-center justify-center border border-brand-700">
                                <span className="text-lg">👨‍💼</span>
                            </div>
                            <span className="font-bold">Hi, {parent.name}</span>
                        </div>
                        <button className="p-2 bg-brand-800 rounded-full hover:bg-brand-700 transition relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-brand-900"></span>
                        </button>
                    </div>
                    
                    <div className="text-center mb-4">
                        <p className="text-brand-300 text-sm font-bold uppercase tracking-widest mb-1">Total Family Balance</p>
                        <h1 className="text-5xl font-display font-bold text-white tracking-tight">₵{totalFamilyBalance.toFixed(2)}</h1>
                    </div>

                    <div className="flex justify-center gap-3">
                        <button onClick={() => setIsAddChildOpen(true)} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition border border-white/10">
                            <UserPlus size={16} /> Add Child
                        </button>
                        <button onClick={() => setActiveTab('more')} className="bg-white text-brand-900 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-brand-900/20 hover:bg-brand-50">
                            <LinkIcon size={16} /> Get Link
                        </button>
                    </div>
                </div>
             </div>

             {/* Children List */}
             <div className="px-6 -mt-8 relative z-20">
                 <h3 className="font-bold text-slate-900 mb-3 px-1">Your Kids</h3>
                 <div className="space-y-3">
                     {children.map(child => (
                         <div 
                            key={child.id} 
                            onClick={() => { setActiveChild(child.id); setActiveTab('kids'); }}
                            className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-md flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform"
                         >
                             <div className="flex items-center gap-4">
                                 <div className="w-14 h-14 rounded-full bg-brand-50 text-2xl flex items-center justify-center border-4 border-white shadow-sm">
                                     {child.avatar.startsWith('data:') ? <img src={child.avatar} className="w-full h-full object-cover rounded-full" /> : child.avatar}
                                 </div>
                                 <div>
                                     <h4 className="font-bold text-slate-800">{child.name}</h4>
                                     <p className="text-xs text-slate-500 font-medium">
                                         Card: <span className={cardSettings[child.id].isFrozen ? 'text-red-500' : 'text-green-500'}>
                                             {cardSettings[child.id].isFrozen ? 'Frozen' : 'Active'}
                                         </span>
                                     </p>
                                 </div>
                             </div>
                             <div className="text-right">
                                 <span className="block font-display font-bold text-lg text-slate-900">₵{child.balance?.toFixed(2)}</span>
                                 <ChevronRight size={16} className="inline-block text-slate-300" />
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
             
             {/* Recent Alerts / Insights */}
             <div className="px-6 pb-6">
                 <h3 className="font-bold text-slate-900 mb-3 px-1">Insights</h3>
                 <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                     <div className="flex gap-3 items-start">
                         <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full mt-1">
                             <Sparkles size={14} />
                         </div>
                         <div>
                             <p className="text-sm font-bold text-slate-800">Allowance coming up</p>
                             <p className="text-xs text-slate-500">Weekly allowance for {children.length} kids is due this Friday.</p>
                         </div>
                     </div>
                     <div className="w-full h-px bg-slate-50"></div>
                     <div className="flex gap-3 items-start">
                         <div className="p-2 bg-green-100 text-green-600 rounded-full mt-1">
                             <TrendingUp size={14} />
                         </div>
                         <div>
                             <p className="text-sm font-bold text-slate-800">Saving Champion</p>
                             <p className="text-xs text-slate-500">{activeChild.name} reached 50% of their Skateboard goal!</p>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
      );
  };

  const renderKidsView = () => (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Header */}
        <header className="bg-brand-900 sticky top-0 z-30 border-b border-brand-800 shadow-lg">
            <div className="bg-brand-600 px-6 py-1 text-[10px] font-bold text-center text-white uppercase tracking-widest flex items-center justify-center gap-2">
                <Sparkles size={10} /> 28 Days remaining in your Family Plus Trial
            </div>
            
            <div className="px-4 py-4">
                <div className="flex items-center justify-between mb-4 text-white">
                     <h1 className="text-lg font-bold font-display">Management</h1>
                </div>
                
                {/* Child Switcher */}
                <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-2">
                    {children.map(child => (
                        <button 
                            key={child.id}
                            onClick={() => setActiveChild(child.id)}
                            className={`flex flex-col items-center gap-1 transition-all min-w-[60px] ${activeChildId === child.id ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-80'}`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 relative shadow-md overflow-hidden ${activeChildId === child.id ? 'bg-brand-700 border-brand-400' : 'bg-brand-800 border-transparent'}`}>
                                {child.avatar.startsWith('data:') ? (
                                    <img src={child.avatar} alt={child.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{child.avatar}</span>
                                )}
                                {activeChildId === child.id && (
                                    <div className="absolute -bottom-1 bg-brand-400 w-full h-1 rounded-full"></div>
                                )}
                            </div>
                            <span className="text-[10px] font-bold text-white truncate w-full text-center">{child.name}</span>
                        </button>
                    ))}
                    <button 
                        onClick={() => setIsAddChildOpen(true)}
                        className="flex flex-col items-center gap-1 transition-all min-w-[60px] opacity-60 hover:opacity-100 group"
                    >
                        <div className="w-12 h-12 rounded-full bg-brand-800 border-2 border-dashed border-brand-600 flex items-center justify-center text-brand-400 group-hover:bg-brand-700 group-hover:text-white group-hover:border-brand-400">
                            <Plus size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-brand-300 group-hover:text-white">Add</span>
                    </button>
                </div>
            </div>
        </header>

        <div className="p-6 space-y-6 pb-24">
             {/* Balance Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-brand-700 to-brand-900 text-white border-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <p className="text-brand-200 text-sm font-medium mb-1">{activeChild.name}'s Balance</p>
                            <h2 className="text-4xl font-display font-bold tracking-tight">
                                <AmountDisplay amount={activeChild.balance || 0} className="text-white" />
                            </h2>
                        </div>
                        <button onClick={() => setIsTransferOpen(true)} className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition text-white">
                            <PlusCircle size={24} />
                        </button>
                    </div>
                    <div className="flex gap-3 relative z-10">
                        <button onClick={() => setActiveTab('analytics')} className="flex-1 bg-white/10 hover:bg-white/20 transition py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-white/10">
                            <TrendingUp size={16} /> Analytics
                        </button>
                        <button 
                            onClick={() => updateCardSettings(activeChild.id, { isFrozen: !settings.isFrozen })}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition border ${
                                settings.isFrozen 
                                ? 'bg-red-500/80 text-white border-red-500' 
                                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                            }`}
                        >
                            {settings.isFrozen ? <Lock size={16} /> : <Unlock size={16} />}
                            {settings.isFrozen ? 'Unfreeze' : 'Freeze'}
                        </button>
                    </div>
                </Card>

                {/* Quick Controls & Allowance */}
                <div className="space-y-4">
                    {/* Allowance Card */}
                    <Card className="cursor-pointer hover:shadow-md transition group" onClick={() => setIsAllowanceModalOpen(true)}>
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="p-2.5 bg-green-100 text-green-600 rounded-xl group-hover:scale-110 transition">
                                     <Banknote size={20} />
                                 </div>
                                 <div>
                                     <h3 className="font-bold text-slate-800 text-sm">Pocket Money</h3>
                                     <p className="text-xs text-slate-500">
                                         {settings.allowance.active 
                                            ? `₵${settings.allowance.amount} every ${settings.allowance.day}`
                                            : 'Not configured'}
                                     </p>
                                 </div>
                             </div>
                             <ChevronRight size={16} className="text-slate-300" />
                        </div>
                    </Card>

                    {/* Controls Card */}
                    <Card className="cursor-pointer hover:shadow-md transition group" onClick={() => setIsControlsModalOpen(true)}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                                <ShieldAlert className="text-brand-600" size={16} /> Controls
                            </h3>
                            <ChevronRight size={16} className="text-slate-300" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-sm text-red-500">
                                        <Ban size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">Blocked</span>
                                </div>
                                <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">{settings.blockedCategories.length} Active</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

             {/* Savings Oversight */}
             <section>
                 <h3 className="font-bold text-slate-900 text-lg mb-4 px-1 flex items-center justify-between">
                    <span>Savings Oversight</span>
                 </h3>
                 <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                     {childGoals.length === 0 ? (
                         <div className="p-8 text-center text-slate-400 text-sm">
                             No savings goals for {activeChild.name} yet.
                         </div>
                     ) : (
                         childGoals.map((goal, i) => (
                             <div key={goal.id} className={`p-5 ${i !== childGoals.length - 1 ? 'border-b border-slate-50' : ''}`}>
                                 <div className="flex items-center justify-between mb-2">
                                     <div className="flex items-center gap-3">
                                         <span className="text-2xl">{goal.emoji}</span>
                                         <div>
                                             <h4 className="font-bold text-slate-800 text-sm">{goal.title}</h4>
                                             <p className="text-xs text-slate-500">Target: ₵{goal.targetAmount}</p>
                                         </div>
                                     </div>
                                     <div className="text-right">
                                         <span className="font-bold text-brand-600 block">₵{goal.currentAmount}</span>
                                         <span className="text-[10px] text-slate-400">Saved</span>
                                     </div>
                                 </div>
                                 <div className="flex items-center justify-between mt-3 gap-4">
                                     <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                         <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}></div>
                                     </div>
                                     {goal.currentAmount > 0 && (
                                         <button 
                                            onClick={() => withdrawSavings(goal.id, goal.currentAmount)}
                                            className="text-[10px] font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition border border-transparent hover:border-red-100"
                                         >
                                             Withdraw All
                                         </button>
                                     )}
                                 </div>
                             </div>
                         ))
                     )}
                 </div>
            </section>

             {/* Chores Approval */}
            <section>
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-bold text-slate-900 text-lg">Chore Management</h3>
                    <Button variant="secondary" className="!py-1.5 !px-3 text-xs" onClick={() => setIsChoreModalOpen(true)}>
                        <PlusCircle size={14} /> New Chore
                    </Button>
                </div>
                <div className="space-y-3">
                    {childChores.length === 0 && (
                        <div className="text-center py-10 bg-white rounded-[2rem] border border-dashed border-slate-200 text-slate-400">
                            <Sparkles className="mx-auto mb-2 opacity-50" />
                            No active chores for {activeChild.name}.
                        </div>
                    )}
                    {childChores.map(chore => (
                        <div key={chore.id} className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-slate-50 ${
                                    chore.status === ChoreStatus.COMPLETED ? 'bg-green-100 text-green-600' : 
                                    chore.status === ChoreStatus.REVIEW ? 'bg-yellow-100 text-yellow-600' : 
                                    'bg-slate-100 text-slate-400'
                                }`}>
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{chore.title}</h4>
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                        Reward: <span className="text-green-600 font-bold">₵{chore.reward}</span>
                                    </p>
                                    {chore.dueDate && (
                                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                            <Clock size={10} /> Due: {new Date(chore.dueDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {chore.status === ChoreStatus.REVIEW ? (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => updateChoreStatus(chore.id, ChoreStatus.COMPLETED)}
                                        className="px-3 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => updateChoreStatus(chore.id, ChoreStatus.PENDING)}
                                        className="px-3 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition"
                                    >
                                        Reject
                                    </button>
                                </div>
                            ) : (
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${
                                    chore.status === ChoreStatus.COMPLETED ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    {chore.status}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </section>

             {/* Recent Transactions */}
            <section>
                <h3 className="font-bold text-slate-900 text-lg mb-4 px-1">Recent Activity</h3>
                <Card className="p-0 overflow-hidden">
                    {childTransactions.length === 0 ? (
                         <div className="p-8 text-center text-slate-400 text-sm">No recent activity.</div>
                    ) : (
                        childTransactions.slice(0, 5).map((t, i) => (
                            <div key={t.id} className={`flex items-center justify-between p-5 ${i !== childTransactions.length -1 ? 'border-b border-slate-50' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        t.type === 'spend' ? 'bg-slate-100 text-slate-500' : 'bg-green-50 text-green-600'
                                    }`}>
                                        {t.type === 'spend' ? <Wallet size={18} /> : <Sparkles size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{t.description}</p>
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <Calendar size={10} /> {t.date}
                                        </p>
                                    </div>
                                </div>
                                <AmountDisplay amount={t.amount} className={`text-sm ${t.amount > 0 ? 'text-green-600' : 'text-slate-900'}`} />
                            </div>
                        ))
                    )}
                </Card>
            </section>
        </div>
      </div>
  );

  const renderAnalyticsView = () => {
     // Mock Data for Charts
     const spendingData = [
        { name: 'Mon', amount: 5 },
        { name: 'Tue', amount: 12 },
        { name: 'Wed', amount: 8 },
        { name: 'Thu', amount: 20 },
        { name: 'Fri', amount: 15 },
        { name: 'Sat', amount: 25 },
        { name: 'Sun', amount: 10 },
     ];

     const categoryData = [
        { name: 'Gaming', value: 45 },
        { name: 'Food', value: 30 },
        { name: 'Toys', value: 15 },
        { name: 'Transport', value: 10 },
     ];

     return (
        <div className="p-6 pb-24 space-y-8 animate-in fade-in duration-300">
             <header className="mb-6">
                 <h1 className="font-display font-bold text-2xl text-slate-900">Analytics</h1>
                 <p className="text-slate-500">Spending breakdown for {activeChild.name}</p>
             </header>

             <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                 <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <PieChartIcon size={18} className="text-brand-600" /> Spending Categories
                 </h3>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={categoryData} 
                                innerRadius={60} 
                                outerRadius={80} 
                                paddingAngle={5} 
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex justify-center gap-4 flex-wrap">
                     {categoryData.map((entry, index) => (
                         <div key={index} className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                             <span className="text-xs font-bold text-slate-600">{entry.name}</span>
                         </div>
                     ))}
                 </div>
             </div>

             <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                 <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <TrendingUp size={18} className="text-brand-600" /> Weekly Activity
                 </h3>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={spendingData}>
                            <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                            <YAxis hide />
                            <Tooltip cursor={{fill: '#f5f3ff'}} />
                            <Bar dataKey="amount" fill="#7c3aed" radius={[6, 6, 6, 6]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
             </div>
        </div>
     );
  };

  const renderMoreView = () => (
      <div className="p-6 space-y-6 pb-24 animate-in fade-in duration-300">
          <h1 className="font-display font-bold text-2xl text-slate-900">More Options</h1>
          
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <button 
                onClick={() => setIsPaymentLinkOpen(true)}
                className="w-full flex items-center justify-between p-5 border-b border-slate-50 hover:bg-slate-50 transition"
              >
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
                          <LinkIcon size={20} />
                      </div>
                      <div className="text-left">
                          <h4 className="font-bold text-slate-800">Create Payment Link</h4>
                          <p className="text-xs text-slate-500">Let family send money easily</p>
                      </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
              </button>
              <button className="w-full flex items-center justify-between p-5 border-b border-slate-50 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Users size={20} />
                      </div>
                      <div className="text-left">
                          <h4 className="font-bold text-slate-800">Co-Parenting</h4>
                          <p className="text-xs text-slate-500">Invite a partner</p>
                      </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
              </button>
              <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                          <Lock size={20} />
                      </div>
                      <div className="text-left">
                          <h4 className="font-bold text-slate-800">App PIN</h4>
                          <p className="text-xs text-slate-500">Secure your account</p>
                      </div>
                  </div>
                  <div className="w-10 h-5 bg-brand-600 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
              </button>
          </div>
      </div>
  );

  if (!activeChild || !settings) return <div>Loading...</div>;

  return (
    <div className="bg-slate-50 min-h-screen relative">
      
      {activeTab === 'home' && renderHomeView()}
      {activeTab === 'kids' && renderKidsView()}
      {activeTab === 'analytics' && renderAnalyticsView()}
      {activeTab === 'more' && renderMoreView()}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-6 flex justify-around items-center z-40">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'home' ? 'text-brand-600' : 'text-slate-300 hover:text-slate-400'}`}
          >
              <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Home</span>
          </button>
          <button 
             onClick={() => setActiveTab('kids')}
             className={`flex flex-col items-center gap-1 transition ${activeTab === 'kids' ? 'text-brand-600' : 'text-slate-300 hover:text-slate-400'}`}
          >
              <Users size={24} strokeWidth={activeTab === 'kids' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Kids</span>
          </button>
          <button 
             onClick={() => setActiveTab('analytics')}
             className={`flex flex-col items-center gap-1 transition ${activeTab === 'analytics' ? 'text-brand-600' : 'text-slate-300 hover:text-slate-400'}`}
          >
              <PieChartIcon size={24} strokeWidth={activeTab === 'analytics' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Analytics</span>
          </button>
          <button 
             onClick={() => setActiveTab('more')}
             className={`flex flex-col items-center gap-1 transition ${activeTab === 'more' ? 'text-brand-600' : 'text-slate-300 hover:text-slate-400'}`}
          >
              <Menu size={24} strokeWidth={activeTab === 'more' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">More</span>
          </button>
      </nav>

      {/* --- MODALS --- */}

      {/* Add Child Modal */}
      <Modal isOpen={isAddChildOpen} onClose={() => setIsAddChildOpen(false)} title="Add New Child">
          <div className="space-y-5">
              <div className="flex justify-center">
                  <div onClick={() => fileInputRef.current?.click()} className="relative group cursor-pointer">
                      <div className={`w-28 h-28 rounded-full flex items-center justify-center border-4 border-dashed border-slate-200 overflow-hidden transition-all hover:border-brand-400 hover:bg-slate-50 ${newChildImage ? 'border-solid border-brand-200' : ''}`}>
                          {newChildImage ? <img src={newChildImage} alt="Preview" className="w-full h-full object-cover" /> : <div className="text-center p-2"><ImageIcon className="mx-auto text-slate-300 mb-1" size={24} /><p className="text-[10px] font-bold text-slate-400 uppercase">Upload Photo</p></div>}
                      </div>
                      <div className="absolute bottom-0 right-0 bg-brand-600 p-2 rounded-full text-white shadow-lg border-2 border-white"><Upload size={14} /></div>
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*"/>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">First Name</label>
                      <input value={newChildFirstName} onChange={(e) => setNewChildFirstName(e.target.value)} placeholder="e.g. Sophie" className="w-full p-3.5 rounded-2xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition font-bold text-slate-800 text-sm"/>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Last Name</label>
                      <input value={newChildLastName} onChange={(e) => setNewChildLastName(e.target.value)} placeholder="e.g. Smith" className="w-full p-3.5 rounded-2xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition font-bold text-slate-800 text-sm"/>
                  </div>
              </div>
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Date of Birth</label>
                  <input type="date" value={newChildDob} onChange={(e) => setNewChildDob(e.target.value)} className="w-full p-3.5 rounded-2xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition font-bold text-slate-800 text-sm"/>
              </div>
              <Button fullWidth onClick={handleAddChild} disabled={!newChildFirstName || !newChildLastName || !newChildDob}><UserPlus size={18} /> Create Account</Button>
          </div>
      </Modal>

      {/* Transfer Modal */}
      <Modal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} title={`Send Money to ${activeChild.name}`}>
        <div className="space-y-6">
            <div className="bg-brand-50 p-8 rounded-[2rem] text-center border border-brand-100">
                <span className="text-brand-400 text-xs font-bold uppercase tracking-wider block mb-2">Enter Amount</span>
                <div className="flex items-center justify-center gap-1">
                    <span className="text-4xl text-brand-300 font-bold">₵</span>
                    <input type="number" placeholder="10.00" className="text-5xl font-display font-bold bg-transparent text-center w-40 outline-none text-brand-900 placeholder-brand-200" autoFocus />
                </div>
            </div>
            <div className="flex gap-3">
                {[5, 10, 20, 50].map(amt => (
                    <button key={amt} onClick={() => { transferMoney(amt, 'p1', activeChild.id); setIsTransferOpen(false); }} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50 transition">
                        ₵{amt}
                    </button>
                ))}
            </div>
            <Button fullWidth onClick={() => { transferMoney(10, 'p1', activeChild.id); setIsTransferOpen(false); }}>Send Instantly</Button>
        </div>
      </Modal>

      {/* Payment Link Modal */}
      <Modal isOpen={isPaymentLinkOpen} onClose={() => { setIsPaymentLinkOpen(false); setGeneratedLink(''); setPaymentLinkAmount(''); }} title="Create Payment Link">
          <div className="space-y-6">
              {!generatedLink ? (
                  <>
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amount (Optional)</label>
                        <div className="flex items-center gap-2">
                             <span className="text-2xl font-bold text-slate-400">₵</span>
                             <input 
                                value={paymentLinkAmount}
                                onChange={(e) => setPaymentLinkAmount(e.target.value)}
                                placeholder="0.00"
                                type="number"
                                className="bg-transparent text-3xl font-bold text-slate-900 outline-none w-full placeholder-slate-300"
                             />
                        </div>
                    </div>
                    <Button fullWidth onClick={generatePaymentLink}><LinkIcon size={18} /> Generate Link</Button>
                  </>
              ) : (
                  <div className="space-y-4 animate-in zoom-in duration-200">
                      <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 text-center">
                          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                              <CheckCircle2 size={24} />
                          </div>
                          <h3 className="font-bold text-green-900">Link Ready!</h3>
                          <p className="text-xs text-green-700 mt-1">Anyone with this link can send money to {activeChild.name}.</p>
                      </div>
                      <div className="flex gap-2">
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-500 font-mono truncate flex-1">
                              {generatedLink}
                          </div>
                          <button className="bg-slate-200 hover:bg-slate-300 p-3 rounded-xl text-slate-600"><Copy size={18} /></button>
                      </div>
                      <Button fullWidth variant="secondary" onClick={() => { /* Share logic */ }}><Share2 size={18} /> Share Link</Button>
                  </div>
              )}
          </div>
      </Modal>

      {/* Allowance Modal */}
      <Modal isOpen={isAllowanceModalOpen} onClose={() => setIsAllowanceModalOpen(false)} title={`${activeChild.name}'s Pocket Money`}>
          <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-700">Enable Allowance</span>
                  <button 
                    onClick={() => updateCardSettings(activeChild.id, { allowance: { ...settings.allowance, active: !settings.allowance.active } })}
                    className={`w-12 h-7 rounded-full transition-colors relative ${settings.allowance.active ? 'bg-brand-600' : 'bg-slate-300'}`}
                  >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${settings.allowance.active ? 'left-6' : 'left-1'}`}></div>
                  </button>
              </div>
              
              {settings.allowance.active && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Weekly Amount</label>
                          <div className="flex gap-2">
                              {[5, 10, 15, 20].map(amt => (
                                  <button 
                                    key={amt}
                                    onClick={() => updateCardSettings(activeChild.id, { allowance: { ...settings.allowance, amount: amt } })}
                                    className={`flex-1 py-2 rounded-xl font-bold text-sm border ${settings.allowance.amount === amt ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200'}`}
                                  >
                                      ₵{amt}
                                  </button>
                              ))}
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Payday</label>
                          <select 
                            value={settings.allowance.day}
                            onChange={(e) => updateCardSettings(activeChild.id, { allowance: { ...settings.allowance, day: e.target.value } })}
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 outline-none focus:border-brand-500"
                          >
                              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                  <option key={day} value={day}>{day}</option>
                              ))}
                          </select>
                      </div>
                  </div>
              )}
              <Button fullWidth onClick={() => setIsAllowanceModalOpen(false)}>Save Settings</Button>
          </div>
      </Modal>

      {/* Controls Modal */}
      <Modal isOpen={isControlsModalOpen} onClose={() => setIsControlsModalOpen(false)} title="Spending Controls">
          <div className="space-y-6">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3 items-start">
                  <AlertTriangle className="text-orange-500 shrink-0" size={20} />
                  <p className="text-xs text-orange-800 font-medium leading-relaxed">
                      These settings update instantly on {activeChild.name}'s card. Blocking categories will prevent transactions.
                  </p>
              </div>

              <div>
                  <h4 className="font-bold text-slate-900 mb-3 text-sm">Category Blocking</h4>
                  <div className="space-y-2">
                      {['Gambling', 'Adult', 'Tobacco', 'Liquor', 'Video Games'].map(cat => {
                          const isBlocked = settings.blockedCategories.includes(cat);
                          return (
                              <div key={cat} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                  <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-lg ${isBlocked ? 'bg-red-100 text-red-600' : 'bg-white text-slate-400'}`}>
                                          <Ban size={16} />
                                      </div>
                                      <span className={`text-sm font-bold ${isBlocked ? 'text-slate-800' : 'text-slate-500'}`}>{cat}</span>
                                  </div>
                                  <button 
                                    onClick={() => toggleCategory(cat)}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${isBlocked ? 'bg-red-500' : 'bg-slate-300'}`}
                                  >
                                      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${isBlocked ? 'left-6' : 'left-1'}`}></div>
                                  </button>
                              </div>
                          );
                      })}
                  </div>
              </div>
              
              <div>
                   <h4 className="font-bold text-slate-900 mb-3 text-sm">Spending Limits</h4>
                   <div className="p-4 bg-white border border-slate-200 rounded-xl">
                       <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Daily Limit</label>
                       <div className="flex items-center gap-2">
                           <span className="text-2xl font-bold text-slate-800">₵</span>
                           <input 
                              type="number" 
                              value={settings.dailyLimit}
                              onChange={(e) => updateCardSettings(activeChild.id, { dailyLimit: parseInt(e.target.value) || 0 })}
                              className="text-2xl font-bold text-slate-800 w-full outline-none border-b border-slate-200 focus:border-brand-500"
                           />
                       </div>
                   </div>
              </div>

              <Button fullWidth onClick={() => setIsControlsModalOpen(false)}>Apply Controls</Button>
          </div>
      </Modal>

      {/* Add Chore Modal */}
      <Modal isOpen={isChoreModalOpen} onClose={() => setIsChoreModalOpen(false)} title={`Assign Chore to ${activeChild.name}`}>
         <div className="space-y-4">
             <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Chore Title</label>
                 <input 
                    value={newChoreTitle}
                    onChange={(e) => setNewChoreTitle(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition font-medium text-slate-800"
                    placeholder="e.g. Wash the car"
                 />
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Reward Amount</label>
                     <div className="relative">
                        <span className="absolute left-4 top-4 text-slate-400 font-bold">₵</span>
                        <input 
                            type="number"
                            value={newChoreReward}
                            onChange={(e) => setNewChoreReward(e.target.value)}
                            className="w-full p-4 pl-8 rounded-2xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition font-mono font-bold text-slate-800"
                        />
                     </div>
                 </div>
                 <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Due Date (Optional)</label>
                     <input 
                        type="date"
                        value={newChoreDueDate}
                        onChange={(e) => setNewChoreDueDate(e.target.value)}
                        className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition font-medium text-slate-800 text-sm"
                     />
                 </div>
             </div>
             
             {/* AI Section */}
             <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-2xl border border-indigo-100">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-indigo-800 flex items-center gap-1">
                        <Sparkles size={12} /> AI Suggestions
                    </h4>
                    <button onClick={handleAiSuggest} disabled={isLoadingAi} className="text-xs text-indigo-600 font-bold hover:text-indigo-800 disabled:opacity-50 transition">
                        {isLoadingAi ? 'Thinking...' : 'Generate Ideas'}
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {aiSuggestions.length > 0 ? aiSuggestions.map((s, i) => (
                        <button key={i} onClick={() => setNewChoreTitle(s)} className="text-xs bg-white text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-100 hover:border-indigo-300 hover:shadow-sm transition font-medium">
                            {s}
                        </button>
                    )) : (
                        <p className="text-xs text-indigo-400 italic">Tap generate to get ideas based on age & interests.</p>
                    )}
                </div>
             </div>

             <div className="pt-2">
                 <Button fullWidth onClick={handleAddChore} disabled={!newChoreTitle}>
                     Create Chore
                 </Button>
             </div>
         </div>
      </Modal>
    </div>
  );
};

// Main Export
export const ParentApp: React.FC = () => {
    const { isParentOnboarded } = useApp();
    return isParentOnboarded ? <ParentDashboard /> : <OnboardingWizard />;
};
