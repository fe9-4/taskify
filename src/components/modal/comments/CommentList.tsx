import { useCallback, useEffect, useState } from "react";
import { CommentListProps, CommentProps } from "@/types/commentType";
import axios from "axios";
import toast from "react-hot-toast";
import CommentItem from "./CommentItem";
import CreateComment from "./CreateComment";
import useIntersectionObserver from "@/hooks/useObserver";

const CommentList = ({ cardId, columnId }: CommentListProps) => {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [cursorId, setCursorId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const size = 10;

  const getComments = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await axios.get(
        `/api/comments?size=${size}${cursorId ? `&cursorId=${cursorId}` : ""}&cardId=${cardId}`
      );
      const newCommentList = response.data.comments;
      const nextCursorId = response.data.cursorId;

      if (newCommentList.length > 0) {
        setComments((prevComments) => {
          const uniqueComments = [
            ...prevComments,
            ...newCommentList.filter(
              (newComment: CommentProps) => !prevComments.some((prevComment) => prevComment.id === newComment.id)
            ),
          ];
          return uniqueComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
        setCursorId(nextCursorId);
      } else {
        setCursorId(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "오류가 발생했습니다.";
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [cardId, isLoading, size, comments]);

  useEffect(() => {
    getComments();
  }, []);

  const setObserveTarget = useIntersectionObserver(() => {
    if (!isLoading) {
      getComments();
    }
  });

  return (
    <>
      <CreateComment cardId={cardId} columnId={columnId} setComments={setComments} />
      <div className="mt-4 overflow-y-scroll rounded-2xl [&::-webkit-scrollbar]:hidden">
        {comments.length > 0 ? (
          comments.map((comment) => <CommentItem key={comment.id} comment={comment} setComments={setComments} />)
        ) : (
          <p className="mb-3 flex items-center justify-center text-center text-xs font-medium text-gray02 md:mb-2 md:text-lg">
            등록된 댓글이 없습니다.
          </p>
        )}
        <div ref={setObserveTarget} style={{ height: "1px" }} />
      </div>
      {isLoading && <p className="text-gray02">Loading...</p>}
    </>
  );
};

export default CommentList;
