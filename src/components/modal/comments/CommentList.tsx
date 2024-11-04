import { useCallback, useEffect, useState } from "react";
import { CommentListProps, CommentProps } from "@/types/commentType";
import axios from "axios";
import toast from "react-hot-toast";
import CommentItem from "./CommentItem";
import CreateComment from "./CreateComment";
import useIntersectionObserver from "@/hooks/useObserver";
import { cls } from "@/lib/utils";
import { HiChevronDoubleUp } from "react-icons/hi";
import toastMessages from "@/lib/toastMessage";

const CommentList = ({ cardId, columnId, handleScrollTop }: CommentListProps) => {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [cursorId, setCursorId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
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
        setHasMore(Boolean(nextCursorId));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) toast.error(toastMessages.error.getComment);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [cardId, cursorId, size, isLoading, hasMore]);

  const targetRef = useIntersectionObserver(() => {
    if (!isLoading && hasMore) getComments();
  });

  useEffect(() => {
    if (comments.length === 0 && hasMore) getComments();
  }, [comments.length, hasMore, getComments]);

  return (
    <>
      <CreateComment cardId={cardId} columnId={columnId} setComments={setComments} />
      <div className="mt-4 overflow-y-scroll rounded-2xl [&::-webkit-scrollbar]:hidden">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              setComments={setComments}
              ref={index === comments.length - 1 ? targetRef : null}
            />
          ))
        ) : (
          <p className="mb-3 flex items-center justify-center text-center text-xs font-medium text-gray02 md:mb-8 md:text-lg">
            등록된 댓글이 없습니다.
          </p>
        )}
      </div>
      {isLoading && <p className="text-xs text-gray02 md:text-base">Loading...</p>}
      <button
        onClick={handleScrollTop}
        className={cls(
          "sticky bottom-4 ml-auto mr-[-8px] mt-[-36px] transform rounded-full bg-violet02 p-2 outline-none transition-all delay-500 duration-500 focus:outline-none",
          comments.length > 5 ? "block scale-100 opacity-100" : "hidden scale-90 opacity-0"
        )}
      >
        <HiChevronDoubleUp className="size-5 text-violet01" />
      </button>
    </>
  );
};

export default CommentList;
