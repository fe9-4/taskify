"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, ChangeEvent, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useFileUpload } from "@/hooks/useFileUpload";
import { CardProps } from "@/types/cardType";
import { formatDateTime } from "@/utils/dateFormat";
import { CancelBtn, ConfirmBtn } from "@/components/button/ButtonComponents";
import SearchDropdown from "@/components/dropdown/SearchDropdown";
import InputItem from "@/components/input/InputItem";
import InputDate from "@/components/input/InputDate";
import InputTag from "@/components/input/InputTag";
import InputFile from "@/components/input/InputFile";
import { useParams } from "next/navigation";
import { uploadType } from "@/types/uploadType";
import { CardForm, CardFormSchema, CardResponseSchema } from "@/zodSchema/cardSchema";
import { useDashboardMember } from "@/hooks/useDashboardMember";
import { useAtomValue, useSetAtom } from "jotai";
import { CreateCardAtom } from "@/store/modalAtom";

interface CreateCardProps {
  closePopup: () => void;
  onCardCreated: (cardId: number) => void;
}

interface ICurrentManager {
  id: number;
  email: string;
  nickname: string;
}

export default function CreateCard({ closePopup, onCardCreated }: CreateCardProps) {
  const params = useParams();
  const createCardAtom = useAtomValue(CreateCardAtom);
  const [currentManager, setCurrentManager] = useState<ICurrentManager | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [isCardChanged, setIsCardChanged] = useState(false);

  const dashboardId = Number(params.dashboardId);
  const columnId = createCardAtom.columnId;

  if (dashboardId === undefined) {
    throw new Error("dashboardId 가 없습니다.");
  }

  if (columnId === undefined) {
    throw new Error("columnId 가 없습니다.");
  }

  const { members } = useDashboardMember({ dashboardId, page: 1, size: 100 });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<CardForm>({
    resolver: zodResolver(CardFormSchema),
    mode: "onChange",
    defaultValues: {
      assigneeUserId: 0,
      dashboardId: dashboardId,
      columnId: columnId || undefined,
      title: "",
      description: "",
      dueDate: "",
      tags: [],
      imageUrl: null,
    },
  });

  // 멤버 리스트가 로드되면 첫 번째 항목을 기본값으로 설정
  useEffect(() => {
    if (members.members && members.members.length > 0) {
      const firstMember = members.members[0];
      setValue("assigneeUserId", firstMember.userId);
      setCurrentManager(firstMember);
    }
  }, [members.members, setValue]);

  const currentColumnId = watch("columnId");
  const {
    uploadFile,
    isPending: isFileLoading,
    error: fileError,
  } = useFileUpload(`/api/columns/${currentColumnId}/card-image`, uploadType.CARD);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name) {
        setIsCardChanged(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleImageChange = (fileOrString: File | string | null) => {
    if (fileOrString instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(fileOrString);
      setFileToUpload(fileOrString);
    } else if (typeof fileOrString === "string") {
      setPreviewImage(fileOrString);
      setFileToUpload(null);
    } else {
      setPreviewImage(null);
      setFileToUpload(null);
    }
    setIsCardChanged(true);
  };

  const onSubmit: SubmitHandler<CardProps> = async (data) => {
    try {
      let imageUrl = null;
      if (fileToUpload) {
        imageUrl = await uploadFile(fileToUpload);
      }

      const jsonData = {
        ...data,
        tags: JSON.stringify(data.tags),
        imageUrl: imageUrl,
      };

      const response = await axios.post(`/api/cards`, jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const validatedResponse = CardResponseSchema.parse(response.data);

      if (validatedResponse) {
        toast.success("카드가 생성되었습니다! 🎉");
        setIsCardChanged(false);
        onCardCreated(validatedResponse.id);
        closePopup();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("카드 생성에 실패하였습니다.");
      } else {
        toast.error("네트워크 오류가 발생했습니다.");
      }
    }
  };

  const handleAddTag = (tag: string) => {
    if (tagInput.trim() && !watch("tags").includes(tag)) {
      setValue("tags", [...watch("tags"), tag]);
      setTagInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagClick = useCallback(
    (tagRemove: string) => {
      setValue(
        "tags",
        watch("tags").filter((tag: string) => tag !== tagRemove)
      );
    },
    [setValue, watch]
  );

  const setCreateCardAtom = useSetAtom(CreateCardAtom);

  const handleClosePopup = () => {
    setCreateCardAtom({ isOpen: false, columnId: null });
    closePopup();
  };

  return (
    <section className="mx-auto max-w-2xl rounded-2xl bg-background p-6 shadow-lg md:p-8">
      <h3 className="mb-6 text-2xl font-bold text-foreground md:mb-8 md:text-3xl">할 일 생성</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
        <div className="space-y-2">
          <label htmlFor="assignee" className="text-lg font-medium text-foreground">
            담당자
          </label>
          <SearchDropdown
            inviteMemberList={members.members || []}
            setManager={(selectedManager: ICurrentManager) => {
              setValue("assigneeUserId", selectedManager.userId);
              setCurrentManager(selectedManager);
            }}
            currentManager={currentManager || undefined}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="text-lg font-medium text-foreground">
            제목 <span className="text-primary">*</span>
          </label>
          <InputItem id="title" {...register("title")} errors={errors.title && errors.title.message} />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-lg font-medium text-foreground">
            설명 <span className="text-primary">*</span>
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
                const formattedDate = date ? formatDateTime(date) : "";
                field.onChange(formattedDate);
                setValue("dueDate", formattedDate);
              }}
              placeholder="날짜를 입력해 주세요"
              width="w-[287px] md:w-[472px]"
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
          value={previewImage}
          onChange={handleImageChange}
          size="todo"
        />

        {isFileLoading && <p className="text-muted-foreground text-sm">이미지 업로드 중...</p>}
        {fileError && <p className="text-destructive text-sm">{fileError}</p>}

        <div className="flex gap-3 md:gap-4">
          <CancelBtn type="button" onClick={handleClosePopup}>
            취소
          </CancelBtn>
          <ConfirmBtn type="submit" disabled={!isValid || !isCardChanged} onClick={handleSubmit(onSubmit)}>
            생성
          </ConfirmBtn>
        </div>
      </form>
    </section>
  );
}
