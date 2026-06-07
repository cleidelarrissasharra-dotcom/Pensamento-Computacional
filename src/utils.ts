import { FLVItem, ShelvingRecommendation, ComputationalPillarInfo } from './types';

/**
 * Implements the core logic of pattern recognition and algorithms for FLV triage.
 * Determines the physical shelf allocation, color alert, and recommended actions based on remaining hours.
 */
export function getShelvingRecommendation(hoursRemaining: number): ShelvingRecommendation {
  if (hoursRemaining > 48) {
    return {
      shelfName: "Prateleira A - Setor VERDE (Estoque Seguro)",
      sectorColor: "verde",
      alertEmoji: "🟢",
      actionText: "Armazenar normalmente. Abastecer gôndolas traseiras para rotatividade saudável. Ideal para novos lotes.",
      badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
      bgColor: "bg-emerald-50/50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-800"
    };
  } else if (hoursRemaining <= 48 && hoursRemaining > 12) {
    return {
      shelfName: "Prateleira B - Setor AMARELO (Atenção: Prioridade Média)",
      sectorColor: "amarelo",
      alertEmoji: "🟡",
      actionText: "Colocar na frente de exibição. Analisar aplicação de descontos progressivos ou promoções 'leve mais por menos' para saída rápida.",
      badgeStyle: "bg-amber-50 text-amber-700 border-amber-200",
      bgColor: "bg-amber-50/50",
      borderColor: "border-amber-200",
      textColor: "text-amber-800"
    };
  } else {
    return {
      shelfName: "Prateleira C - Setor VERMELHO (Crítico: Expedição Imediata!)",
      sectorColor: "vermelho",
      alertEmoji: "🔴",
      actionText: "Ação Imediata! Reposicionar para gôndola de liquidação ultra-rápida, doar para cozinhas parceiras ou direcionar para processamento imediato (sucos/sopas).",
      badgeStyle: "bg-rose-50 text-rose-700 border-rose-200 animate-pulse",
      bgColor: "bg-rose-50/50",
      borderColor: "border-rose-200",
      textColor: "text-rose-800"
    };
  }
}

/**
 * Computational Thinking Pillars mapped to the SinalizaFLV architecture
 */
export const computationalPillars: ComputationalPillarInfo[] = [
  {
    title: "1. Decomposição (Desmembrar)",
    concept: "Dividir o problema",
    explanation: "Dividimos a complexidade geral da validade hortifrúti em lotes únicos de mercadoria avaliados individualmente em horas úteis.",
    application: "Ao invés de tentar gerenciar uma gôndola inteira de forma arbitrária, o sistema isola o lote 'Melancia em Cubos Pote' com seu tempo exato de 36 horas restante."
  },
  {
    title: "2. Reconhecimento de Padrões",
    concept: "Identificar similaridades",
    explanation: "Percebemos que todos os produtos de FLV passam por três fases biológicas de frescor: Estável, Urgência Média e Excedente Crítico.",
    application: "Definimos os gatilhos matemáticos universais (>48h, 12-48h, <=12h) para classificar qualquer variedade de produto sob o mesmo padrão de movimentação."
  },
  {
    title: "3. Abstração (Simplificar)",
    concept: "Focar no que importa",
    explanation: "Focamos estritamente no tempo de vida útil microbiológico ativo e na cor do setor de alerta, ignorando tamanho do produto ou marca.",
    application: "Se o abacaxi fatiado e a rúcula higienizada têm 8h restantes, ambos pertencem de igual modo à Prateleira C (Setor Vermelho) para vazão urgente."
  },
  {
    title: "4. Algoritmo (Passo a Passo)",
    concept: "Criar regras operacionais",
    explanation: "Projetamos regras sequenciais claras de desvio condicional (IF/ELSE/THEN) no cérebro digital da loja, eliminando palpites pessoais.",
    application: "O algoritmo 'definirPrateleiraFisica()' realiza o cálculo lógico perfeito em microssegundos: Entrada: 36h -> Se (36 <= 48 && 36 > 12) -> Prateleira B (Amarela)."
  }
];

export const initialFLVItems: FLVItem[] = [
  {
    id: "item-1",
    name: "Abóbora Cabotiá Cubos",
    type: "Legume",
    batchCode: "LOTE-FLV-233",
    quantity: 15,
    unit: "bandeja",
    hoursRemaining: 72,
    totalShelfLifeHours: 120,
    registrationDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), // Registered 48 hours ago
    notes: "Lote super fresco recebido do cinturão verde. Embalagem com filme selador."
  },
  {
    id: "item-2",
    name: "Melancia em Cubos Pote",
    type: "Fruta",
    batchCode: "LOTE-FLV-188",
    quantity: 8,
    unit: "pote",
    hoursRemaining: 36,
    totalShelfLifeHours: 72,
    registrationDate: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    notes: "Potinho de 400g. Alto teor de umidade, verificar presença de suco acumulado no fundo."
  },
  {
    id: "item-3",
    name: "Salada Higienizada Coletiva",
    type: "Verdura",
    batchCode: "LOTE-FLV-095",
    quantity: 12,
    unit: "bandeja",
    hoursRemaining: 8,
    totalShelfLifeHours: 48,
    registrationDate: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    notes: "Rúcula, alface americana e agrião. Super sensível à variação de temperatura fria."
  },
  {
    id: "item-4",
    name: "Morangos Selecionados Primor",
    type: "Fruta",
    batchCode: "LOTE-FLV-302",
    quantity: 24,
    unit: "bandeja",
    hoursRemaining: 18,
    totalShelfLifeHours: 48,
    registrationDate: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
    notes: "Verificar se há moras machucadas no fundo da embalagem que possam acelerar fungos."
  },
  {
    id: "item-5",
    name: "Alface Crespa Hidropônica",
    type: "Verdura",
    batchCode: "LOTE-FLV-106",
    quantity: 20,
    unit: "un",
    hoursRemaining: 56,
    totalShelfLifeHours: 72,
    registrationDate: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    notes: "Mantida com a raiz para preservação da hidratação na prateleira úmida."
  },
  {
    id: "item-6",
    name: "Chuchu Orgânico Picado",
    type: "Legume",
    batchCode: "LOTE-FLV-047",
    quantity: 10,
    unit: "kg",
    hoursRemaining: 10,
    totalShelfLifeHours: 72,
    registrationDate: new Date(Date.now() - 62 * 3600 * 1000).toISOString(),
    notes: "Corte em cubos medianos, indicado para sopas rápidas devido ao tempo residual."
  }
];

export const FLV_ICONS = {
  Fruta: "🍎",
  Legume: "🥕",
  Verdura: "🥬",
  Outro: "📦"
};
