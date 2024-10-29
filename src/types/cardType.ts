interface CardProps {
  assigneeUserId: number;
  columnId: number;
  title: string;
  description: string;
  dueDate: string;
  tags: string[];
  imageUrl: string | File | null;
}

interface FormValues {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface CreateCardProps extends CardProps {
  assignee: FormValues;
  dashboardId?: number;
}

export interface UpdateCardProps extends CardProps {
  assignee: FormValues;
}

export interface CardDataProps {
  id: number;
  title: string;
  description: string;
  tags: string[];
  dueDate: string;
  assignee: FormValues;
  imageUrl: string;
  teamId: string;
  columnId: number;
  createdAt: Date;
  updatedAt: Date;
}
