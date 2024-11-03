"use client";

import { ChangeEvent, useEffect, useState, useCallback, useMemo } from "react";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateCardSchema } from "@/zodSchema/cardSchema";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMember } from "@/hooks/useMember";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useToggleModal } from "@/hooks/useModal";
import useLoading from "@/hooks/useLoading";
import { useSetAtom, useAtomValue } from "jotai";
import { ColumnAtom, CardIdAtom } from "@/store/modalAtom";
import { columnCardsAtom, dashboardCardUpdateAtom } from "@/store/dashboardAtom";
import { CardDataType, UpdateCardProps } from "@/types/cardType";
import { uploadType } from "@/types/uploadType";
import { CancelBtn, ConfirmBtn } from "@/components/button/ButtonComponents";
import StatusDropdown from "@/components/dropdown/StatusDropdown";
import SearchDropdown from "@/components/dropdown/SearchDropdown";
import InputItem from "@/components/input/InputItem";
import InputDate from "@/components/input/InputDate";
import InputTag from "@/components/input/InputTag";
import InputFile from "@/components/input/InputFile";
import toastMessages from "@/lib/toastMessage";

const UpdateCard = () => {
  const { user } = useAuth();
  const { dashboardId } = useParams();
  const { columnId } = useAtomValue(ColumnAtom);
  const cardId = useAtomValue(CardIdAtom);
  const [tagInput, setTagInput] = useState("");
  const [cardData, setCardData] = useState<CardDataType | null>(null);
  const [selectedValue, setSelectedValue] = useState(columnId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoading();
  const toggleModal = useToggleModal();
  const setDashboardCardUpdate = useSetAtom(dashboardCardUpdateAtom);
  const setColumnCards = useSetAtom(columnCardsAtom);

  const {
    uploadFile,
    isPending: isFileUploading,
    error: fileError,
  } = useFileUpload(`/api/columns/${columnId}/card-image`, uploadType.CARD);

  useEffect(() => {
    if (fileError) {
      toast.error(toastMessages.error.uploardImage);
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
      columnId: columnId,
      title: "",
      description: "",
      dueDate: "",
      tags: [],
      imageUrl: null,
    },
  });

  const fetchCardData = useCallback(async () => {
    if (!cardId) return;

    try {
      const response = await axios.get(`/api/cards/${cardId}`);
      const data = response.data;

      setCardData(data);
      setPreviewUrl(data.imageUrl);

      reset({
        ...data,
        assigneeUserId: data.assignee.id,
        tags: data.tags || [],
      });
    } catch {
      toast.error(toastMessages.error.getCard);
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
      title.trim() !== "" &&
      description.trim() !== "" &&
      !!dueDate &&
      tags.length > 0 &&
      (selectedFile !== null || previewUrl !== null) &&
      selectedValue > 0 &&
      Number(watch("assigneeUserId")) > 0,
    [title, description, dueDate, tags, selectedFile, previewUrl, watch]
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

    if (file instanceof File) {
      setSelectedFile(file);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onSubmit: SubmitHandler<UpdateCardProps> = async (data) => {
    if (!data.tags || data.tags.length === 0) {
      toast.error("태그를 하나 이상 입력해주세요.");
      return;
    }

    await withLoading(async () => {
      try {
        let uploadedImageUrl = previewUrl;

        if (selectedFile) {
          uploadedImageUrl = await uploadFile(selectedFile);
          if (!uploadedImageUrl) throw new Error("이미지 업로드 중 오류 발생");
        }

        if (!data.title || !data.description || !data.dueDate || !uploadedImageUrl || !data.assigneeUserId) {
          throw new Error("필수 항목이 누락되었습니다.");
        }

        const cardData = {
          columnId: selectedValue,
          assigneeUserId: Number(data.assigneeUserId),
          title: data.title.trim(),
          description: data.description.trim(),
          dueDate: data.dueDate,
          tags: data.tags,
          imageUrl: uploadedImageUrl,
        };

        const response = await axios.put(`/api/cards/${cardId}`, cardData);
        if (response.status === 200) {
          const updatedCard = {
            ...response.data,
            tags: response.data.tags,
          };

          if (columnId !== selectedValue) {
            setColumnCards((prev) => {
              const sourceColumn = prev[columnId];
              const targetColumn = prev[selectedValue];

              if (!sourceColumn || !targetColumn) {
                return prev;
              }

              return {
                ...prev,
                [columnId]: {
                  ...sourceColumn,
                  cards: sourceColumn.cards.filter((card) => card.id !== cardId),
                  totalCount: Math.max(0, sourceColumn.totalCount - 1),
                },
                [selectedValue]: {
                  ...targetColumn,
                  cards: [updatedCard, ...targetColumn.cards],
                  totalCount: targetColumn.totalCount + 1,
                },
              };
            });
          }

          toast.success(toastMessages.success.editCard);
          toggleModal("updateCard", false);
          setDashboardCardUpdate(true);
        }
      } catch (error) {
        console.error("Card update error:", error);
        toast.error(toastMessages.error.editCard);
      }
    });
  };

  const {
    memberData,
    isLoading: isMemberLoading,
    error: memberError,
  } = useMember({
    dashboardId: Number(dashboardId),
    page: 1,
    size: 100,
    enabled: !!dashboardId,
  });

  useEffect(() => {
    if (memberError) {
      toggleModal("updateCard", false);
    }
  }, [memberError, toggleModal]);

  if (isMemberLoading) {
    return (
      <div className="flex h-[400px] w-[327px] items-center justify-center rounded-2xl bg-white md:w-[584px]">
        <span className="text-gray02">멤버 정보를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <section className="w-[327px] rounded-2xl bg-white p-4 md:w-[584px] md:p-8">
      <h3 className="mb-5 text-2xl font-bold text-black03 md:mb-6 md:text-3xl">할 일 수정</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8">
        <div className="grid gap-8 md:flex md:gap-7">
          <StatusDropdown setSelectedValueId={setSelectedValue} />
          <Controller
            name="assigneeUserId"
            control={control}
            defaultValue={cardData?.assignee?.userId}
            render={({ field }) => (
              <SearchDropdown
                inviteMemberList={memberData.members}
                currentManager={
                  field.value ? memberData.members.find((member) => member.userId === field.value) : cardData?.assignee
                }
                setManager={(manager) => {
                  field.onChange(manager.userId);
                  setValue("assigneeUserId", manager.userId);
                }}
                setValue={setValue}
              />
            )}
          />
        </div>

        <InputItem
          label="제목"
          id="title"
          {...register("title")}
          placeholder="제목을 입력해 주세요"
          errors={errors.title?.message}
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
          errors={errors.description?.message}
          value={watch("description")}
        />

        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <InputDate
              label="마감일"
              id="dueDate"
              value={field.value}
              onChange={field.onChange}
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
