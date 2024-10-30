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
import { AlertModalAtom, AlertModalConfirmAtom, AlertModalTextAtom } from "@/store/modalAtom";

const EditPage = () => {
  const { dashboardId } = useParams();
  const router = useRouter();
  const { isLoading, withLoading } = useLoading();
  const [, setIsAlertOpen] = useAtom(AlertModalAtom);
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
    <div className="flex w-[284px] flex-col p-5 md:w-[544px] xl:w-[620px]">
      <div className="flex items-center gap-[6px] md:gap-2">
        <IoIosArrowBack className="size-[18px]" />
        <Link href={`/dashboard/${dashboardId}`} className="text-base md:text-lg">
          돌아가기
        </Link>
      </div>
      <div className="flex w-[620px] flex-col gap-4">
        <EditDashboard dashboardId={id} />
        <Section>
          <DashboardMemberList dashboardId={id} />
        </Section>
        <Section>
          <InviteList dashboardId={id} />
        </Section>
      </div>
      <div className="mt-6">
        <DeleteDashboardBtn
          onClick={() => {
            setOnConfirm(() => onDelete);
            setAlertText("대시보드를 삭제하시겠습니까?");
            setIsAlertOpen(true);
          }}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default EditPage;
