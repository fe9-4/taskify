// dashboard/[dashboardId]/page.tsx
"use client";

import React, { useRef, WheelEvent } from "react";
import { useParams } from "next/navigation";
import { AddColumnBtn } from "@/components/button/ButtonComponents";
import { useAtom } from "jotai";
import { ColumnTitlesAtom } from "@/store/modalAtom";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import ColumnList from "@/app/dashboard/components/ColumnList";
import { useColumn } from "@/hooks/useColumn";
import { ColumnSchemaType } from "@/zodSchema/columnSchema";
import { useCard } from "@/hooks/useCard";
import { useToggleModal } from "@/hooks/useToggleModal";

const DashboardDetail = () => {
  const { dashboardId } = useParams();
  const toggleModal = useToggleModal();
  const [, setColumnTitles] = useAtom(ColumnTitlesAtom);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { columns, canAddColumn } = useColumn(Number(dashboardId));
  const { moveCard } = useCard();

  const handleColumnBtn = () => {
    const columTitles = columns?.map((column: ColumnSchemaType) => column.title) || [];
    setColumnTitles(columTitles);
    toggleModal("createColumn", true);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !result.draggableId) return;

    const { draggableId, source, destination } = result;

    // 같은 컬럼 내에서의 이동은 무시
    if (source.droppableId === destination.droppableId) {
      return;
    }

    try {
      // 다른 컬럼으로의 이동
      const cardId = parseInt(draggableId);
      const targetColumnId = parseInt(destination.droppableId);

      await moveCard(cardId, targetColumnId, destination.index);
    } catch (error) {
      console.error("카드 이동 중 오류 발생:", error);
    }
  };

  const handleScroll = (e: WheelEvent): void => {
    const el = scrollRef.current;
    const { deltaY } = e;
    if (el) {
      if (deltaY === 0) return;
      e.preventDefault();
      el.scrollTo({
        left: el.scrollLeft + deltaY,
        behavior: "auto",
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div
        className="flex flex-col space-y-6 overflow-auto pb-6 xl:flex-row xl:space-x-6 xl:space-y-0 xl:pr-4"
        ref={scrollRef}
        onWheel={handleScroll}
      >
        <div className="flex flex-col space-y-6 xl:flex-row xl:space-y-0">
          {columns &&
            columns.length > 0 &&
            columns.map((column: ColumnSchemaType) => (
              // React.memo 적용된 ColumnList 컴포넌트 사용
              <MemoizedColumnList key={column.id} columnTitle={column.title} columnId={column.id} />
            ))}
        </div>
        <div className="px-4 xl:px-0 xl:pt-[66px]">{canAddColumn && <AddColumnBtn onClick={handleColumnBtn} />}</div>
      </div>
    </DragDropContext>
  );
};

// React.memo로 감싸서 불필요한 리랜더링 방지
const MemoizedColumnList = React.memo(ColumnList);

export default DashboardDetail;
