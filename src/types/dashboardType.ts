export interface ItemType {
  id: number;
  title: string;
  color: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  createdByMe: boolean;
}
export interface DashboardInfoType {
  id: number;
  title: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  createdByMe: boolean;
}
export interface ValueType {
  title: string;
  color: string;
}

// 컬럼의 카드 추가 타입
interface IAssignee {
  nickname: string;
}
interface Iitem {
  id: number;
  title: string;
  description: string;
  tags: string[];
  dueDate: string;
  imageUrl?: string;
  assignee: IAssignee;
}

export interface ICard {
  cards: Iitem;
  totalCount?: number;
}

export interface creatDashboard {
  title: string;
  color: string;
}
