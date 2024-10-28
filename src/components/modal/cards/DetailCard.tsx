import { useCallback, useEffect, useRef, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  AlertModalAtom,
  AlertModalConfirmAtom,
  AlertModalTextAtom,
  DetailCardAtom,
  DetailCardParamsAtom,
  UpdateCardAtom,
  UpdateCardParamsAtom,
} from "@/store/modalAtom";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { CardDataProps } from "@/types/cardType";
import { StatusTitleChip } from "../../chip/StatusChip";
import TagChip from "@/components/chip/TagChip";
import InputItem from "@/components/input/InputItem";

const buttonBaseClasses =
  "block w-full px-4 py-1 text-center text-base font-medium text-black03 hover:rounded-md hover:bg-violet-100 hover:text-violet01";

const DetailCard = () => {
  const cardId = useAtomValue(DetailCardParamsAtom);
  const [cardData, setCardData] = useState<CardDataProps>();

  const [, setIsDetailCardOpen] = useAtom(DetailCardAtom);
  const [, setIsUpdateCardOpen] = useAtom(UpdateCardAtom);
  const [, setIsUpdateCardParams] = useAtom(UpdateCardParamsAtom);

  const [, setIsAlertOpen] = useAtom(AlertModalAtom);
  const [, setAlertText] = useAtom(AlertModalTextAtom);
  const [, setOnConfirm] = useAtom(AlertModalConfirmAtom);

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getCardData = async () => {
      try {
        const response = await axios.get(`/api/cards/${cardId}`);
        setCardData(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error("카드 조회에 실패하였습니다.");
        }
      }
    };

    getCardData();
  }, [cardId]);

  const ondelete = async () => {
    try {
      const response = await axios.delete(`/api/cards/${cardId}`);
      if (response.status === 201) toast.success("카드가 삭제되었습니다.");
      setIsDetailCardOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("카드 삭제에 실패하였습니다.");
      }
    }
  };

  const handleDelete = () => {
    setAlertText("정말 삭제하시겠습니까?");
    setOnConfirm(() => ondelete);
    setIsAlertOpen(true);
  };

  const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeModal = useCallback(() => setIsDetailCardOpen(false), [setIsDetailCardOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUpdate = () => {
    if (cardData) {
      setIsUpdateCardOpen(true);
      setIsUpdateCardParams(String(cardData.id));
      setIsDetailCardOpen(false);
    }
  };

  return (
    <section className="grid w-[327px] gap-3 rounded-lg bg-white p-4 md:w-[678px] md:px-6 md:py-8">
      {cardData &&
        [cardData].map((card) => (
          <div key={card.id} className="grid">
            <div className="mb-4 flex flex-col justify-between md:flex-row-reverse md:items-center">
              <div className="relative ml-auto flex items-center gap-4 md:gap-6">
                <button onClick={toggleDropdown} className="relative size-5 md:size-7">
                  <Image src="/icons/kebab_icon.svg" fill alt="모달 수정, 삭제하기" />
                </button>
                {isOpen && (
                  <div className="absolute right-6 top-7 w-[100px] rounded-md bg-white p-2 ring-1 ring-inset ring-gray03 transition-all focus:outline-none focus:ring-1 focus:ring-inset md:right-10 md:top-8">
                    <button className={buttonBaseClasses} onClick={handleUpdate}>
                      수정하기
                    </button>
                    <button className={buttonBaseClasses} onClick={handleDelete}>
                      삭제하기
                    </button>
                  </div>
                )}
                <button onClick={closeModal} className="relative size-3 md:size-4">
                  <Image src="/icons/cancel_icon.svg" fill alt="모달 취소" />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-black03 md:grid-cols-1 md:text-3xl">{card.title}</h2>
            </div>

            <div className="flex flex-col gap-6 md:flex-row-reverse">
              <div className="flex-1 md:max-w-[180px] lg:max-w-[200px]">
                <div className="flex items-center gap-x-5 rounded-lg px-4 py-2 ring-1 ring-inset ring-gray03 transition-all focus:outline-none focus:ring-1 focus:ring-inset md:grid-cols-2 md:flex-col md:items-baseline md:space-y-4">
                  <ul>
                    <li className="mb-2 text-xs font-semibold text-black">담당자</li>
                    <li className="flex items-center gap-2">
                      <span
                        className={`flex size-[26px] items-center justify-center rounded-full bg-[#A3C4A2] text-xs font-semibold text-white ring-white ring-offset-2`}
                      >
                        {card.assignee.nickname.charAt(0)}
                      </span>
                      <span className="text-xs font-normal text-black03 md:text-base">{card.assignee.nickname}</span>
                    </li>
                  </ul>
                  <ul>
                    <li className="mb-2 text-xs font-semibold text-black">마감일</li>
                    <li className="text-xs font-normal text-black03 md:text-base">{card.dueDate}</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusTitleChip title="To DO" />
                  <span className="h-[20px] w-[1px] bg-gray03 md:mx-2"></span>
                  {card.tags.map((tag, index) => (
                    <TagChip tag={tag} key={`${tag}-${index + 1}`} />
                  ))}
                </div>

                <p className="text-xs font-normal text-black md:text-base">{card.description}</p>

                <div className="relative my-4 h-[168px] w-[290px] overflow-hidden md:h-[246px] md:w-[420px] lg:h-[260px] lg:w-[445px]">
                  {card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt={card.assignee.nickname}
                      fill
                      className="rounded-md object-cover"
                      priority={true}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* 임시 댓글 창 */}
      <h3 className="mb-2 text-base font-medium md:text-lg">댓글</h3>
      <InputItem isTextArea isButton placeholder="댓글 작성하기" />

      <div className="mt-4">
        <div className="mb-2 flex items-start gap-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500 text-white">
            C
          </div>
          <div>
            <p className="text-sm font-semibold">
              장한철 <span className="text-gray-400">2022.12.27 14:00</span>
            </p>
            <p>오늘안에 CCC 까지 만들 수 있을까요?</p>
            <div className="mt-1 flex space-x-2 text-sm text-gray-500">
              <button>수정</button>
              <button>삭제</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailCard;
