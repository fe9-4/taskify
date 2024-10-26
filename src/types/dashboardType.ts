export interface ItemType {
  id: number;
  title: string;
  color: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  createdByMe: boolean;
}

// 컬럼의 카드 추가 타입
interface IAssignee {
  nickname: string;
  profileImageUrl: string | null;
  id: number;
}
interface Iitem {
  id: number;
  title: string;
  description: string;
  tags: string[];
  dueDate: string;
  assignee: IAssignee;
  imageUrl: string | null;
  teamId: string;
  columnId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICard {
  cards: Iitem;
  totalCount?: number;
  cursorId?: number | null;
}

export interface creatDashboard {
  title: string;
  color: string;
}
