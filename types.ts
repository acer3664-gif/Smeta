
export type UnitType = 'м2' | 'м/п' | 'шт' | 'упак' | 'компл' | 'кг' | 'л' | 'точка' | 'ветка';

export interface EstimateItem {
  id: string;
  category: string;
  name: string;
  unit: UnitType;
  quantity: number;
  pricePerUnit: number;
}

export interface EstimateTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: Omit<EstimateItem, 'id'>[];
}

export interface RenovationProject {
  id: string;
  name: string;
  items: EstimateItem[];
  createdAt: number;
  lastModified: number;
  aiAdvice?: string;
}

export interface SuggestionResponse {
  items: Array<{
    name: string;
    category: string;
    unit: UnitType;
    quantity: number;
    estimatedPrice: number;
  }>;
  advice: string;
}
