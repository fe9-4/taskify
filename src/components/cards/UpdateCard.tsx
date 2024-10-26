"use client";
import { z } from "zod";
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
import StatusDropdown from "../dropdown/StatusDropdown";
import SearchDropdown from "@/components/dropdown/SearchDropdown";
import InputItem from "@/components/input/InputItem";
import InputDate from "@/components/input/InputDate";
import InputTag from "@/components/input/InputTag";
import InputFile from "@/components/input/InputFile";
import { useParams } from "next/navigation";
import { uploadType } from "@/types/uploadType";

const CardSchema = z.object({
  assigneeUserId: z.number(),
  columnId: z.number(),
  title: z.string().min(1, "제목은 필수입니다"),
  description: z.string().min(1, "설명은 필수입니다"),
  dueDate: z.string(),
  tags: z.array(z.string()),
  imageUrl: z.string().nullable(),
});

const UpdateCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [inviteMember, setInviteMember] = useState([]);
  const [manager, setManager] = useState("");
  const { user } = useAuth();
  const { cardId, columnId } = useParams();
  const [updateCard, setUpdateCard] = useState<CardProps | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isCardChanged, setIsCardChanged] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors, isValid },
  } = useForm<CardProps>({
    resolver: zodResolver(CardSchema),
    mode: "onChange",
  });

  const {
    uploadFile,
    isPending: isFileLoading,
    error: fileError,
  } = useFileUpload(`/api/columns/${columnId}/card-image`, uploadType.CARD);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await axios.get(`/api/cards/${cardId}`);
        setUpdateCard(response.data);
        reset(response.data);
        setPreviewImage(response.data.imageUrl);
      } catch (error) {
        console.error("카드 데이터 불러오기 실패:", error);
      }
    };

    fetchCardData();
  }, [cardId, reset]);

  useEffect(() => {
    if (user?.id) {
      setValue("assigneeUserId", Number(user.id));
    }
  }, [user, setValue]);

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
      let imageUrl = data.imageUrl;
      if (fileToUpload) {
        imageUrl = await uploadFile(fileToUpload);
      }

      const jsonData = {
        ...data,
        tags: JSON.stringify(data.tags),
        imageUrl: imageUrl,
      };

      const response = await axios.put(`/api/cards/${cardId}`, jsonData);
      setUpdateCard(response.data);

      if (response.data) {
        toast.success("카드가 수정되었습니다! 🎉");
        setIsCardChanged(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("카드 수정에 실패하였습니다.");
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

  return (
    <section className="rounded-2xl bg-white p-8">
      <h3 className="mb-5 text-2xl font-bold text-black03 md:mb-6 md:text-3xl">할 일 수정</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8">
        <div className="grid gap-8 md:flex md:gap-7">
          <div className="flex flex-col gap-2">
            <label htmlFor="assignee" className="text-lg font-medium text-black03">
              상태
            </label>
            <StatusDropdown setSelectedValue={setSelectedValue} currentValue={currentValue} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="assignee" className="text-lg font-medium text-black03">
              담당자
            </label>
            <SearchDropdown inviteMemberList={inviteMember} setManager={setManager} {...register("assigneeUserId")} />
          </div>
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

        {isFileLoading && <p>이미지 업로드 중...</p>}
        {fileError && <p className="text-error">{fileError}</p>}

        <div className="flex h-[42px] gap-3 md:h-[54px] md:gap-2">
          <CancelBtn type="button" onClick={() => ""}>
            취소
          </CancelBtn>
          <ConfirmBtn type="submit" disabled={!isValid || !isCardChanged} onClick={handleSubmit(onSubmit)}>
            수정
          </ConfirmBtn>
        </div>
      </form>
    </section>
  );
};

export default UpdateCard;
