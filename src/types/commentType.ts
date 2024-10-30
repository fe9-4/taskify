import { SetStateAction } from "jotai";
import { ChangeEventHandler } from "react";

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
}

// export interface CommentItemProps {
//   comment: CommentProps;
//   setComments Dispatch<SetStateAction<CommentProps[]>>;
//   // editCommentId: number | null;
//   // editContent: string;
//   // handleEdit: (commentId: number | null, currentContent: string) => void;
//   // handleDelete: (commentId: number) => void;
//   // handleEditChange: ChangeEventHandler;
//   // handleSave: (commentId: number) => void;
// }
