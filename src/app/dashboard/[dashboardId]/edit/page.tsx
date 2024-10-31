"use client";
import { DeleteDashboardBtn } from "@/components/button/ButtonComponents";
import EditDashboard from "@/app/dashboard/[dashboardId]/edit/components/EditDashboard";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { useParams, useRouter } from "next/navigation";
import DashboardMemberList from "./components/DashboardMemberList";
import InviteList from "./components/InviteList";
import Section from "./components/Section";
import toast from "react-hot-toast";
import axios from "axios";
import useLoading from "@/hooks/useLoading";
import { useAtom } from "jotai";
import { AlertModalConfirmAtom, AlertModalTextAtom } from "@/store/modalAtom";
import { useToggleModal } from "@/hooks/useToggleModal";

const EditPage = () => {
  const { dashboardId } = useParams();
  const router = useRouter();
  const { isLoading, withLoading } = useLoading();
  const toggleModal = useToggleModal();
  const [, setAlertText] = useAtom(AlertModalTextAtom);
  const [, setOnConfirm] = useAtom(AlertModalConfirmAtom);
  const id = Number(dashboardId);

  const onDelete = async () => {
    await withLoading(async () => {
      try {
        await axios.delete(`/api/dashboards/${dashboardId}`);
        toast.success("대시보드 삭제 완료");
        router.push("/mydashboard");
      } catch (error) {
        toast.error("대시보드 삭제 실패");
      }
    });
  };

  return (
    <div className="mx-5 flex w-[284px] flex-col md:w-[544px] xl:w-[620px]">
      <div className="flex items-center gap-[6px] pb-[10px] pt-4 md:gap-2 md:py-5 xl:pb-[34px]">
        <IoIosArrowBack className="size-[18px]" />
        <Link href={`/dashboard/${dashboardId}`} className="text-base md:text-lg">
          돌아가기
        </Link>
      </div>
      <div className="flex w-full flex-col gap-4">
        <EditDashboard dashboardId={id} />
        <Section>
          <DashboardMemberList dashboardId={id} />
        </Section>
        <Section>
          <InviteList dashboardId={id} />
        </Section>
      </div>
      <div className="my-6">
        <DeleteDashboardBtn
          onClick={() => {
            setOnConfirm(() => onDelete);
            setAlertText("대시보드를 삭제하시겠습니까?");
            toggleModal("deleteModal", true);
          }}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default EditPage;
