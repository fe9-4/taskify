"use client";

import { ChangeEvent, useEffect, useState, useCallback, useMemo } from "react";
import { useForm, SubmitHandler, Controller, useWatch, UseFormSetValue } from "react-hook-form";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateCardSchema, UpdateCardSchemaType, CardResponseSchemaType } from "@/zodSchema/cardSchema";
import axios from "axios";
import toast from "react-hot-toast";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useMember } from "@/hooks/useMember";
import { formatDateTime } from "@/utils/dateFormat";
import { CancelBtn, ConfirmBtn } from "@/components/button/ButtonComponents";
import StatusDropdown from "@/components/dropdown/StatusDropdown";
import SearchDropdown from "@/components/dropdown/SearchDropdown";
import InputItem from "@/components/input/InputItem";
import InputDate from "@/components/input/InputDate";
import InputTag from "@/components/input/InputTag";
import InputFile from "@/components/input/InputFile";
import { useAtom, useAtomValue } from "jotai";
import useLoading from "@/hooks/useLoading";
import { UpdateCardParamsAtom } from "@/store/modalAtom";
import { uploadType } from "@/types/uploadType";
import { UpdateCardProps } from "@/types/cardType";
import { useToggleModal } from "@/hooks/useToggleModal";
import { dashboardCardUpdateAtom } from "@/store/dashboardAtom";
import { ICurrentManager } from "@/types/currentManager";
import { useCard } from "@/hooks/useCard";
import { currentColumnListAtom } from "@/store/dashboardAtom";
import { useColumn } from "@/hooks/useColumn";

const UpdateCard = () => {
  const { dashboardId } = useParams();
  const cardId = useAtomValue(UpdateCardParamsAtom);
  const [, setDashboardCardUpdate] = useAtom(dashboardCardUpdateAtom);
  const [columnId, setColumnId] = useState<string>("");

  const { memberData } = useMember({
    dashboardId: Number(dashboardId),
  });

  const [selectedValue, setSelectedValue] = useState(0);

  const {
    uploadFile,
    isPending: isFileUploading,
    error: fileError,
  } = useFileUpload(`/api/columns/${columnId}/card-image`, uploadType.CARD);

  const [cardData, setCardData] = useState<CardResponseSchemaType | null>(null);
  const [tagInput, setTagInput] = useState("");

  const toggleModal = useToggleModal();
  const { isLoading, withLoading } = useLoading();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { updateCard } = useCard(Number(columnId));

  const { columns } = useColumn(Number(dashboardId));
  const [, setCurrentColumnList] = useAtom(currentColumnListAtom);

  useEffect(() => {
    if (columns) {
      setCurrentColumnList(columns);
    }
  }, [columns, setCurrentColumnList]);

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
    control,
    watch,
    trigger,
    formState: { errors },
    reset,
  } = useForm<UpdateCardSchemaType>({
    resolver: zodResolver(UpdateCardSchema),
    mode: "onChange",
    defaultValues: {
      assigneeUserId: 0,
      columnId: Number(columnId),
      title: "",
      description: "",
      dueDate: "",
      tags: [],
      imageUrl: "",
    },
  });

  const fetchCardData = useCallback(async () => {
    if (!cardId) {
      console.error("카드 ID가 없습니다.");
      return;
    }

    try {
      const response = await axios.get(`/api/cards/${cardId}`);
      const data: CardResponseSchemaType = response.data;

      setColumnId(String(data.columnId));
      setSelectedValue(data.columnId);
      setCardData(data);
      setPreviewUrl(data.imageUrl);

      reset({
        ...data,
        assigneeUserId: data.assignee?.id || 0,
        columnId: data.columnId,
        dueDate: data.dueDate ? formatDateTime(new Date(data.dueDate)) : "",
        tags: data.tags || [],
        imageUrl: data.imageUrl || "",
      });
    } catch (error) {
      console.error("카드 데이터 불러오기 실패:", error);
      toast.error("카드 데이터를 불러오는데 실패했습니다.");
    }
  }, [cardId, reset]);

  useEffect(() => {
    fetchCardData();
  }, [fetchCardData]);

  useEffect(() => {
    if (selectedValue) {
      setValue("columnId", selectedValue);
    }
  }, [selectedValue, setValue]);

  const title = watch("title");
  const description = watch("description");
  const dueDate = useWatch({ control, name: "dueDate" });
  const tags = useWatch({ control, name: "tags" });
  const assigneeUserId = watch("assigneeUserId");

  const isFormValid = useMemo(() => {
    const hasTitle = title?.trim() !== "";
    const hasDescription = description?.trim() !== "";
    const hasDueDate = !!dueDate;
    const hasTags = tags && tags.length > 0;
    const hasAssignee = assigneeUserId && assigneeUserId > 0;
    const hasImage = !!selectedFile || !!previewUrl;
    const hasColumnId = selectedValue > 0;

    return hasTitle && hasDescription && hasDueDate && hasTags && hasAssignee && hasImage && hasColumnId;
  }, [title, description, dueDate, tags, assigneeUserId, selectedFile, previewUrl, selectedValue]);

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
      setValue("imageUrl", "");
      return;
    }

    if (!(file instanceof File)) {
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onSubmit: SubmitHandler<UpdateCardSchemaType> = async (data) => {
    if (!selectedFile && !previewUrl) {
      toast.error("이미지를 선택해주세요");
      return;
    }

    await withLoading(async () => {
      try {
        let uploadedImageUrl = previewUrl;

        if (selectedFile) {
          uploadedImageUrl = await uploadFile(selectedFile);
          if (!uploadedImageUrl) {
            throw new Error("이미지 업로드 실패");
          }
        }

        const updateData = {
          cardId: Number(cardId),
          columnId: selectedValue,
          assigneeUserId: Number(data.assigneeUserId),
          title: data.title.trim(),
          description: data.description.trim(),
          dueDate: data.dueDate,
          tags: data.tags,
          imageUrl: uploadedImageUrl || "",
        };

        console.log("카드 수정 데이터:", updateData);
        await updateCard(updateData);
        toggleModal("updateCard", false);
        setDashboardCardUpdate(true);
      } catch (error) {
        console.error("카드 수정 오류:", error);
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
          <StatusDropdown setSelectedValueId={setSelectedValue} />
          <Controller
            name="assigneeUserId"
            control={control}
            defaultValue={cardData?.assignee?.id || 0}
            render={({ field }) => {
              const selectedMember = memberData.members.find((member) => member.userId === field.value);

              const currentManager = selectedMember || {
                id: cardData?.assignee?.id || 0,
                nickname: cardData?.assignee?.nickname || "",
                profileImageUrl: cardData?.assignee?.profileImageUrl || null,
              };

              return (
                <SearchDropdown
                  inviteMemberList={memberData.members}
                  currentManager={currentManager as ICurrentManager}
                  setManager={(manager) => {
                    field.onChange(manager.userId);
                    setValue("assigneeUserId", manager.userId);
                  }}
                  setValue={setValue as unknown as UseFormSetValue<UpdateCardProps>}
                  validation={managerValidation}
                />
              );
            }}
          />
        </div>

        <InputItem
          label="제목"
          id="title"
          {...register("title")}
          errors={errors.title && errors.title.message}
          required
        />

        <InputItem
          label="설명"
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
          required
          errors={errors.description && errors.description.message}
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
