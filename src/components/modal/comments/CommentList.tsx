import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { AlertModalAtom, AlertModalConfirmAtom, AlertModalTextAtom } from "@/store/modalAtom";
import { formatDateTime } from "@/utils/dateFormat";
import { CommentProps } from "@/types/commentType";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";

interface CommentListProps {
  cardId: number;
  comments: CommentProps[];
  setComments: Dispatch<SetStateAction<CommentProps[]>>;
}

const CommentList = ({ cardId, comments, setComments }: CommentListProps) => {
  const [, setIsAlertOpen] = useAtom(AlertModalAtom);
  const [, setAlertText] = useAtom(AlertModalTextAtom);
  const [, setOnConfirm] = useAtom(AlertModalConfirmAtom);

  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [size, setSize] = useState(10);

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(`/api/comments?size=${size}&cardId=${cardId}`);
        setComments(response.data.comments);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("CommentList에서 api 오류 발생", error);
          toast.error(error.response?.data);
        }
      }
    };

    getComments();
  }, [cardId, size]);

  const handleEdit = (commentId: number, currentContent: string) => {
    setEditCommentId(commentId);
    setEditContent(currentContent);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditContent(event.target.value);
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

  const ondelete = async (commentId: number) => {
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

  const handleDelete = (commentId: number) => {
    setIsAlertOpen(true);
    setAlertText("정말 삭제하시겠습니까?");
    setOnConfirm(() => {
      ondelete(commentId);
      setIsAlertOpen(false);
    });
  };

  return (
    <div className="mt-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id}>
            <div className="mb-5 flex items-start gap-2 border-b-[1px] border-b-gray03 pb-2">
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
                <p className="text-sm font-semibold text-black03 md:text-base">
                  {comment.author.nickname}
                  <span className="ml-2 text-xs font-medium text-gray02 md:text-sm">
                    {formatDateTime(comment.createdAt)}
                  </span>
                </p>
                {editCommentId === comment.id ? (
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={editContent}
                      onChange={handleEditChange}
                      className="mb-2 rounded-md px-2 py-1 text-base text-black03 ring-1 ring-inset ring-gray03 transition-all focus:outline-none focus:ring-1 focus:ring-inset md:text-lg"
                    />
                    <div className="ml-auto flex space-x-2 text-xs text-gray02 md:text-base">
                      <button onClick={() => handleSave(comment.id)}>저장</button>
                      <button onClick={() => setEditCommentId(null)}>취소</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full flex-col">
                    <p className="break-all text-base text-black03 md:text-lg">{comment.content}</p>
                    <div className="ml-auto flex space-x-2 text-xs text-gray02 md:text-base">
                      <button onClick={() => handleEdit(comment.id, comment.content)}>수정</button>
                      <button onClick={() => handleDelete(comment.id)}>삭제</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="mb-3 flex items-center justify-center text-center text-xs font-medium text-gray02 md:mb-2 md:text-lg">
          등록된 댓글이 없습니다.
        </p>
      )}
    </div>
  );
};

export default CommentList;
