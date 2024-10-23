import { HiOutlineCog } from "react-icons/hi";
import { NumChip, PlusChip } from "../chip/PlusAndNumChip";
import ColumnItem from "./ColumnItem";
import { useEffect, useRef, useState } from "react";
import { ICard } from "../../../types/types";
import axios from "axios";
import toast from "react-hot-toast";
import apiClient from "@/app/api/apiClient";
import { AddTodoBtn } from "../ButtonComponents";

const DUMMY_ITEM = [
  {
    cards: {
      id: 1,
      title: "이번 프로젝트 개요",
      description: "프로젝트 개요입니다.",
      tags: ["프로젝트", "프론트엔드", "중"],
      dueDate: "2024. 10. 21",
      imageUrl: "/images/cardImg1.png",
      assignee: {
        nickname: "M",
      },
    },
    totalCount: 3,
  },
  {
    cards: {
      id: 2,
      title: "다음 프로젝트 개요",
      description: "다음프로젝트 개요입니다.",
      tags: ["프로젝트", "프론트엔드", "상"],
      dueDate: "2024. 11. 21",
      imageUrl: "/images/cardImg1.png",
      assignee: {
        nickname: "H",
      },
    },
    totalCount: 3,
  },
  {
    cards: {
      id: 3,
      title: "다다음 프로젝트 개요",
      description: "다다음 프로젝트 개요입니다.",
      tags: ["프로젝트", "프론트엔드", "백엔드", "상"],
      dueDate: "2024. 12. 21",
      imageUrl: "/images/cardImg1.png",
      assignee: {
        nickname: "K",
      },
    },
    totalCount: 3,
  },
  {
    cards: {
      id: 4,
      title: "이번 프로젝트 개요",
      description: "프로젝트 개요입니다.",
      tags: ["프로젝트", "프론트엔드", "중"],
      dueDate: "2024. 10. 21",
      imageUrl: "/images/cardImg1.png",
      assignee: {
        nickname: "M",
      },
    },
    totalCount: 3,
  },
  {
    cards: {
      id: 5,
      title: "다음 프로젝트 개요",
      description: "다음프로젝트 개요입니다.",
      tags: ["프로젝트", "프론트엔드", "상"],
      dueDate: "2024. 11. 21",

      assignee: {
        nickname: "H",
      },
    },
    totalCount: 3,
  },
  {
    cards: {
      id: 6,
      title: "다다음 프로젝트 개요",
      description: "다다음 프로젝트 개요입니다.",
      tags: ["프로젝트", "프론트엔드", "백엔드", "상"],
      dueDate: "2024. 12. 21",
      imageUrl: "/images/cardImg1.png",
      assignee: {
        nickname: "K",
      },
    },
    totalCount: 3,
  },
  {
    cards: {
      id: 76,
      title: "다다음 프로젝트 개요",
      description: "다다음 프로젝트 개요입니다.",
      tags: ["프로젝트", "프론트엔드", "백엔드", "상"],
      dueDate: "2024. 12. 21",
      imageUrl: "/images/cardImg1.png",
      assignee: {
        nickname: "K",
      },
    },
    totalCount: 3,
  },
  {
    cards: {
      id: 8,
      title: "다다음 프로젝트 개요",
      description: "다다음 프로젝트 개요입니다.",
      tags: ["프로젝트", "프론트엔드", "백엔드", "상"],
      dueDate: "2024. 12. 21",
      imageUrl: "",
      assignee: {
        nickname: "K",
      },
    },
    totalCount: 3,
  },
  {
    cards: {
      id: 9,
      title: "다다음 프로젝트 개요",
      description: "다다음 프로젝트 개요입니다.",
      tags: ["프로젝트", "프론트엔드", "백엔드", "상"],
      dueDate: "2024. 12. 21",
      imageUrl: "/images/cardImg1.png",
      assignee: {
        nickname: "K",
      },
    },
    totalCount: 3,
  },
];

const ITEMS_PER_PAGE = 3;

const ColumnList = ({ columnTitle }: { columnTitle: string }) => {
  // const [cardList, setCardList] = useState<ICard[]>([]);
  const [cardList, setCardList] = useState(DUMMY_ITEM.slice(0, ITEMS_PER_PAGE));
  const [cursorId, setCursorId] = useState<number>(ITEMS_PER_PAGE);
  const [hasMore, setHasMore] = useState(true);
  const observeRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const loadMoreCardItem = () => {
    const nextCardItem = DUMMY_ITEM.slice(cursorId, cursorId + ITEMS_PER_PAGE);

    if (nextCardItem.length > 0) {
      setCardList((prev) => [...prev, ...nextCardItem]);
      console.log("로딩된 카드", nextCardItem);
      setCursorId((prev) => prev + ITEMS_PER_PAGE);
    } else {
      setHasMore(false);
      console.log("더 이상 로딩할 데이터가 없습니다.");
    }
  };
  console.log(cursorId, hasMore);
  const getCardList = async () => {
    try {
      const response = await apiClient.get(`/cards?size=10&cursorId=${cursorId}&columnId=`, {
        params: { cursorId },
      });

      if (response.status === 200) {
        setCardList((prev) => [...prev, ...response.data.cards]);
        setCursorId(response.data.cursorId);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("ColumnList getCardList에서 api 오류 발생", error);
        toast.error(error.response?.data.message);
      }
    }
  };

  // 카드아이템 무한스크롤
  useEffect(() => {
    // getCardList();

    observeRef.current = new IntersectionObserver((entries) => {
      const lastCardItem = entries[0];
      console.log("IntersectionObserver 호출");
      if (lastCardItem.isIntersecting && hasMore) {
        // getCardList();
        loadMoreCardItem();
      }
    });

    if (loadingRef.current) {
      observeRef.current.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observeRef.current?.unobserve(loadingRef.current);
      }
    };
  }, [hasMore]);

  const handleAddTodo = () => {
    // 모달 만들어지면 모달 연결
    console.log("모달 오픈");
  };

  return (
    <div className="space-y-6 px-4 pt-4 md:border-b md:border-gray04 md:pb-6 xl:flex xl:min-h-screen xl:flex-col xl:border-b-0 xl:border-r">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="size-2 rounded-full bg-violet01" />
            <h2 className="text-lg font-bold text-black">{columnTitle}</h2>
          </div>
          <NumChip num={DUMMY_ITEM.length} />
        </div>
        <button>
          <HiOutlineCog className="size-[22px] text-gray01" />
        </button>
      </div>
      <div className="flex flex-col space-y-2">
        <AddTodoBtn onClick={handleAddTodo} />
        {cardList.length > 0 ? (
          cardList.map((item, i) => (
            <div key={item.cards.id}>
              <ColumnItem cards={item.cards} />
              {i === cardList.length - 1 && <div ref={loadingRef} className="h-[1px]" />}
            </div>
          ))
        ) : (
          <p className="flex items-center justify-center text-center font-bold">등록된 카드가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ColumnList;
