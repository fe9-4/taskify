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
  profileImageUrl: string | null;
  id: number;
}

export interface Iitem {
  id: number;
  title: string;
  description: string;
  tags: string[];
  dueDate: string;
  assignee: IAssignee;
  imageUrl: string;
  teamId: string;
  columnId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICard {
  cards: Iitem[];
  totalCount: number;
  cursorId: number | undefined;
}

export interface CreateDashboard {
  title: string;
  color: string;
}

// 현재 대시보드 내 컬럼들의 id, title 타입
export interface ICurrentColumn {
  id: number;
  title: string;
}