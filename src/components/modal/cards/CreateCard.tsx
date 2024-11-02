"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardSchema } from "@/zodSchema/cardSchema";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMember } from "@/hooks/useMember";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useToggleModal } from "@/hooks/useModal";
import useLoading from "@/hooks/useLoading";
import { useAtomValue, useSetAtom } from "jotai";
import { dashboardCardUpdateAtom } from "@/store/dashboardAtom";
import { ColumnAtom } from "@/store/modalAtom";
import { CreateCardProps } from "@/types/cardType";
import { uploadType } from "@/types/uploadType";
import { CancelBtn, ConfirmBtn } from "@/components/button/ButtonComponents";
import SearchDropdown from "@/components/dropdown/SearchDropdown";
import InputItem from "@/components/input/InputItem";
import InputDate from "@/components/input/InputDate";
import InputTag from "@/components/input/InputTag";
import InputFile from "@/components/input/InputFile";
import toastMessages from "@/lib/toastMessage";

const CreateCard = () => {
  const { user } = useAuth();
  const { dashboardId } = useParams();
  const { columnId } = useAtomValue(ColumnAtom);
  const { memberData } = useMember({ dashboardId: Number(dashboardId) });

  const [tagInput, setTagInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoading();

  const toggleModal = useToggleModal();
  const setDashboardCardUpdate = useSetAtom(dashboardCardUpdateAtom);

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
    watch,
    trigger,
    control,
    formState: { errors },
  } = useForm<CreateCardProps>({
    resolver: zodResolver(CardSchema),
    mode: "onChange",
    defaultValues: {
      assigneeUserId: Number(user?.id || 0),
      dashboardId: Number(dashboardId),
      columnId: Number(columnId),
      title: "",
      description: "",
      dueDate: "",
      tags: [],
      imageUrl: null,
    },
  });

  const dueDate = useWatch({ control, name: "dueDate" });
  const tags = useWatch({ control, name: "tags" });
  const title = watch("title");
  const description = watch("description");

  const isFormValid = title.trim() && description.trim() && dueDate && tags.length > 0 && selectedFile !== null;

  const handleAddTag = (tag: string) => {
    if (tagInput.trim() && !tags.includes(tag)) {
      setValue("tags", [...tags, tag]);
      setTagInput("");
    }
  };

  const handleImageChange = (file: string | File | null) => {
    if (!file) {
      resetImage();
      return;
    }

    if (file instanceof File) {
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const resetImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValue("imageUrl", null);
  };

  const onSubmit: SubmitHandler<CreateCardProps> = async (data) => {
    await withLoading(async () => {
      try {
        let uploadedImageUrl = null;
        if (selectedFile) {
          uploadedImageUrl = await uploadFile(selectedFile);
          if (!uploadedImageUrl) throw new Error("이미지 업로드에 실패하였습니다.");
        }

        const cardData = { ...data, imageUrl: uploadedImageUrl };
        const response = await axios.post(`/api/cards`, cardData);

        if (response.data) {
          toast.success(toastMessages.success.createCard);
          toggleModal("createCard", false);
          setDashboardCardUpdate(true);
        }
      } catch (error) {
        toast.error(toastMessages.error.createCard);
      }
    });
  };

  return (
    <section className="w-[327px] rounded-2xl bg-white px-4 pb-5 pt-8 md:w-[584px] md:p-8 md:pt-10">
      <h3 className="mb-5 text-2xl font-bold text-black03 md:mb-6 md:text-3xl">할 일 생성</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:gap-8">
        <Controller
          name="assigneeUserId"
          control={control}
          render={({ field }) => {
            const selectedMember = memberData.members.find((member) => member.userId === field.value) || {
              id: 0,
              userId: 0,
              email: "",
              nickname: "",
              profileImageUrl: null,
            };

            return (
              <SearchDropdown
                inviteMemberList={memberData.members}
                currentManager={selectedMember}
                setManager={(manager) => {
                  field.onChange(manager.userId);
                  setValue("assigneeUserId", manager.userId);
                }}
                setValue={setValue}
              />
            );
          }}
        />

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
        />

        <InputDate
          label="마감일"
          id="dueDate"
          placeholder="날짜를 입력해 주세요"
          value={watch("dueDate")}
          onChange={(formattedDate) => setValue("dueDate", formattedDate)}
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
          <CancelBtn type="button" onClick={() => toggleModal("createCard", false)}>
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
