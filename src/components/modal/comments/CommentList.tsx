import { Dispatch, useCallback, useEffect, useState } from "react";
import { CommentListProps, CommentProps } from "@/types/commentType";
import axios from "axios";
import toast from "react-hot-toast";
import CommentItem from "./CommentItem";
import CreateComment from "./CreateComment";
import useIntersectionObserver from "@/hooks/useObserver";
import { SetStateAction } from "jotai";

const CommentList = ({ cardId, columnId }: CommentListProps) => {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [cursorId, setCursorId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [observe, setObserve] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 확인
  const size = 3;

  const getComments = useCallback(async () => {
    if (isLoading || !hasMore) return;
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

        setCursorId(nextCursorId || null);
        setHasMore(Boolean(nextCursorId)); // 다음 페이지가 없을 경우 false로 설정
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "오류가 발생했습니다.";
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [cardId, cursorId, size, isLoading, hasMore]);

  // 컴포넌트 첫 마운트 시 한 번만 호출
  useEffect(() => {
    getComments();
  }, []); // 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 호출

  // 무한 스크롤에 필요한 관찰 대상 설정
  const setObserveTarget: Dispatch<SetStateAction<any>> = useIntersectionObserver(() => {
    if (!isLoading && hasMore) {
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
        <div ref={setObserveTarget} className="h-1" />
      </div>
      {isLoading && <p className="text-xs text-gray02 md:text-base">Loading...</p>}
    </>
  );
};

export default CommentList;
