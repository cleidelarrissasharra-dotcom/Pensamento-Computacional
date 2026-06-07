import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Apple,
  Carrot,
  Leaf,
  Check,
  Trash2,
  Plus,
  Search,
  Hourglass,
  AlertTriangle,
  TrendingDown,
  RotateCcw,
  Sparkles,
  Clock,
  ArrowRight,
  Calendar,
  Terminal,
  ThumbsUp,
  CheckCircle,
  ShieldCheck,
  Package,
  Info,
  HelpCircle,
  BadgeAlert,
  Play,
  Volume2
} from 'lucide-react';
import { FLVItem, FLVType, ShelvingRecommendation, ComputationalPillarInfo } from './types';
import {
  getShelvingRecommendation,
  computationalPillars,
  initialFLVItems,
  FLV_ICONS
} from './utils';

export default function App() {
  // Inventory state
  const [items, setItems] = useState<FLVItem[]>(initialFLVItems);
  
  // Simulated hours elapsed since session start
  const [simulatedHoursElapsed, setSimulatedHoursElapsed] = useState<number>(0);
  
  // Search and category filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('Todos');
  const [selectedShelfFilter, setSelectedShelfFilter] = useState<'Todos' | 'verde' | 'amarelo' | 'vermelho'>('Todos');
  
  // Selected detail item for deep analytical check
  const [selectedItem, setSelectedItem] = useState<FLVItem | null>(initialFLVItems[0] || null);

  // Form states for adding new batch
  const [newProdName, setNewProdName] = useState('');
  const [newProdType, setNewProdType] = useState<FLVType>('Fruta');
  const [newProdHours, setNewProdHours] = useState<number>(48);
  const [newProdTotalLife, setNewProdTotalLife] = useState<number>(72);
  const [newProdQty, setNewProdQty] = useState<number>(10);
  const [newProdUnit, setNewProdUnit] = useState<'un' | 'kg' | 'pote' | 'bandeja' | 'g'>('un');
  const [newProdNotes, setNewProdNotes] = useState('');
  
  // Simulation terminal/logs states (emulating console.log from user logic)
  interface LogEntry {
    id: string;
    timestamp: string;
    type: 'success' | 'warning' | 'info' | 'danger';
    message: string;
    action: string;
  }
  
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-init-1',
      timestamp: '00:00h Sim.',
      type: 'info',
      message: 'Sistema SinalizaFLV inicializado com sucesso.',
      action: 'Carregando os parâmetros da central de FLV...'
    },
    {
      id: 'log-init-2',
      timestamp: '00:00h Sim.',
      type: 'success',
      message: '[ALERTA 🟢] O produto Abóbora Cabotiá Cubos tem apenas 72h restantes.',
      action: 'Ação recomendada: Armazenar na Prateleira A - Setor VERDE (Estoque Seguro).'
    },
    {
      id: 'log-init-3',
      timestamp: '00:00h Sim.',
      type: 'warning',
      message: '[ALERTA 🟡] O produto Melancia em Cubos Pote tem apenas 36h restantes.',
      action: 'Ação recomendada: Armazenar na Prateleira B - Setor AMARELO (Atenção: Prioridade Média).'
    },
    {
      id: 'log-init-4',
      timestamp: '00:00h Sim.',
      type: 'danger',
      message: '[ALERTA 🔴] O produto Salada Higienizada Coletiva tem apenas 8h restantes.',
      action: 'Ação recomendada: Armazenar na Prateleira C - Setor VERMELHO (Crítico: Expedição Imediata!).'
    }
  ]);

  // Computational Thinking active explaining slide
  const [activePillar, setActivePillar] = useState<number>(0);

  // Stats
  const stats = useMemo(() => {
    let green = 0;
    let yellow = 0;
    let red = 0;
    let expired = 0;

    items.forEach(item => {
      if (item.hoursRemaining <= 0) {
        expired++;
      } else if (item.hoursRemaining > 48) {
        green++;
      } else if (item.hoursRemaining <= 48 && item.hoursRemaining > 12) {
        yellow++;
      } else {
        red++;
      }
    });

    return { total: items.length, green, yellow, red, expired };
  }, [items]);

  // Triage logic matching the user's specifications & pushing custom visual feedback
  const livePreviewRecommendation = useMemo(() => {
    if (!newProdName) return null;
    return getShelvingRecommendation(newProdHours);
  }, [newProdName, newProdHours]);

  // Log function helper
  const addLogMessage = (type: 'success' | 'warning' | 'info' | 'danger', message: string, action: string) => {
    const timestamp = `+${simulatedHoursElapsed}h Sim.`;
    const newLogItem: LogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp,
      type,
      message,
      action
    };
    setLogs(prev => [newLogItem, ...prev].slice(0, 50)); // keep last 50 logs
  };

  // Simulation controls
  const handleAdvanceHours = (hours: number) => {
    setSimulatedHoursElapsed(prev => prev + hours);
    setItems(currentItems => {
      return currentItems.map(item => {
        const nextHours = Math.max(0, item.hoursRemaining - hours);
        
        // If status changed or items degraded, draft alert logs
        const oldRec = getShelvingRecommendation(item.hoursRemaining);
        const newRec = getShelvingRecommendation(nextHours);

        if (nextHours === 0 && item.hoursRemaining > 0) {
          addLogMessage(
            'danger', 
            `⚠️ [EXPIRADO] O lote de ${item.name} (${item.batchCode}) atingiu 0 horas de frescor residual!`,
            `Ação corretiva: Remover da área física imediatamente e destinar à compostagem.`
          );
        } else if (oldRec.sectorColor !== newRec.sectorColor) {
          const colorEmoji = newRec.sectorColor === 'vermelho' ? '🔴' : '🟡';
          addLogMessage(
            newRec.sectorColor === 'vermelho' ? 'danger' : 'warning',
            `[REMOÇÃO] ${item.name} degradou para ${nextHours}h. Alerta atualizado para ${colorEmoji}`,
            `Transferir fisicamente de ${oldRec.shelfName.split(' ')[0]} para ${newRec.shelfName}`
          );
        }

        return {
          ...item,
          hoursRemaining: nextHours
        };
      });
    });
  };

  // Pre-generate a random code
  const generateBatchCode = () => {
    const num = Math.floor(100 + Math.random() * 900);
    return `LOTE-FLV-${num}`;
  };

  // Add new item
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const code = generateBatchCode();
    const newItem: FLVItem = {
      id: `item-${Date.now()}`,
      name: newProdName.trim(),
      type: newProdType,
      batchCode: code,
      quantity: newProdQty,
      unit: newProdUnit,
      hoursRemaining: newProdHours,
      totalShelfLifeHours: newProdTotalLife,
      registrationDate: new Date().toISOString(),
      notes: newProdNotes.trim() || undefined
    };

    setItems(prev => [newItem, ...prev]);
    setSelectedItem(newItem);

    // Run user simulator log style!
    const recommendation = getShelvingRecommendation(newProdHours);
    addLogMessage(
      recommendation.sectorColor === 'verde' ? 'success' : recommendation.sectorColor === 'amarelo' ? 'warning' : 'danger',
      `[CADASTRO - ALERTA ${recommendation.alertEmoji}] O produto ${newItem.name} (${newItem.batchCode}) foi registrado com ${newItem.hoursRemaining}h restantes.`,
      `Ação recomendada: Armazenar na ${recommendation.shelfName}. Qtd: ${newItem.quantity} ${newItem.unit}.`
    );

    // Reset input fields
    setNewProdName('');
    setNewProdNotes('');
    setNewProdQty(10);
  };

  // Discard product
  const handleDeleteItem = (id: string, name: string) => {
    const itemToDelete = items.find(i => i.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
    addLogMessage(
      'info',
      `[BAIXA / DESCARTAR] Lote de ${name} foi removido do estoque ativo.`,
      `Ação física: Retirar e limpar gôndolas.`
    );
  };

  // Record sold / Shipped
  const handleShipItem = (id: string, name: string) => {
    const itemOpt = items.find(i => i.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
    addLogMessage(
      'success',
      `🎉 [SUCESSO - EXPEDIDO/VENDIDO] Lote de ${name} comercializado antes do vencimento!`,
      `Ação física: Higienizar gôndola e registrar no relatório de quebra mínima.`
    );
  };

  // Direct set hours to mock-simulate rapid adjustments
  const handleUpdateItemTime = (id: string, value: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextH = Math.max(0, value);
        const oldRec = getShelvingRecommendation(item.hoursRemaining);
        const newRec = getShelvingRecommendation(nextH);
        
        if (oldRec.sectorColor !== newRec.sectorColor) {
          addLogMessage(
            newRec.sectorColor === 'verde' ? 'success' : newRec.sectorColor === 'amarelo' ? 'warning' : 'danger',
            `[AJUSTE MANUAL] ${item.name} alterado manualmente para ${nextH}h.`,
            `Mover para ${newRec.shelfName}`
          );
        }
        
        const updated = { ...item, hoursRemaining: nextH };
        if (selectedItem?.id === id) {
          setSelectedItem(updated);
        }
        return updated;
      }
      return item;
    }));
  };

  // Reset inventory to original presets
  const handleResetInventory = () => {
    setItems(initialFLVItems);
    setSimulatedHoursElapsed(0);
    setSelectedItem(initialFLVItems[0]);
    setLogs([
      {
        id: `reset-log-${Date.now()}`,
        timestamp: '00:00h Sim.',
        type: 'info',
        message: 'Lista de lotes reiniciada aos padrões das centrais de FLV.',
        action: 'Relatórios limpos. Amostras recarregadas com sucesso.'
      }
    ]);
  };

  // Quick preset triggers to test specific scenarios
  const handleLoadCriticalScenario = () => {
    setItems([
      {
        id: "crit-1",
        name: "Abobrinha Italiana fatiada",
        type: "Legume",
        batchCode: "LOTE-FLV-CR1",
        quantity: 25,
        unit: "bandeja",
        hoursRemaining: 5,
        totalShelfLifeHours: 48,
        registrationDate: new Date().toISOString()
      },
      {
        id: "crit-2",
        name: "Rúcula Hidropônica Pote",
        type: "Verdura",
        batchCode: "LOTE-FLV-CR2",
        quantity: 15,
        unit: "pote",
        hoursRemaining: 11,
        totalShelfLifeHours: 36,
        registrationDate: new Date().toISOString()
      },
      {
        id: "crit-3",
        name: "Kiwi fatiado 150g",
        type: "Fruta",
        batchCode: "LOTE-FLV-CR3",
        quantity: 9,
        unit: "pote",
        hoursRemaining: 7,
        totalShelfLifeHours: 24,
        registrationDate: new Date().toISOString()
      }
    ]);
    setSelectedItem(null);
    addLogMessage(
      'danger',
      `🚨 [CENÁRIO CRÍTICO CARREGADO] Carregados 3 itens na "Zona Vermelha de Extrema Urgência".`,
      `Ação imediata recomendada: Posicionar sinalizadores físicos no setor vermelho!`
    );
  };

  // Filtered lists
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.batchCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedTypeFilter === 'Todos' || item.type === selectedTypeFilter;
      
      const rec = getShelvingRecommendation(item.hoursRemaining);
      const matchesShelf = selectedShelfFilter === 'Todos' || rec.sectorColor === selectedShelfFilter;
      
      return matchesSearch && matchesType && matchesShelf;
    });
  }, [items, searchTerm, selectedTypeFilter, selectedShelfFilter]);

  // Group items strictly by shelf position for physical layout rendering
  const shelfA_GreenItems = useMemo(() => items.filter(i => getShelvingRecommendation(i.hoursRemaining).sectorColor === 'verde'), [items]);
  const shelfB_YellowItems = useMemo(() => items.filter(i => getShelvingRecommendation(i.hoursRemaining).sectorColor === 'amarelo'), [items]);
  const shelfC_RedItems = useMemo(() => items.filter(i => getShelvingRecommendation(i.hoursRemaining).sectorColor === 'vermelho'), [items]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col">
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs" id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-200">
              <Leaf className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans" id="brand-title">
                  Sinaliza<span className="text-emerald-600 font-black">FLV</span>
                </h1>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono border border-slate-200">
                  v1.2.0-Alpha
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pilar do Pensamento Computacional para Prateleiras Físicas de hortifrútis
              </p>
            </div>
          </div>

          {/* Simulation Time Control Area */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg shadow-2xs">
              <Clock className="w-4 h-4 text-emerald-600" />
              <div className="text-xs font-mono font-bold text-slate-700">
                TEMPO SIMULADO: <span className="text-emerald-700 font-black">+{simulatedHoursElapsed} horas</span>
              </div>
            </div>

            <div className="flex gap-1">
              <button 
                onClick={() => handleAdvanceHours(1)}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
                title="Avança validades em -1 hora"
                id="btn-time-1"
              >
                <span>+1h</span>
                <TrendingDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button 
                onClick={() => handleAdvanceHours(12)}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
                title="Avança validades em -12 horas"
                id="btn-time-12"
              >
                <span>+12h</span>
                <TrendingDown className="w-3.5 h-3.5 text-orange-400" />
              </button>

              <button 
                onClick={handleResetInventory}
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-100 shadow-2xs transition active:scale-90 flex items-center gap-1 cursor-pointer"
                title="Restabelece os itens iniciais do supermercado"
                id="btn-reset-original"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reiniciar</span>
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* DASHBOARD GRID CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-main">
        
        {/* LEFT COLUMN (lg:col-span-4): Registration and Computational Education */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between" id="side-panel">
          
          {/* Cadastro de Novo Lote */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4" id="register-section">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
                <Plus className="w-5 h-5 font-bold" />
              </div>
              <div>
                <h2 className="text-md font-bold text-slate-900">Cadastrar Novo Lote FLV</h2>
                <p className="text-xs text-slate-500">Mapear produto e simular destino</p>
              </div>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nome do Produto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Abóbora Cabotiá Cubos, Rúcula..."
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  id="input-name"
                />
              </div>

              {/* Selection with visual badges */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tipo de Mercadoria</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Fruta', 'Legume', 'Verdura', 'Outro'] as FLVType[]).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setNewProdType(t)}
                      className={`py-1 px-1.5 text-xs font-medium rounded-lg border text-center transition cursor-pointer ${
                        newProdType === t 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <span className="block text-sm">{FLV_ICONS[t]}</span>
                      <span className="block text-[10px]">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProdQty}
                    onChange={(e) => setNewProdQty(Number(e.target.value))}
                    className="w-full text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    id="input-qty"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Unidade de Medida</label>
                  <select
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value as any)}
                    className="w-full text-sm px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    id="input-unit"
                  >
                    <option value="un">Unidade (un)</option>
                    <option value="kg">Quilo (kg)</option>
                    <option value="pote">Pote (pote)</option>
                    <option value="bandeja">Bandeja (bandeja)</option>
                    <option value="g">Grama (g)</option>
                  </select>
                </div>
              </div>

              {/* Shelf Life Hours Slider */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-600 flex items-center gap-1">
                    <Hourglass className="w-3.5 h-3.5 text-amber-500" />
                    Horas Restantes:
                  </span>
                  <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded font-black text-slate-800">
                    {newProdHours}h
                  </span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="120"
                  value={newProdHours}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setNewProdHours(value);
                    if (value > newProdTotalLife) {
                      setNewProdTotalLife(value);
                    }
                  }}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  id="input-hours-slider"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>🔴 Crítico (&le;12h)</span>
                  <span>🟡 Atenção (&le;48h)</span>
                  <span>🟢 Seguro (&gt;48h)</span>
                </div>
              </div>

              {/* Total Expected Shelf Life (total limit for display percent) */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Validade Máxima Esperada (Total Lote)</label>
                <div className="flex gap-2 items-center">
                  <select
                    value={newProdTotalLife}
                    onChange={(e) => setNewProdTotalLife(Number(e.target.value))}
                    className="flex-1 text-xs px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  >
                    <option value={24}>24 Horas (Curto)</option>
                    <option value={48}>48 Horas (Médio Curto)</option>
                    <option value={72}>72 Horas (Médio)</option>
                    <option value={120}>120 Horas (Longo)</option>
                    <option value={newProdHours > 120 ? newProdHours : 120}>Personalizado</option>
                  </select>
                  <span className="text-xs text-slate-400 font-mono">Total</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Notas / Observações Visuais (Opcional)</label>
                <textarea
                  placeholder="Ex: Verificar temperatura de resfriamento..."
                  value={newProdNotes}
                  onChange={(e) => setNewProdNotes(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 h-10 resize-none bg-white"
                  rows={2}
                />
              </div>

              {/* Live matching algorithm badge */}
              {livePreviewRecommendation && (
                <div className={`p-3 rounded-lg border text-xs leading-relaxed transition-all duration-300 ${livePreviewRecommendation.bgColor} ${livePreviewRecommendation.borderColor} ${livePreviewRecommendation.textColor}`}>
                  <div className="flex items-center gap-1 font-bold font-sans">
                    <span>{livePreviewRecommendation.alertEmoji}</span>
                    <span>Destinação de Triagem Real-Time:</span>
                  </div>
                  <div className="mt-1 font-black font-mono">
                    {livePreviewRecommendation.shelfName}
                  </div>
                  <div className="mt-1 text-[11px] opacity-90 leading-tight">
                    {livePreviewRecommendation.actionText}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                id="submit-new-batch"
              >
                <Plus className="w-4 h-4" />
                Registrar e Rotear Lote FC
              </button>
            </form>
          </div>

          {/* Pensamento Computacional Explainer */}
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-5 flex-1 mt-6 flex flex-col justify-between" id="educational-card">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-extrabold tracking-tight">Pensamento Computacional</h3>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-950/70 border border-emerald-800 text-emerald-400 rounded-full font-bold">
                  FLV & Tecnologia
                </span>
              </div>
              
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                A triagem do SinalizaFLV é modelada nos pilares que auxiliam alunos e gestores a conectar algoritmos com ações mercadológicas:
              </p>

              {/* Tab options per pillar */}
              <div className="grid grid-cols-4 gap-1 mt-3">
                {[1, 2, 3, 4].map((num, idx) => (
                  <button
                    key={num}
                    onClick={() => setActivePillar(idx)}
                    className={`py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                      activePillar === idx 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    P{num}
                  </button>
                ))}
              </div>

              {/* Active description */}
              <div className="mt-4 p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl space-y-1.5 min-h-[140px]">
                <h4 className="text-xs font-bold text-emerald-400 font-sans">
                  {computationalPillars[activePillar].title}
                </h4>
                <div className="text-[10px] text-slate-300 font-semibold italic">
                  Definição: {computationalPillars[activePillar].concept}
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  {computationalPillars[activePillar].explanation}
                </p>
                <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
                  <strong className="text-slate-200">No SinalizaFLV:</strong> {computationalPillars[activePillar].application}
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 text-right font-mono mt-3">
              *Metodologia integrada ao currículo básico
            </div>

          </div>

        </div>

        {/* RIGHT/CENTRAL COLUMN (lg:col-span-8): Map and Active Grid */}
        <div className="lg:col-span-8 space-y-6" id="main-content">
          
          {/* STATS OVERVIEW DECK */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3" id="quick-stats">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center flex flex-col justify-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Total Lotes</span>
              <span className="text-2xl font-black text-slate-800 mt-1">{stats.total}</span>
            </div>
            <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 text-center flex flex-col justify-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 font-bold">Sec. Verde 🟢</span>
              <span className="text-2xl font-black text-emerald-800 mt-1">{stats.green}</span>
            </div>
            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200 text-center flex flex-col justify-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 font-bold">Sec. Amarelo 🟡</span>
              <span className="text-2xl font-black text-amber-800 mt-1">{stats.yellow}</span>
            </div>
            <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200 text-center flex flex-col justify-center animate-pulse">
              <span className="text-[10px] uppercase font-mono tracking-wider text-rose-700 font-bold">Sec. Vermelho 🔴</span>
              <span className="text-2xl font-black text-rose-800 mt-1">{stats.red}</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl text-center flex flex-col justify-center col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Expirados ⚠️</span>
              <span className="text-2xl font-black text-rose-400 mt-1">{stats.expired}</span>
            </div>
          </div>

          {/* VISUAL PHYSICAL SHELF SCHEMATIC */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs" id="physical-shelves">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Package className="w-5 h-5 text-amber-500" />
                  Mapeamento de Prateleiras Físicas (FLV)
                </h3>
                <p className="text-xs text-slate-500">
                  Roteamento dinâmico automático com base no algoritmo do projeto
                </p>
              </div>
              <button 
                onClick={handleLoadCriticalScenario}
                className="text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg py-1 px-2.5 transition active:scale-95 text-left w-fit cursor-pointer"
                title="Carrega cenário de exemplo com muitos itens vermelhos"
              >
                ⚡ Simular Cenário Crítico
              </button>
            </div>

            {/* Warehouse Rack Illustration with items inside */}
            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner" id="shelf-illustration">
              
              {/* TOP RACK BLOCK: SHELF A - GREEN */}
              <div className="border border-emerald-950 bg-emerald-950/20 rounded-xl p-3 relative hover:bg-emerald-950/30 transition">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-400 font-mono mb-2">
                  <span>Prateleira A - Setor VERDE (&gt;48h)</span>
                  <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px]">
                    Estoque Seguro • {shelfA_GreenItems.length} lote(s)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 min-h-[60px]" id="shelf-green-container">
                  {shelfA_GreenItems.length === 0 ? (
                    <div className="col-span-full flex items-center justify-center text-slate-600 text-xs py-4 italic">
                      Nenhum lote nesta prateleira no momento.
                    </div>
                  ) : (
                    shelfA_GreenItems.map(item => (
                      <motion.div
                        layoutId={item.id}
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`p-2 bg-slate-900 border border-emerald-800/60 rounded-lg text-slate-100 cursor-pointer hover:border-emerald-500 active:scale-95 transition-all flex flex-col justify-between text-xs relative ${
                          selectedItem?.id === item.id ? 'ring-2 ring-emerald-500 border-transparent shadow' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold truncate pr-1">{item.name}</span>
                          <span className="text-[14px] shrink-0" title={item.type}>{FLV_ICONS[item.type]}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                          <span className="text-[10px] text-slate-400">{item.batchCode}</span>
                          <span>{item.hoursRemaining}h rest.</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* MIDDLE RACK BLOCK: SHELF B - YELLOW */}
              <div className="border border-amber-950 bg-amber-950/15 rounded-xl p-3 relative hover:bg-amber-950/25 transition">
                <div className="flex justify-between items-center text-xs font-bold text-amber-400 font-mono mb-2">
                  <span>Prateleira B - Setor AMARELO (12h a 48h)</span>
                  <span className="bg-amber-900/50 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px]">
                    Atenção: Prioridade Média • {shelfB_YellowItems.length} lote(s)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 min-h-[60px]" id="shelf-yellow-container">
                  {shelfB_YellowItems.length === 0 ? (
                    <div className="col-span-full flex items-center justify-center text-slate-600 text-xs py-4 italic">
                      Nenhum lote nesta prateleira no momento.
                    </div>
                  ) : (
                    shelfB_YellowItems.map(item => (
                      <motion.div
                        layoutId={item.id}
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`p-2 bg-slate-900 border border-amber-800/60 rounded-lg text-slate-100 cursor-pointer hover:border-amber-500 active:scale-95 transition-all flex flex-col justify-between text-xs relative ${
                          selectedItem?.id === item.id ? 'ring-2 ring-amber-500 border-transparent shadow' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold truncate pr-1">{item.name}</span>
                          <span className="text-[14px] shrink-0">{FLV_ICONS[item.type]}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-amber-400">
                          <span className="text-[10px] text-slate-400">{item.batchCode}</span>
                          <span>{item.hoursRemaining}h rest.</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* BOTTOM RACK BLOCK: SHELF C - RED */}
              <div className="border border-rose-950 bg-rose-950/20 rounded-xl p-3 relative hover:bg-rose-950/30 transition shadow-inner">
                <div className="flex justify-between items-center text-xs font-bold text-rose-400 font-mono mb-2">
                  <span className="animate-pulse flex items-center gap-1">
                    <span className="block w-2 h-2 rounded-full bg-rose-500"></span>
                    Prateleira C - Setor VERMELHO (&le;12h ou Expirado)
                  </span>
                  <span className="bg-rose-900/60 text-rose-300 border border-rose-800 px-2 py-0.5 rounded text-[10px] animate-pulse">
                    Crítico: Expedição Implícita • {shelfC_RedItems.length} lote(s)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 min-h-[60px]" id="shelf-red-container">
                  {shelfC_RedItems.length === 0 ? (
                    <div className="col-span-full flex items-center justify-center text-slate-600 text-xs py-4 italic">
                      Nenhum lote nesta prateleira no momento.
                    </div>
                  ) : (
                    shelfC_RedItems.map(item => {
                      const isExpired = item.hoursRemaining === 0;
                      return (
                        <motion.div
                          layoutId={item.id}
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`p-2 bg-slate-900 border ${
                            isExpired ? 'border-rose-600 animate-pulse' : 'border-rose-900/60'
                          } rounded-lg text-slate-100 cursor-pointer hover:border-rose-500 active:scale-95 transition-all flex flex-col justify-between text-xs relative ${
                            selectedItem?.id === item.id ? 'ring-2 ring-rose-500 border-transparent shadow' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold truncate pr-1 text-rose-100">{item.name}</span>
                            <span className="text-[14px] shrink-0">{FLV_ICONS[item.type]}</span>
                          </div>
                          
                          {isExpired && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[8px] px-1 font-black rounded uppercase animate-bounce shadow">
                              Expirado
                            </span>
                          )}

                          <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-rose-400">
                            <span className="text-[10px] text-slate-400">{item.batchCode}</span>
                            <span className={isExpired ? 'text-red-500 font-extrabold pr-0.5' : ''}>
                              {item.hoursRemaining}h rest.
                            </span>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* ACTIVE INVENTORY SEARCH & DATA TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="inventory-card">
            
            {/* Header controls for searches and filters */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-md font-bold text-slate-900">Listagem Completa do Estoque</h3>
                  <p className="text-xs text-slate-500">Visualize e manipule horas individuais para simular alterações</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar lote ou mercadoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    id="search-input"
                  />
                </div>
              </div>

              {/* Categorical filters layout */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                <span className="text-slate-400 font-bold mr-1">Filtrar:</span>
                
                {/* Type Filters */}
                {['Todos', 'Fruta', 'Legume', 'Verdura'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedTypeFilter(type)}
                    className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition cursor-pointer ${
                      selectedTypeFilter === type
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}

                <div className="h-4 w-px bg-slate-300 mx-2 hidden sm:block" />

                {/* Shelf Color Filters */}
                <button
                  onClick={() => setSelectedShelfFilter('Todos')}
                  className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition cursor-pointer ${
                    selectedShelfFilter === 'Todos'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                  id="filter-shelf-all"
                >
                  Tudo (Setores)
                </button>
                <button
                  onClick={() => setSelectedShelfFilter('verde')}
                  className={`px-2.5 py-1 rounded-full border text-[10px] font-medium transition flex items-center gap-1 cursor-pointer ${
                    selectedShelfFilter === 'verde'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                  id="filter-shelf-green"
                >
                  🟢 Verde
                </button>
                <button
                  onClick={() => setSelectedShelfFilter('amarelo')}
                  className={`px-2.5 py-1 rounded-full border text-[10px] font-medium transition flex items-center gap-1 cursor-pointer ${
                    selectedShelfFilter === 'amarelo'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                  id="filter-shelf-yellow"
                >
                  🟡 Amarelo
                </button>
                <button
                  onClick={() => setSelectedShelfFilter('vermelho')}
                  className={`px-2.5 py-1 rounded-full border text-[10px] font-medium transition flex items-center gap-1 cursor-pointer ${
                    selectedShelfFilter === 'vermelho'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                  }`}
                  id="filter-shelf-red"
                >
                  🔴 Vermelho
                </button>
              </div>
            </div>

            {/* Item Rows Container */}
            <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto" id="inventory-rows-list">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center" id="no-matching-items">
                  <Apple className="w-8 h-8 text-slate-300 mx-auto stroke-1" />
                  <p className="text-sm text-slate-500 mt-2 font-medium">Nenhum lote corresponde aos filtros aplicados.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setSelectedTypeFilter('Todos'); setSelectedShelfFilter('Todos'); }} 
                    className="text-xs text-emerald-600 hover:underline font-bold mt-1 cursor-pointer"
                  >
                    Exibir estoque completo
                  </button>
                </div>
              ) : (
                filteredItems.map(item => {
                  const rec = getShelvingRecommendation(item.hoursRemaining);
                  const lifePercent = Math.min(100, Math.max(0, (item.hoursRemaining / item.totalShelfLifeHours) * 100));
                  
                  return (
                    <div 
                      key={item.id}
                      className={`p-4 hover:bg-slate-50/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        selectedItem?.id === item.id ? 'bg-slate-50/90 border-l-4 border-emerald-500 pl-3' : 'pl-4'
                      }`}
                      id={`row-${item.id}`}
                    >
                      {/* Name / Info */}
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedItem(item)}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg shrink-0" title={item.type}>
                            {FLV_ICONS[item.type] || '📦'}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 truncate">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-mono">
                              <span className="bg-slate-200 text-slate-700 px-1 py-0.2 rounded font-black">{item.batchCode}</span>
                              <span>•</span>
                              <span>Qtd: {item.quantity} {item.unit}</span>
                              {item.notes && (
                                <>
                                  <span>•</span>
                                  <span className="truncate max-w-[120px] text-slate-500 italic">📎 {item.notes}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar of Decay */}
                        <div className="mt-2.5 max-w-sm">
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                            <span>Vida de Gôndola</span>
                            <span className="font-extrabold">{Math.round(lifePercent)}% ({item.hoursRemaining}h / {item.totalShelfLifeHours}h)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                rec.sectorColor === 'verde' ? 'bg-emerald-500' :
                                rec.sectorColor === 'amarelo' ? 'bg-amber-400' : 'bg-rose-500 animate-pulse'
                              }`} 
                              style={{ width: `${lifePercent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Manual Adjustment controls + Shelving badge */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <div className="text-right">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${rec.badgeStyle}`}>
                            {rec.alertEmoji} Prateleira {rec.sectorColor === 'verde' ? 'A' : rec.sectorColor === 'amarelo' ? 'B' : 'C'}
                          </span>
                          <div className="mt-1 flex items-center justify-end gap-1">
                            <span className="text-[10px] text-slate-400 font-mono">Ajuste de Tempo:</span>
                            <button
                              onClick={() => handleUpdateItemTime(item.id, item.hoursRemaining - 5)}
                              disabled={item.hoursRemaining <= 0}
                              className="w-5 h-5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-black text-slate-600 disabled:opacity-30 transition flex items-center justify-center cursor-pointer"
                              title="Diminuir 5 horas"
                            >
                              -5h
                            </button>
                            <button
                              onClick={() => handleUpdateItemTime(item.id, item.hoursRemaining + 5)}
                              className="w-5 h-5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-black text-slate-600 transition flex items-center justify-center cursor-pointer"
                              title="Aumentar 5 horas"
                            >
                              +5h
                            </button>
                          </div>
                        </div>

                        {/* Quick complete tasks */}
                        <div className="flex gap-1 pl-2 border-l border-slate-200">
                          <button
                            onClick={() => handleShipItem(item.id, item.name)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 text-emerald-600 border border-emerald-200 rounded-lg transition text-xs font-bold"
                            title="Lote Expedido/Vendido"
                            id={`ship-btn-${item.id}`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 text-rose-600 border border-rose-200 rounded-lg transition"
                            title="Descartar ou reportar perda"
                            id={`trash-btn-${item.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom active details card */}
            {selectedItem && (
              <div className="p-4 bg-slate-900 text-white border-t border-slate-800 space-y-2 relative">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{FLV_ICONS[selectedItem.type]}</span>
                    <div>
                      <h5 className="text-xs font-medium text-emerald-400">Inspeção Detalhada</h5>
                      <p className="text-sm font-black text-slate-100">{selectedItem.name} ({selectedItem.batchCode})</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="text-[10px] text-slate-400 hover:text-slate-200 border border-slate-800 px-2 py-0.5 rounded cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Fase de Perecibilidade</span>
                    <span className="font-extrabold text-slate-200">
                      {selectedItem.hoursRemaining > 48 ? '🟢 Nível Estável' : selectedItem.hoursRemaining > 12 ? '🟡 Fase de Transição' : '🔴 Crítico / Próximo ao Limite'}
                    </span>
                  </div>
                  
                  <div className="bg-slate-950 p-2 rounded border border-slate-800/80 col-span-2">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Diretriz do Algoritmo de Triagem</span>
                    <p className="text-[11px] text-slate-300 leading-tight">
                      {getShelvingRecommendation(selectedItem.hoursRemaining).actionText}
                    </p>
                  </div>
                </div>

                {selectedItem.notes && (
                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                    <strong>Anotações Operacionais:</strong> &ldquo;{selectedItem.notes}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>

          {/* SIMULATED EVENTS AND TERMINAL LOG CONSOLE (User code logger console mockup) */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 font-mono shadow-xl relative" id="console-logs-card">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400 animate-pulse" />
                <h3 className="text-xs font-extrabold tracking-wider text-slate-200">
                  REAL-TIME CONSOLE.LOGS (SIMULAÇÃO CENTRAL FLV)
                </h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <div className="space-y-1.5 max-h-[140px] overflow-y-auto text-[11px] leading-relaxed scrollbar-thin scrollbar-thumb-slate-800" id="terminal-content">
              {logs.map((log) => (
                <div key={log.id} className="border-b border-slate-900/50 pb-1 last:border-0">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] text-slate-500 select-none shrink-0">{log.timestamp}</span>
                    <div className="flex-1">
                      <span className={`font-medium ${
                        log.type === 'success' ? 'text-emerald-400' :
                        log.type === 'warning' ? 'text-amber-400' :
                        log.type === 'danger' ? 'text-rose-400 animate-pulse font-bold' :
                        'text-sky-300'
                      }`}>
                        {log.message}
                      </span>
                      <div className="text-[10px] text-slate-400 font-sans mt-0.5 pl-2 border-l border-slate-800">
                        ↳ <span className="italic">{log.action}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3.5 pt-2 border-t border-slate-900 flex justify-between items-center text-[9px] text-slate-500">
              <span>Rastreador de Eventos de Pattern Recognition e Desvio Condicional</span>
              <span>Saída do script original do protótipo</span>
            </div>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-400 text-xs" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <span className="font-extrabold text-slate-700">SinalizaFLV</span> — Projeto Educacional Piloto de Pensamento Computacional.
            <p className="text-[11px] text-slate-400 mt-1">
              Desenvolvido com o rigor do pilar de Decomposição, Reconhecimento de Padrões, Abstração e Algoritmos de Triagem de Gôndola.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 text-[10px] border border-emerald-100 rounded-lg px-2 py-1 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Operação de Validade Blindada
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
