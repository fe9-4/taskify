import Image from "next/image";
import { formatDateTime } from "@/utils/dateFormat";
import { CommentProps } from "@/types/commentType";
import InputItem from "@/components/input/InputItem";
import { ChangeEvent, Dispatch, forwardRef, SetStateAction, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export interface CommentItemProps {
  comment: CommentProps;
  setComments: Dispatch<SetStateAction<CommentProps[]>>;
}

const CommentItem = forwardRef<HTMLDivElement, CommentItemProps>(({ comment, setComments }, ref) => {
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const isEditing = comment.id === editCommentId;

  const handleEdit = (commentId: number | null, currentContent: string) => {
    if (commentId === null) {
      setEditCommentId(null);
      setEditContent("");
    } else {
      setEditCommentId(commentId);
      setEditContent(currentContent);
    }
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditContent(e.target.value);
  };

  const handleSave = async (commentId: number) => {
    try {
      await axios.put(`/api/comments/${commentId}`, { content: editContent });
      setComments((prevComments) =>
        prevComments.map((comment) => (comment.id === commentId ? { ...comment, content: editContent } : comment))
      );
      toast.success("댓글이 수정되었습니다.");
      setEditCommentId(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("댓글 수정에 실패했습니다.");
      }
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      const response = await axios.delete(`/api/comments/${commentId}`);
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      if (response.status === 201) toast.success("댓글이 삭제되었습니다.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("댓글 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div ref={ref} className="mb-5 flex items-start gap-2 border-b-[1px] border-b-gray03 pb-2 pr-3">
      {comment.author && comment.author.profileImageUrl ? (
        <div className="relative size-6 overflow-hidden rounded-full md:size-8">
          <Image src={comment.author.profileImageUrl} fill alt={comment.author.nickname} />
        </div>
      ) : (
        <div className="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-[#A3C4A2] text-white md:size-8">
          {comment.author.nickname.charAt(0)}
        </div>
      )}
      <div className="w-full">
        <div className="flex">
          <p className="text-sm font-semibold text-black03 md:text-base">{comment.author.nickname}</p>
          <div className="ml-auto flex space-x-2 text-xs text-gray02 md:text-base">
            {isEditing && (
              <>
                <button onClick={() => handleSave(comment.id)}>저장</button>
                <button onClick={() => handleEdit(null, "")}>취소</button>
              </>
            )}
            {!isEditing && (
              <>
                <button onClick={() => handleEdit(comment.id, comment.content)}>수정</button>
                <button onClick={() => handleDelete(comment.id)}>삭제</button>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {isEditing && <InputItem value={editContent} onChange={handleEditChange} isTextArea />}
          {!isEditing && (
            <p className="break-all text-sm leading-snug text-black03 md:text-base md:leading-normal">
              {comment.content}
            </p>
          )}
          <span className="text-xs font-medium text-gray02 md:text-sm">{formatDateTime(comment.createdAt)}</span>
        </div>
      </div>
    </div>
  );
});

export default CommentItem;
