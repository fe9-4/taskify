"use client";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useFileUpload } from "@/hooks/useFileUpload";
import { CardProps } from "@/types/cardType";
import { formatDateTime } from "@/utils/dateFormat";
import { CancelBtn, ConfirmBtn } from "@/components/button/ButtonComponents";
import SearchDropdown from "@/components/dropdown/SearchDropdown";
import InputItem from "@/components/input/InputItem";
import InputDate from "@/components/input/InputDate";
import InputTag from "@/components/input/InputTag";
import InputFile from "@/components/input/InputFile";
import { useParams } from "next/navigation";
import { uploadType } from "@/types/uploadType";

const CardSchema = z.object({
  assigneeUserId: z.number(),
  dashboardId: z.number(),
  columnId: z.number(),
  title: z.string().min(1, "제목은 필수입니다"),
  description: z.string().min(1, "설명은 필수입니다"),
  dueDate: z.string(),
  tags: z.array(z.string()),
  imageUrl: z.string(),
});

const CreateCard = () => {
  const params = useParams();
  const { user } = useAuth();
  const [inviteMember, setInviteMember] = useState([]);
  const [manager, setManager] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [isCardChanged, setIsCardChanged] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<CardProps>({
    resolver: zodResolver(CardSchema),
    mode: "onChange",
    defaultValues: {
      assigneeUserId: Number(user?.id) || 12046, // 기본값 설정
      dashboardId: Number(params.dashboardId) || 12046, // URL 파라미터 또는 기본값
      columnId: Number(params.columnId) || 40754, // URL 파라미터 또는 기본값
      title: "",
      description: "",
      dueDate: "",
      tags: [],
      imageUrl: "",
    },
  });

  const currentColumnId = watch("columnId");
  const {
    uploadFile,
    isPending: isFileLoading,
    error: fileError,
  } = useFileUpload(`/api/columns/${currentColumnId}/card-image`, uploadType.CARD);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name) {
        setIsCardChanged(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleImageChange = (fileOrString: File | string | null) => {
    if (fileOrString instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(fileOrString);
      setFileToUpload(fileOrString);
    } else if (typeof fileOrString === "string") {
      setPreviewImage(fileOrString);
      setFileToUpload(null);
    } else {
      setPreviewImage(null);
      setFileToUpload(null);
    }
    setIsCardChanged(true);
  };

  const onSubmit: SubmitHandler<CardProps> = async (data) => {
    try {
      let imageUrl = null;
      if (fileToUpload) {
        imageUrl = await uploadFile(fileToUpload);
      }

      const jsonData = {
        ...data,
        tags: JSON.stringify(data.tags),
        imageUrl: imageUrl,
      };

      const response = await axios.post(`/api/cards`, jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        toast.success("카드가 생성되었습니다! 🎉");
        setIsCardChanged(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("카드 생성에 실패하였습니다.");
      } else {
        toast.error("네트워크 오류가 발생했습니다.");
      }
    }
  };

  // 태그 관련 함수들...

  return (
    <section className="rounded-2xl bg-white p-8">
      <h3 className="mb-5 text-2xl font-bold text-black03 md:mb-6 md:text-3xl">할 일 생성</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8">
        {/* 폼 필드들... */}

        <InputFile
          label="이미지"
          id="imageUrl"
          name="imageUrl"
          value={previewImage}
          onChange={handleImageChange}
          size="todo"
        />

        {isFileLoading && <p>이미지 업로드 중...</p>}
        {fileError && <p className="text-error">{fileError}</p>}

        <div className="flex h-[42px] gap-3 md:h-[54px] md:gap-2">
          <CancelBtn type="button" onClick={() => ""}>
            취소
          </CancelBtn>
          <ConfirmBtn type="submit" disabled={!isValid || !isCardChanged} onClick={handleSubmit(onSubmit)}>
            생성
          </ConfirmBtn>
        </div>
      </form>
    </section>
  );
};

export default CreateCard;
