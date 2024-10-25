"use client";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, KeyboardEvent, useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CardProps } from "@/types/cardType";
import { formatDateTime } from "@/utils/dateFormat";
import { CancelBtn, ConfirmBtn } from "@/components/button/ButtonComponents";
import SearchDropdown from "@/components/dropdown/SearchDropdown";
import InputItem from "@/components/input/InputItem";
import InputFile from "@/components/input/InputFile";
import InputDate from "@/components/input/InputDate";
import InputTag from "@/components/input/InputTag";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuth } from "@/hooks/useAuth";

const CardSchema = z.object({
  assigneeUserId: z.number(),
  dashboardId: z.number(),
  columnId: z.number(),
  title: z.string().min(1, "제목은 필수입니다"),
  description: z.string().min(1, "설명은 필수입니다"),
  dueDate: z.string().optional(), // optional(?) 값으로 설정
  tags: z.array(z.string()), // string[] 문자열 배열로 설정
  imageUrl: z.string().nullable(), // null 값으로 설정
});

const TestCard = () => {
  const [inviteMember, setInviteMember] = useState([]);
  const [Manager, setManager] = useState("");
  const { createFormData, isLoading: isFileLoading, error: fileError } = useFileUpload();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  // type UpdateTodo = z.infer<typeof TodoSchema>;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<CardProps>({
    resolver: zodResolver(CardSchema),
    mode: "onChange",
    defaultValues: {
      assigneeUserId: 4672,
      dashboardId: 12046,
      columnId: 40754,
      title: "",
      description: "",
      dueDate: "",
      tags: [],
      imageUrl: null,
    },
  });

  // 이미지 변경 핸들러
  const handleImageChange = async (file: string | File | null) => {
    if (file) {
      try {
        const formData = await createFormData(file);
        if (!formData) {
          throw new Error("FormData 생성 실패");
        }

        const columnId = watch("columnId"); // 현재 선택된 columnId 가져오기
        const response = await axios.post(`/api/column/${columnId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data?.imageUrl) {
          setImageUrl(response.data.imageUrl);
          setValue("imageUrl", response.data.imageUrl);
          toast.success("카드 이미지 업로드 완료");
        }
      } catch (error) {
        console.error("카드 이미지 업로드 오류:", error);
        toast.error("카드 이미지 업로드 실패");
      }
    } else {
      setImageUrl(null);
      setValue("imageUrl", null);
    }
  };

  const onSubmit: SubmitHandler<CardProps> = async (data) => {
    try {
      // FormData 대신 일반 객체 사용
      const jsonData = {
        ...data,
        tags: JSON.stringify(data.tags), // 태그는 JSON 문자열로 변환
      };

      const columnId = watch("columnId");
      const response = await axios.post(`/api/cards`, jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        toast.success("카드가 성공적으로 생성되었습니다.");
        console.log("카드 생성 성공: ", response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("카드 생성 중 에러가 발생했습니다.");
        console.error("카드 생성 실패:", error.response?.data?.message);
      } else {
        toast.error("네트워크 오류가 발생했습니다.");
        console.error("알 수 없는 에러: ", error);
      }
    }
  };

  // 태그 추가 함수
  const handleAddTag = (tag: string) => {
    if (tagInput.trim() && !watch("tags").includes(tag)) {
      setValue("tags", [...watch("tags"), tag]);
      setTagInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  // 태그 삭제 함수
  const handleTagClick = useCallback(
    (tagRemove: string) => {
      setValue(
        "tags",
        watch("tags").filter((tag: string) => tag !== tagRemove)
      );
    },
    [setValue, watch]
  );

  return (
    <section className="rounded-2xl bg-white p-8">
      <h3 className="mb-5 text-2xl font-bold text-black03 md:mb-6 md:text-3xl">할 일 생성</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="assignee" className="text-lg font-medium text-black03">
            담당자
          </label>
          <SearchDropdown inviteMemberList={inviteMember} setManager={setManager} {...register("assigneeUserId")} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="assignee" className="text-lg font-medium text-black03">
            제목 <span className="text-violet01">*</span>
          </label>
          <InputItem id="title" {...register("title")} errors={errors.title && errors.title.message} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="assignee" className="text-lg font-medium text-black03">
            설명 <span className="text-violet01">*</span>
          </label>
          <InputItem
            id="description"
            {...register("description", {
              required: "설명은 필수입니다",
              onChange: (e) => {
                setValue("description", e.target.value);
                trigger("description");
              },
            })}
            isTextArea
            size="description"
            errors={errors.description && errors.description.message}
          />
        </div>

        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <InputDate
              label="마감일"
              id="dueDate"
              name="dueDate"
              value={field.value}
              onChange={(date) => {
                // date가 null일 경우 빈 문자열로 처리
                const formattedDate = date ? formatDateTime(date) : "";
                field.onChange(formattedDate);
                setValue("dueDate", formattedDate);
              }}
              placeholder="날짜를 입력해 주세요"
            />
          )}
        />

        <InputTag
          tags={watch("tags")}
          tagInput={tagInput}
          onKeyDown={handleKeyDown}
          onClick={handleTagClick}
          onChange={handleTagChange}
        />

        <InputFile
          label="이미지"
          id="imageUrl"
          name="imageUrl"
          value={imageUrl}
          onChange={handleImageChange}
          size="todo"
        />

        <div className="flex h-[42px] gap-3 md:h-[54px] md:gap-2">
          <button type="submit" disabled={!isValid}>
            생성
          </button>
        </div>
      </form>
    </section>
  );
};

export default TestCard;
