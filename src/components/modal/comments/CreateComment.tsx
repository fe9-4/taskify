import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import useLoading from "@/hooks/useLoading";
import InputItem from "@/components/input/InputItem";
import CommentList from "./CommentList";
import { Dispatch } from "react";
import { SetStateAction } from "jotai";
import { CommentProps } from "@/types/commentType";
import { InsertBtn } from "@/components/button/ButtonComponents";

interface Props {
  cardId: number;
  columnId: number;
  setComments: Dispatch<SetStateAction<CommentProps[]>>;
}

const CreateComment = ({ cardId, columnId, setComments }: Props) => {
  const dashboardId = Number(useParams().dashboardId);
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
        const newComment = response.data.user;
        setComments((prevComments) => [newComment, ...prevComments]);
        toast.success("댓글이 생성되었습니다.");
        reset({ content: "" });
      } catch (error) {
        toast.error("댓글 생성에 실패하였습니다.");
      }
    });
  };

  return (
    <div className="relative">
      <InputItem
        id="content"
        label="댓글"
        isTextArea
        isButton
        placeholder="댓글 작성하기"
        {...register("content", { required: true })}
      />
      <div className="absolute bottom-3 right-3">
        <InsertBtn onClick={handleSubmit(onSubmit)} disabled={!isValid || isLoading}>
          입력
        </InsertBtn>
      </div>
    </div>
  );
};

export default CreateComment;
