interface CardProps {
  assigneeUserId: number;
  columnId: number;
  title: string;
  description: string;
  dueDate: string;
  tags: string[];
  imageUrl: string | File | null;
}

interface AssigneeType {
  id: number;
  userId: number;
  nickname: string;
  email: string;
  profileImageUrl: string | null;
}

export interface CreateCardProps extends CardProps {
  dashboardId: number;
  assignee?: AssigneeType;
}

export interface UpdateCardProps extends CardProps {
  dashboardId: number;
  assignee?: AssigneeType;
}

export interface CardDataType extends UpdateCardProps {
  assignee: AssigneeType;
}

export interface CardDataProps {
  id: number;
  title: string;
  description: string;
  tags: string[];
  dueDate: string;
  assignee: AssigneeType;
  imageUrl: string;
  teamId: string;
  columnId: number;
  createdAt: Date;
  updatedAt: Date;
  status?: string;
}
