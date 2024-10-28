"use client";

import { ChangeEvent, useState } from "react";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardSchema } from "@/zodSchema/cardSchema";
import axios from "axios";
import toast from "react-hot-toast";
import useLoading from "@/hooks/useLoading";
import { useAuth } from "@/hooks/useAuth";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useDashboardMember } from "@/hooks/useDashboardMember";
import { formatDateTime } from "@/utils/dateFormat";
import { CreateCardProps } from "@/types/cardType";
import { CancelBtn, ConfirmBtn } from "@/components/button/ButtonComponents";
import SearchDropdown from "@/components/dropdown/SearchDropdown";
import InputItem from "@/components/input/InputItem";
import InputDate from "@/components/input/InputDate";
import InputTag from "@/components/input/InputTag";
import InputFile from "@/components/input/InputFile";

import { useAtom } from "jotai";
import { CreateCardAtom } from "@/store/modalAtom";

const CreateCard = () => {
  const { user } = useAuth();
  const { dashboardId, columnId } = useParams();
  const { members } = useDashboardMember({ dashboardId: Number(dashboardId) });

  const { createFormData, isLoading: isFileLoading, error: fileError } = useFileUpload();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  const [, setIsCreateCardOpen] = useAtom(CreateCardAtom);
  const { isLoading, withLoading } = useLoading();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    control,
    formState: { errors, isValid },
  } = useForm<CreateCardProps>({
    resolver: zodResolver(CardSchema),
    mode: "onChange",
    defaultValues: {
      assigneeUserId: Number(user && user.id),
      dashboardId: Number(dashboardId),
      columnId: 40993,
      title: "",
      description: "",
      dueDate: "",
      tags: [],
      imageUrl: null,
    },
  });

  const dueDate = useWatch({ control, name: "dueDate" });
  const tags = useWatch({ control, name: "tags" });

  // 폼의 전체 유효성 체크
  const isFormValid = isValid && !!dueDate && tags.length > 0 && !!imageUrl;

  const handleAddTag = (tag: string) => {
    if (tagInput.trim() && !tags.includes(tag)) {
      setValue("tags", [...tags, tag]);
      setTagInput("");
    }
  };

  // 이미지 변경 핸들러 (이미지를 넣지 않으면 카드 생성 실패함)
  const handleImageChange = async (file: string | File | null) => {
    if (file) {
      try {
        const formData = await createFormData(file);
        if (!formData) {
          throw new Error("FormData 생성 실패");
        }

        const columnId = watch("columnId"); // 현재 선택된 columnId 가져오기
        const response = await axios.post(`/api/columns/${columnId}/card-image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data?.imageUrl) {
          setImageUrl(response.data.imageUrl);
          setValue("imageUrl", response.data.imageUrl);
          toast.success("카드 이미지 업로드가 완료되었습니다.");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error("카드 이미지 업로드에 실패했습니다.");
        } else {
          toast.error("네트워크 오류가 발생했습니다.");
        }
      }
    } else {
      setImageUrl(null);
      setValue("imageUrl", null);
    }
  };

  const onSubmit: SubmitHandler<CreateCardProps> = async (data) => {
    await withLoading(async () => {
      try {
        console.log(data);
        const response = await axios.post(`/api/cards`, data);
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
          name="assignee"
          control={control}
          render={({ field }) => (
            <SearchDropdown
              inviteMemberList={members.members}
              currentManager={field.value}
              setManager={(manager) => field.onChange(manager)}
              setValue={setValue}
              validation={managerValidation}
            />
          )}
        />

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
          <CancelBtn type="button" onClick={() => setIsCreateCardOpen(false)}>
            취소
          </CancelBtn>
          <ConfirmBtn type="submit" disabled={!isFormValid || isLoading} onClick={handleSubmit(onSubmit)}>
            생성
          </ConfirmBtn>
        </div>
      </form>
    </section>
  );
};

export default CreateCard;
