"use client";

import { ChangeEvent, FormEvent, KeyboardEvent, useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CardProps } from "@/types/cardType";
import { CalendarFormatDate } from "@/utils/dateFormat";
import { CancelBtn, ConfirmBtn } from "@/components/button/ButtonComponents";
import SearchDropdown from "@/components/dropdown/SearchDropdown";
import InputItem from "@/components/input/InputItem";
import InputFile from "@/components/input/InputFile";
import InputDate from "@/components/input/InputDate";
import InputTag from "@/components/input/InputTag";
import { useFileUpload } from "@/hooks/useFileUpload";

const CreateCard = () => {
  const [isProfileChanged, setIsProfileChanged] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const { createFormData, isLoading: isFileLoading, error: fileError } = useFileUpload();
  const [inviteMember, setInviteMember] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [cardData, setCardData] = useState<CardProps>({
    assigneeUserId: 16815,
    dashboardId: 12046,
    columnId: 40754,
    title: "",
    description: "",
    dueDate: "",
    tags: [],
    imageUrl: null,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { ...cardData };
    try {
      const response = await axios.post("/api/cards", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toast.success("카드가 성공적으로 생성되었습니다.");
        console.log("카드 생성 성공:", response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("카드 생성 중 에러가 발생했습니다.");
        console.error("카드 생성 실패:", error.response?.data?.message);
      } else {
        toast.error("네트워크 오류가 발생했습니다.");
        console.error("알 수 없는 에러:", error);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value,
    });
  };

  // 날짜가 변경될 때 cardData 상태를 업데이트하는 함수
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = CalendarFormatDate(date);
      setCardData((prevData) => ({
        ...prevData,
        dueDate: formattedDate,
      }));
    }
  };

  // 태그 추가 함수
  const handleAddTag = (tag: string) => {
    if (tagInput.trim() && !cardData.tags.includes(tag)) {
      setCardData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, tag],
      }));
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
  const handleTagClick = useCallback((tagRemove: string) => {
    setCardData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((tag) => tag !== tagRemove),
    }));
  }, []);

  // 생성 버튼 활성화
  const isFormValid = () => {
    return (
      cardData.assigneeUserId !== 0 &&
      cardData.title.trim() !== "" &&
      cardData.description.trim() !== "" &&
      cardData.dueDate !== null
    );
  };

  const handleProfileImageChange = async (file: string | File | null) => {
    if (file) {
      const formData = await createFormData(file);
      if (!formData) {
        throw new Error("FormData 생성 실패");
      }
      setCardData({ ...cardData, imageUrl: file });
    }
  };

  return (
    <section className="rounded-2xl bg-white p-8">
      <h3 className="mb-5 text-2xl font-bold text-black03 md:mb-6 md:text-3xl">할 일 생성</h3>

      <form onSubmit={handleSubmit} className="grid gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="assignee" className="text-lg font-medium text-black03">
            담당자
          </label>
          <SearchDropdown inviteMemberList={inviteMember} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="assignee" className="text-lg font-medium text-black03">
            제목 <span className="text-violet01">*</span>
          </label>
          <InputItem id="title" name="title" value={cardData.title} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="assignee" className="text-lg font-medium text-black03">
            설명 <span className="text-violet01">*</span>
          </label>
          <InputItem
            id="description"
            name="description"
            value={cardData.description}
            onChange={handleChange}
            isTextArea
            size="description"
          />
        </div>

        <InputDate
          label="마감일"
          id="dueDate"
          name="dueDate"
          value={cardData.dueDate ? new Date(cardData.dueDate) : null}
          onChange={handleDateChange}
          placeholder="날짜를 입력해 주세요"
        />

        <InputTag
          cardData={cardData}
          tagInput={tagInput}
          onKeyDown={handleKeyDown}
          onClick={handleTagClick}
          onChange={handleTagChange}
        />

        <InputFile
          label="이미지"
          id="imageUrl"
          name="imageUrl"
          value={cardData.imageUrl}
          onChange={handleProfileImageChange}
          size="todo"
        />

        <div className="flex h-[42px] gap-3 md:h-[54px] md:gap-2">
          <button type="submit">생성</button>
        </div>
      </form>
    </section>
  );
};

export default CreateCard;
