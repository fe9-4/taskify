"use client";

import { useCallback, useRef, WheelEventHandler } from "react";
import { useParams } from "next/navigation";
import { AddColumnBtn } from "@/components/button/ButtonComponents";
import { useAtom } from "jotai";
import { ColumnTitlesAtom } from "@/store/modalAtom";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import ColumnList from "@/app/dashboard/components/ColumnList";
import { useCard } from "@/hooks/useCard";
import { useToggleModal } from "@/hooks/useToggleModal";
import { useColumn } from "@/hooks/useColumn";

const DashboardDetail = () => {
  const { dashboardId } = useParams();
  const toggleModal = useToggleModal();
  const [, setColumnTitles] = useAtom(ColumnTitlesAtom);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { columns, canAddColumn } = useColumn(Number(dashboardId));
  const { moveCard } = useCard();

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;
    const cardId = parseInt(draggableId);
    const targetColumnId = parseInt(destination.droppableId);

    if (source.droppableId !== destination.droppableId) {
      await moveCard(cardId, targetColumnId, Number(dashboardId));
    }
  };

  const handleColumnBtn = () => {
    const columnTitles = columns?.map((column) => column.title) || [];
    setColumnTitles(columnTitles);
    toggleModal("createColumn", true);
  };

  const handleScroll = useCallback((e: WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div
        className="flex h-full w-full flex-col space-y-6 overflow-x-auto pb-6 xl:flex-row xl:space-x-6 xl:space-y-0 xl:pr-4"
        ref={scrollRef}
        onWheel={handleScroll as unknown as WheelEventHandler<HTMLDivElement>}
      >
        <div className="flex flex-col space-y-6 xl:flex-row xl:space-y-0">
          {columns?.map((column) => <ColumnList key={column.id} columnTitle={column.title} columnId={column.id} />)}
        </div>
        <div className="px-4 xl:px-0 xl:pt-[66px]">{canAddColumn && <AddColumnBtn onClick={handleColumnBtn} />}</div>
      </div>
    </DragDropContext>
  );
};

export default DashboardDetail;
