import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { CommentProps } from "@/types/commentType";
import axios from "axios";
import toast from "react-hot-toast";
import useLoading from "@/hooks/useLoading";
import InputItem from "@/components/input/InputItem";
import CommentList from "./CommentList";

const CreateComment = ({ cardId, columnId }: { cardId: number; columnId: number }) => {
  const dashboardId = Number(useParams().dashboardId);
  const [comments, setComments] = useState<CommentProps[]>([]);
  const { isLoading, withLoading } = useLoading();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data: any) => {
    const formData = {
      ...data,
      dashboardId,
      cardId,
      columnId,
    };

    await withLoading(async () => {
      try {
        const response = await axios.post("/api/comments", formData);
        toast.success("댓글이 생성되었습니다! 🎉");
        setComments((prevComments) => [response.data.comment, ...prevComments]);
        reset();
      } catch (error) {
        toast.error("댓글 생성이 실패하였습니다.");
      }
    });
  };

  return (
    <>
      <InputItem
        id="content"
        label="댓글"
        isTextArea
        isButton
        placeholder="댓글 작성하기"
        {...register("content", { required: true })}
        onClick={handleSubmit(onSubmit)}
        // disabled={!isValid || isLoading}
      />
      <CommentList cardId={cardId} comments={comments} setComments={setComments} />
    </>
  );
};

export default CreateComment;
