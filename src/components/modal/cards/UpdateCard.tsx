"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardSchema } from "@/zodSchema/cardSchema";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useDashboardMember } from "@/hooks/useDashboardMember";
import { formatDateTime } from "@/utils/dateFormat";
import { UpdateCardProps } from "@/types/cardType";
import { CancelBtn, ConfirmBtn } from "@/components/button/ButtonComponents";
import StatusDropdown from "@/components/dropdown/StatusDropdown";
import SearchDropdown from "@/components/dropdown/SearchDropdown";
import InputItem from "@/components/input/InputItem";
import InputDate from "@/components/input/InputDate";
import InputTag from "@/components/input/InputTag";
import InputFile from "@/components/input/InputFile";

import { useAtom } from "jotai";
import useLoading from "@/hooks/useLoading";
import { UpdateCardAtom } from "@/store/modalAtom";
import { uploadType } from "@/types/uploadType";

const UpdateCard = () => {
  const { dashboardId, columnId, cardId } = useParams();
  const { members } = useDashboardMember({
    dashboardId: Number(dashboardId),
  });

  const [selectedValue, setSelectedValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const { user } = useAuth();

  const {
    uploadFile,
    isPending: isFileUploading,
    error: fileError,
  } = useFileUpload(`/api/columns/${columnId}/card-image`, uploadType.CARD);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [cardData, setCardData] = useState();
  const [tagInput, setTagInput] = useState("");

  const [, setIsUpdateCardOpen] = useAtom(UpdateCardAtom);
  const { isLoading, withLoading } = useLoading();

  useEffect(() => {
    if (fileError) {
      toast.error("이미지 업로드 중 오류가 발생했습니다.");
      console.error("파일 업로드 에러:", fileError);
    }
  }, [fileError]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<UpdateCardProps>({
    // resolver: zodResolver(CardSchema),
    // mode: "onChange",
    defaultValues: {
      assigneeUserId: Number(user && user.id),
      columnId: 40993,
      title: "",
      description: "",
      dueDate: "",
      tags: [],
      imageUrl: null,
      assignee: {
        id: 0,
        nickname: "",
        profileImageUrl: null,
      },
    },
  });

  // 카드 데이터를 가져오는 함수
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await axios.get(`/api/cards/${cardId}`);
        const data = response.data;

        setCardData(data); // UI 업데이트용 state
        reset({
          ...data, // 데이터의 나머지 필드 포함
          assignee: data.assignee
            ? {
                // assignee가 존재하는지 확인 후 추가
                id: data.assignee.id,
                nickname: data.assignee.nickname,
                profileImageUrl: data.assignee.profileImageUrl,
              }
            : null,
        });
      } catch (error) {
        console.error("카드 데이터 불러오기 실패:", error);
      }
    };

    fetchCardData();
  }, [cardId]);

  const dueDate = useWatch({ control, name: "dueDate" });
  const tags = useWatch({ control, name: "tags" });

  // 폼의 전체 유효성 체크
  const isFormValid = isValid && !!dueDate && tags.length > 0;

  const handleAddTag = (tag: string) => {
    if (tagInput.trim() && !tags.includes(tag)) {
      setValue("tags", [...tags, tag]);
      setTagInput("");
    }
  };

  // 이미지 변경 핸들러 수정
  const handleImageChange = async (file: string | File | null) => {
    if (!file) {
      setImageUrl(null);
      setValue("imageUrl", null);
      return;
    }

    if (!(file instanceof File)) {
      return;
    }

    try {
      const uploadedUrl = await uploadFile(file);
      setImageUrl(uploadedUrl);
      setValue("imageUrl", uploadedUrl);
      toast.success("카드 이미지 업로드가 완료되었습니다.");
    } catch (error) {
      toast.error("카드 이미지 업로드에 실패했습니다.");
      console.error("이미지 업로드 에러:", error);
      setImageUrl(null);
      setValue("imageUrl", null);
    }
  };

  const onSubmit: SubmitHandler<UpdateCardProps> = async (data: any) => {
    await withLoading(async () => {
      try {
        console.log(data);
        const response = await axios.put(`/api/cards/${cardId}`, data);
        setCardData(response.data);
        if (response.data) toast.success("카드가 수정되었습니다! 🎉");
        setIsUpdateCardOpen(false);
      } catch (error) {
        toast.error("카드 수정에 실패하였습니다.");
      }
    });
  };

  const managerValidation = register("assigneeUserId", {
    required: {
      value: true,
      message: "담당자를 선택해 주세요",
    },
  });

  return (
    <section className="w-[327px] rounded-2xl bg-white p-8 md:w-[584px]">
      <h3 className="mb-5 text-2xl font-bold text-black03 md:mb-6 md:text-3xl">할 일 수정</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8">
        <div className="grid gap-8 md:flex md:gap-7">
          <StatusDropdown setSelectedValue={setSelectedValue} currentValue={currentValue} />

          <Controller
            name="assignee"
            control={control}
            render={({ field }) => (
              <SearchDropdown
                inviteMemberList={members.members}
                currentManager={field.value}
                setManager={(manager) => field.onChange(manager)}
                setValue={setValue}
                // value={updateCard}
                validation={managerValidation}
                // {...register("assignee")}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-lg font-medium text-black03">
            제목 <span className="text-violet01">*</span>
          </label>
          <InputItem id="title" {...register("title")} errors={errors.title && errors.title.message} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-lg font-medium text-black03">
            설명 <span className="text-violet01">*</span>
          </label>
          <InputItem
            id="description"
            {...register("description")}
            // isTextArea
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
                const formattedDate = date ? formatDateTime(date) : "";
                field.onChange(formattedDate);
                setValue("dueDate", formattedDate);
              }}
              placeholder="날짜를 입력해 주세요"
            />
          )}
        />

        <InputTag
          tags={tags}
          tagInput={tagInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag(tagInput);
            }
          }}
          onClick={(tag) =>
            setValue(
              "tags",
              tags.filter((t) => t !== tag)
            )
          }
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
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
          <CancelBtn type="button" onClick={() => setIsUpdateCardOpen(false)}>
            취소
          </CancelBtn>
          <ConfirmBtn
            type="submit"
            disabled={!isValid || isLoading || isFileUploading}
            onClick={handleSubmit(onSubmit)}
          >
            수정
          </ConfirmBtn>
        </div>
      </form>
    </section>
  );
};

export default UpdateCard;
