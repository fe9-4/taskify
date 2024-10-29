"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardSchema } from "@/zodSchema/cardSchema";
import axios from "axios";
import toast from "react-hot-toast";
import useLoading from "@/hooks/useLoading";
import { useAuth } from "@/hooks/useAuth";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useMember } from "@/hooks/useMember";
import { formatDateTime } from "@/utils/dateFormat";
import { CreateCardProps } from "@/types/cardType";
import { CancelBtn, ConfirmBtn } from "@/components/button/ButtonComponents";
import SearchDropdown from "@/components/dropdown/SearchDropdown";
import InputItem from "@/components/input/InputItem";
import InputDate from "@/components/input/InputDate";
import InputTag from "@/components/input/InputTag";
import InputFile from "@/components/input/InputFile";
import { useAtom, useAtomValue } from "jotai";
import { CreateCardAtom, CreateCardParamsAtom } from "@/store/modalAtom";
import { uploadType } from "@/types/uploadType";

const CreateCard = () => {
  const { user } = useAuth();
  const { dashboardId } = useParams();
  const { members } = useMember({ dashboardId: Number(dashboardId) });
  const columnId = useAtomValue(CreateCardParamsAtom);
  const [, setIsCreateCardOpen] = useAtom(CreateCardAtom);
  const { isLoading, withLoading } = useLoading();

  const {
    uploadFile,
    isPending: isFileUploading,
    error: fileError,
  } = useFileUpload(`/api/columns/${columnId}/card-image`, uploadType.CARD);

  useEffect(() => {
    if (fileError) {
      toast.error("이미지 업로드 중 오류가 발생했습니다.");
    }
  }, [fileError]);

  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    control,
    formState: { errors },
  } = useForm<CreateCardProps>({
    resolver: zodResolver(CardSchema),
    mode: "onChange",
    defaultValues: {
      assigneeUserId: Number(user && user.id),
      dashboardId: Number(dashboardId),
      columnId: Number(columnId),
      title: "",
      description: "",
      dueDate: "",
      tags: [],
      imageUrl: null,
    },
  });

  // 폼 필드 값 실시간 감시
  const dueDate = useWatch({ control, name: "dueDate" });
  const tags = useWatch({ control, name: "tags" });
  const title = watch("title");
  const description = watch("description");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isFormValid =
    title?.trim() !== "" && description?.trim() !== "" && !!dueDate && tags.length > 0 && selectedFile !== null;

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
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const onSubmit: SubmitHandler<CreateCardProps> = async (data) => {
    await withLoading(async () => {
      try {
        let uploadedImageUrl = null;
        if (selectedFile) {
          uploadedImageUrl = await uploadFile(selectedFile);
          if (!uploadedImageUrl) {
            throw new Error("이미지 업로드 실패");
          }
        }

        const cardData = {
          ...data,
          imageUrl: uploadedImageUrl,
        };

        const response = await axios.post(`/api/cards`, cardData);
        if (response.data) {
          toast.success("카드가 생성되었습니다! 🎉");
          setIsCreateCardOpen(false);
        }
      } catch (error) {
        toast.error("카드 생성에 실패하였습니다.");
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
    <section className="w-[327px] rounded-2xl bg-white px-4 pb-5 pt-8 md:w-[584px] md:p-8 md:pt-10">
      <h3 className="mb-5 text-2xl font-bold text-black03 md:mb-6 md:text-3xl">할 일 생성</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:gap-8">
        <Controller
          name="assigneeUserId"
          control={control}
          render={({ field }) => {
            const selectedMember = members.members.find((member) => member.userId === field.value);

            const currentManager = selectedMember || {
              id: 0,
              userId: 0,
              email: "",
              nickname: "",
              profileImageUrl: null,
            };

            return (
              <SearchDropdown
                inviteMemberList={members.members}
                currentManager={currentManager}
                setManager={(manager) => {
                  field.onChange(manager.userId);
                  setValue("assigneeUserId", manager.userId);
                }}
                setValue={setValue}
                validation={managerValidation}
              />
            );
          }}
        />

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
          <CancelBtn type="button" onClick={() => setIsCreateCardOpen(false)}>
            취소
          </CancelBtn>
          <ConfirmBtn type="submit" disabled={!isFormValid || isLoading || isFileUploading}>
            생성
          </ConfirmBtn>
        </div>
      </form>
    </section>
  );
};

export default CreateCard;
