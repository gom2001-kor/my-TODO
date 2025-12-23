export type Priority = 'low' | 'medium' | 'high';
export type CategoryType = 'personal' | 'work' | 'study' | 'shop';

export interface NotificationSettings {
  oneHourBefore: boolean;
  thirtyMinBefore: boolean;
  tenMinBefore: boolean;
  onTime: boolean;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  priority: Priority;
  dueDate: string; // ISO string (YYYY-MM-DD)
  dueTime: string; // HH:mm
  completed: boolean;
  createdAt: number;
  notifications: NotificationSettings;
}

export interface CategoryInfo {
  id: CategoryType;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Record<CategoryType, CategoryInfo> = {
  personal: { id: 'personal', label: '개인 일정', icon: '👤', color: 'var(--category-personal)' },
  work: { id: 'work', label: '업무 프로젝트', icon: '💼', color: 'var(--category-work)' },
  study: { id: 'study', label: '공부 계획', icon: '📚', color: 'var(--category-study)' },
  shop: { id: 'shop', label: '쇼핑 리스트', icon: '🛒', color: 'var(--category-shop)' },
};
