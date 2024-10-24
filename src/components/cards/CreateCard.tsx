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

const Member_Mock_Data = {
  members: [
    {
      // "id": 12046,
      // "userId": 4672,
      email: "test1234@test.com",
      nickname: "test1234",
      // "profileImageUrl": "string",
      // "createdAt": "2024-10-23T12:27:55.840Z",
      // "updatedAt": "2024-10-23T12:27:55.840Z",
      // "isOwner": true
    },
  ],
  totalCount: 0,
};

const CreateCard = () => {
  const [inviteMember, setInviteMember] = useState(Member_Mock_Data.members);
  const [tagInput, setTagInput] = useState("");
  const [cardData, setCardData] = useState<CardProps>({
    assigneeUserId: 0,
    dashboardId: 0,
    columnId: 0,
    title: "",
    description: "",
    dueDate: "",
    tags: [],
    imageUrl: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          <InputItem
            id="title"
            name="title"
            value={cardData.title}
            onChange={handleChange}
            placeholder="제목을 입력해 주세요"
          />
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
            placeholder="설명을 입력해 주세요"
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
          onChange={(file) => setCardData({ ...cardData, imageUrl: file })}
          size="todo"
        />

        <div className="flex h-[42px] gap-3 md:h-[54px] md:gap-2">
          <CancelBtn onClick={() => ""}>취소</CancelBtn>
          <ConfirmBtn type="submit" disabled={!isFormValid()}>
            생성
          </ConfirmBtn>
        </div>
      </form>
    </section>
  );
};

export default CreateCard;
