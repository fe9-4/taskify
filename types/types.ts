// 컬럼의 카드 추가 타입

interface IAssignee {
  nickname: string;
}
export interface Iitem {
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