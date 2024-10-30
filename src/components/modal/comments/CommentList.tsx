import { useCallback, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { useToggleModal } from "@/hooks/useToggleModal";
import { AlertModalConfirmAtom, AlertModalTextAtom } from "@/store/modalAtom";
import { CommentListProps, CommentProps } from "@/types/commentType";
import axios from "axios";
import toast from "react-hot-toast";
import CommentItem from "./CommentItem";
import CreateComment from "./CreateComment";

const CommentList = ({ cardId, columnId }: CommentListProps) => {
  const toggleModal = useToggleModal();
  const [, setAlertText] = useAtom(AlertModalTextAtom);
  const [, setOnConfirm] = useAtom(AlertModalConfirmAtom);

  const [comments, setComments] = useState<CommentProps[]>([]);
  const [offset, setOffset] = useState(0);
  const size = 10;

  const observeRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const getComments = useCallback(async () => {
    if (!hasMore) return;

    try {
      const response = await axios.get(`/api/comments?size=${size}&cardId=${cardId}`);
      const newCommentList = response.data.comments;

      setComments((prev) => {
        // const uniqueComments = newCommentList.filter(
        //   (newComment: any) => !prevComments.some((prevComment) => prevComment.id === newComment.id)
        // );
        // const data = new Set(uniqueComments);
        // return [...prevComments, ...uniqueComments];
        const existingId = new Set(prev.map((comment) => comment.id));
        const filteredNewCardList = newCommentList.filter((comment: any) => !existingId.has(comment.id));

        if (filteredNewCardList.length === 0 || filteredNewCardList.length < size) {
          setHasMore(false);
        }

        return [...prev, ...filteredNewCardList];
      });

      console.log(comments);

      if (newCommentList.length < size) {
        setHasMore(false); // 더 이상 불러올 댓글이 없을 때 false로 설정
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data);
      }
    }
  }, [cardId, hasMore, size]);

  // 댓글 무한스크롤
  useEffect(() => {
    getComments();

    const observer = new IntersectionObserver((entries) => {
      const lastCommentItem = entries[0];
      if (lastCommentItem.isIntersecting && hasMore) {
        setOffset((prevOffset) => prevOffset + size);
      }
    });

    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) observer.observe(currentLoadingRef);

    return () => {
      if (currentLoadingRef) observer.unobserve(currentLoadingRef);
    };
  }, [hasMore]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  // const handleDelete = (commentId: number) => {
  //   toggleModal("deleteModal", true);
  //   setAlertText("정말 삭제하시겠습니까?");
  //   setOnConfirm(() => {
  //     ondelete(commentId);
  //     toggleModal("deleteModal", false);
  //   });
  // };

  return (
    <>
      <CreateComment cardId={cardId} columnId={columnId} setComments={setComments} />
      <div className="mt-4 h-[100vh] overflow-y-scroll">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem comment={comment} setComments={setComments} />
            </div>
          ))
        ) : (
          <p className="mb-3 flex items-center justify-center text-center text-xs font-medium text-gray02 md:mb-2 md:text-lg">
            등록된 댓글이 없습니다.
          </p>
        )}
      </div>
      {hasMore && (
        <div ref={loadingRef} className="h-10">
          로딩 중...
        </div>
      )}
    </>
  );
};

export default CommentList;
