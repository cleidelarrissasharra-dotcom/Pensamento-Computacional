/**
 * Types and interfaces for the SinalizaFLV digital fresh produce triage board.
 */

export type FLVType = 'Fruta' | 'Legume' | 'Verdura' | 'Outro';

export interface FLVItem {
  id: string;
  name: string;
  type: FLVType;
  batchCode: string;
  quantity: number;
  unit: 'un' | 'kg' | 'pote' | 'bandeja' | 'g';
  hoursRemaining: number;
  totalShelfLifeHours: number;
  registrationDate: string;
  notes?: string;
}

export interface ComputationalPillarInfo {
  title: string;
  concept: string;
  explanation: string;
  application: string;
}

export interface ShelvingRecommendation {
  shelfName: string;
  sectorColor: 'verde' | 'amarelo' | 'vermelho';
  alertEmoji: string;
  actionText: string;
  badgeStyle: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}
