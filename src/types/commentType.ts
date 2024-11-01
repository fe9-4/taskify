import { MouseEventHandler } from "react";

export interface CommentProps {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  cardId: number;
  author: authorProps;
}

export interface authorProps {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface CommentListProps {
  cardId: number;
  columnId: number;
  handleScrollTop: MouseEventHandler;
}
