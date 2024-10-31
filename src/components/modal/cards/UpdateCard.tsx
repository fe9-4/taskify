"use client";

import { ChangeEvent, useEffect, useState, useCallback, useMemo } from "react";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateCardSchema } from "@/zodSchema/cardSchema";
import axios from "axios";
import toast from "react-hot-toast";
import { useAtomValue } from "jotai";
import { useAuth } from "@/hooks/useAuth";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useMember } from "@/hooks/useMember";
import { useToggleModal } from "@/hooks/useToggleModal";
import { formatDateTime } from "@/utils/dateFormat";
import useLoading from "@/hooks/useLoading";
import { UpdateCardParamsAtom } from "@/store/modalAtom";
import { uploadType } from "@/types/uploadType";
import { UpdateCardProps } from "@/types/cardType";
import { CancelBtn, ConfirmBtn } from "@/components/button/ButtonComponents";
import StatusDropdown from "@/components/dropdown/StatusDropdown";
import SearchDropdown from "@/components/dropdown/SearchDropdown";
import InputItem from "@/components/input/InputItem";
import InputDate from "@/components/input/InputDate";
import InputTag from "@/components/input/InputTag";
import InputFile from "@/components/input/InputFile";

interface CardDataType extends UpdateCardProps {
  assignee: {
    id: number;
    userId: number;
    nickname: string;
    email: string;
    profileImageUrl: string | null;
  };
  status?: string;
}

const UpdateCard = () => {
  const { user } = useAuth();
  const { dashboardId } = useParams();
  const cardId = useAtomValue(UpdateCardParamsAtom);
  const [columnId, setColumnId] = useState<string>("");
  const { memberData } = useMember({ dashboardId: Number(dashboardId) });
  const [tagInput, setTagInput] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [cardData, setCardData] = useState<CardDataType | null>(null);
  const toggleModal = useToggleModal();
  const { isLoading, withLoading } = useLoading();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    uploadFile,
    isPending: isFileUploading,
    error: fileError,
  } = useFileUpload(`/api/columns/${columnId}/card-image`, uploadType.CARD);

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
    trigger,
    control,
    formState: { errors },
  } = useForm<UpdateCardProps>({
    resolver: zodResolver(UpdateCardSchema),
    mode: "onChange",
    defaultValues: {
      assigneeUserId: Number(user?.id) || 0,
      columnId: Number(columnId),
      title: "",
      description: "",
      dueDate: "",
      tags: [],
      imageUrl: null,
    },
  });

  const fetchCardData = useCallback(async () => {
    if (!cardId) {
      console.error("카드 ID가 없습니다.");
      return;
    }

    try {
      const response = await axios.get(`/api/cards/${cardId}`);
      const data = response.data;

      setColumnId(String(data.columnId));
      setCurrentValue(data.status || "toDo");
      setSelectedValue(data.status || "toDo");

      setCardData(data);
      setPreviewUrl(data.imageUrl);

      reset({
        ...data,
        assigneeUserId: data.assignee.id,
        tags: data.tags || [],
        imageUrl: data.imageUrl,
      });
    } catch (error) {
      toast.error("카드 데이터를 불러오는데 실패했습니다.");
    }
  }, [cardId, reset]);

  useEffect(() => {
    fetchCardData();
  }, [fetchCardData]);

  const dueDate = useWatch({ control, name: "dueDate" });
  const tags = useWatch({ control, name: "tags" });
  const title = watch("title");
  const description = watch("description");

  const isFormValid = useMemo(
    () =>
      title?.trim() !== "" &&
      description?.trim() !== "" &&
      !!dueDate &&
      tags.length > 0 &&
      (selectedFile !== null || previewUrl !== null) &&
      (!!selectedValue || !!currentValue) &&
      Number(watch("assigneeUserId")) > 0,
    [title, description, dueDate, tags, selectedFile, previewUrl, selectedValue, currentValue, watch]
  );

  const handleAddTag = (tag: string) => {
    if (tagInput.trim() && !tags.includes(tag)) {
      setValue("tags", [...tags, tag]);
      setTagInput("");
    }
  };

  const handleImageChange = (file: string | File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setValue("imageUrl", null);
      return;
    }

    if (!(file instanceof File)) {
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onSubmit: SubmitHandler<UpdateCardProps> = async (data) => {
    await withLoading(async () => {
      try {
        let uploadedImageUrl = previewUrl;

        if (selectedFile) {
          uploadedImageUrl = await uploadFile(selectedFile);
          if (!uploadedImageUrl) {
            throw new Error("이미지 업로드 실패");
          }
        }

        const cardData = {
          columnId: Number(columnId),
          assigneeUserId: Number(data.assigneeUserId),
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          tags: data.tags,
          imageUrl: uploadedImageUrl,
        };

        const response = await axios.put(`/api/cards/${cardId}`, cardData);
        if (response.data) {
          toast.success("카드가 수정되었습니다! 🎉");
          toggleModal("updateCard", false);
        }
      } catch (error) {
        toast.error("카드 수정에 실패하였습니다.");
      }
    });
  };

  return (
    <section className="w-[327px] rounded-2xl bg-white p-8 md:w-[584px]">
      <h3 className="mb-5 text-2xl font-bold text-black03 md:mb-6 md:text-3xl">할 일 수정</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8">
        <div className="grid gap-8 md:flex md:gap-7">
          <StatusDropdown setSelectedValue={setSelectedValue} currentValue={currentValue} />

          <Controller
            name="assigneeUserId"
            control={control}
            defaultValue={cardData?.assignee?.userId}
            render={({ field }) => {
              const selectedMember = memberData.members.find((member) => member.userId === field.value);

              const currentManager = selectedMember || {
                id: cardData?.assignee?.id || 0,
                userId: cardData?.assignee?.userId || 0,
                email: cardData?.assignee?.email || "",
                nickname: cardData?.assignee?.nickname || "",
                profileImageUrl: cardData?.assignee?.profileImageUrl || null,
              };

              return (
                <SearchDropdown
                  inviteMemberList={memberData.members}
                  currentManager={currentManager}
                  setManager={(manager) => {
                    field.onChange(manager.userId);
                    setValue("assigneeUserId", manager.userId);
                  }}
                  setValue={setValue}
                />
              );
            }}
          />
        </div>

        <InputItem
          label="제목"
          id="title"
          {...register("title")}
          placeholder="제목을 입력해 주세요"
          errors={errors.title && errors.title.message}
        />

        <InputItem
          label="설명"
          id="description"
          {...register("description", {
            onChange: (e) => {
              setValue("description", e.target.value);
              trigger("description");
            },
          })}
          isTextArea
          size="description"
          placeholder="설명을 입력해 주세요"
          errors={errors.description && errors.description.message}
          value={watch("description")}
        />

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
              tags.filter((t: string) => t !== tag)
            )
          }
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
        />

        <InputFile
          label="이미지"
          id="imageUrl"
          name="imageUrl"
          value={previewUrl}
          onChange={handleImageChange}
          size="todo"
        />

        <div className="flex h-[42px] gap-3 md:h-[54px] md:gap-2">
          <CancelBtn type="button" onClick={() => toggleModal("updateCard", false)}>
            취소
          </CancelBtn>
          <ConfirmBtn type="submit" disabled={!isFormValid || isLoading || isFileUploading}>
            수정
          </ConfirmBtn>
        </div>
      </form>
    </section>
  );
};

export default UpdateCard;
