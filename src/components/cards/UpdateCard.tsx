"use client";
import { z } from "zod";
import { useForm, SubmitHandler, Controller, useFieldArray } from "react-hook-form";
import { ChangeEvent, FormEvent, FormEventHandler, KeyboardEvent, useCallback, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { CreateCardAtom } from "@/store/modalAtom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useFileUpload } from "@/hooks/useFileUpload";
import { formatDateTime } from "@/utils/dateFormat";
import { CancelBtn, ConfirmBtn } from "@/components/button/ButtonComponents";
import StatusDropdown from "../dropdown/StatusDropdown";
import SearchDropdown from "@/components/dropdown/SearchDropdown";
import InputItem from "@/components/input/InputItem";
import InputDate from "@/components/input/InputDate";
import InputTag from "@/components/input/InputTag";
import InputFile from "@/components/input/InputFile";
import { useParams } from "next/navigation";
import { useDashboardMember } from "@/hooks/useDashboardMember";

interface FormValues {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}

interface UpdateCardProps {
  assigneeUserId: number;
  assignee: FormValues;
  dashboardId: number;
  columnId: number;
  title: string;
  description: string;
  dueDate: string;
  tags: string[];
  imageUrl: string | File | null;
  manager: FormValues;
}

const UpdateCard = () => {
  const { dashboardId, columnId, cardId } = useParams();
  const id = Number(dashboardId); // number 타입의 dashboardId
  const { members, isLoading, error, refetch } = useDashboardMember({
    dashboardId: id,
    page: 1,
    size: 10,
  });

  const [selectedValue, setSelectedValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [inviteMember, setInviteMember] = useState([]);
  const [Manager, setManager] = useState("");

  const { user } = useAuth();
  const [updateCard, setUpdateCard] = useState();
  const [tagInput, setTagInput] = useState("");

  const { createFormData, isLoading: isFileLoading, error: fileError } = useFileUpload();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // console.log("카드리스트", cardList);
  // console.log("컬럼 아이디", columnId);
  console.log("대시보드 아이디", dashboardId);
  console.log("멤버 아이디", user && user.id);
  console.log("카드 상세 조회", updateCard);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<UpdateCardProps>({
    defaultValues: {
      assigneeUserId: Number(user && user.id), // 본인의 계정 아이디
      dashboardId: Number(dashboardId),
      columnId: 40754, // 컬럼 생성 아이디
      title: "",
      description: "",
      dueDate: "",
      tags: [],
      imageUrl: null,
      manager: {
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
        setUpdateCard(data);
        reset({
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          tags: data.tags,
          imageUrl: data.imageUrl,
          assignee: {
            id: data.assignee.id,
            nickname: data.assignee.nickname,
            profileImageUrl: data.assignee.profileImageUrl,
          },
        });
      } catch (error) {
        console.error("카드 데이터 불러오기 실패:", error);
      }
    };

    fetchCardData();
  }, [cardId, reset]);

  // 이미지 변경 핸들러
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

  const onSubmit = async (data: any) => {
    try {
      // FormData 대신 일반 객체 사용
      const jsonData = {
        ...data,
        tags: JSON.stringify(data.tags), // 태그는 JSON 문자열로 변환
      };

      const response = await axios.put(`/api/cards/${cardId}`, jsonData);
      setUpdateCard(response.data);

      if (response.data) {
        toast.success("카드가 수정되었습니다! 🎉");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("카드 수정에 실패하였습니다.");
      } else {
        toast.error("네트워크 오류가 발생했습니다.");
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
            {/* <SearchDropdown inviteMemberList={members.members} {...register("assigneeUserId")} /> */}
            <Controller
              name="assignee"
              control={control}
              render={({ field }) => (
                <SearchDropdown
                  inviteMemberList={members.members}
                  currentManager={field.value}
                  setManager={(manager) => field.onChange(manager)}
                />
              )}
            />
            {/* <SearchDropdown
              inviteMemberList={members.members}
              setManager={() => ""}
              {...register("assignee.nickname")}
            />
            <input {...register("assignee.nickname")} /> */}
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
          <CancelBtn type="button" onClick={() => ""}>
            취소
          </CancelBtn>
          <ConfirmBtn type="submit" disabled={!isValid} onClick={handleSubmit(onSubmit)}>
            수정
          </ConfirmBtn>
        </div>
      </form>
    </section>
  );
};

export default UpdateCard;
