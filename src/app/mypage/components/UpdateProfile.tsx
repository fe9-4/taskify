"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { ActiveBtn } from "@/components/button/ButtonComponents";
import InputItem from "@/components/input/InputItem";
import { useAuth } from "@/hooks/useAuth";
import { UpdateUserProfile, UpdateUserProfileSchema } from "@/zodSchema/userSchema";
import InputFile from "@/components/input/InputFile";
import { useFileUpload } from "@/hooks/useFileUpload";
import { uploadType } from "@/types/uploadType";

const UpdateProfile = () => {
  const { user, updateUser } = useAuth();
  const [isProfileChanged, setIsProfileChanged] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // 미리보기 이미지 상태
  const [fileToUpload, setFileToUpload] = useState<File | null>(null); // 업로드할 파일 상태

  const { register, handleSubmit, watch, formState, reset, setValue } = useForm<UpdateUserProfile>({
    resolver: zodResolver(UpdateUserProfileSchema),
    defaultValues: { nickname: "", profileImageUrl: null },
    mode: "onChange",
  });

  const watchedNickname = watch("nickname");

  const {
    uploadFile,
    isPending: isFileLoading,
    error: fileError,
  } = useFileUpload("/api/users/me/image", uploadType.PROFILE);

  // 사용자 정보가 변경되면 폼과 상태를 초기화
  useEffect(() => {
    if (user) {
      reset({
        nickname: user.nickname || "",
        profileImageUrl: user.profileImageUrl || null,
      });
      setProfileImageUrl(user.profileImageUrl || null);
    }
  }, [user, reset]);

  // isProfileChanged 업데이트
  useEffect(() => {
    const nicknameChanged = watchedNickname !== user?.nickname;
    const imageChanged = (previewImage || "") !== (user?.profileImageUrl || "");
    setIsProfileChanged(nicknameChanged || imageChanged);
  }, [watchedNickname, previewImage, user]);

  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = (fileOrString: File | string | null) => {
    if (fileOrString instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); // 파일을 미리보기로 설정
      };
      reader.readAsDataURL(fileOrString); // 파일을 데이터 URL로 변환
      setFileToUpload(fileOrString); // 업로드할 파일 설정
    } else if (typeof fileOrString === "string") {
      setPreviewImage(fileOrString); // 미리보기 이미지를 URL로 설정
      setFileToUpload(null); // 파일은 없으므로 null로 설정
    } else {
      setPreviewImage(null); // 파일을 취소할 경우 상태 초기화
      setFileToUpload(null);
    }
  };

  // 닉네임 변경 핸들러
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setValue("nickname", newNickname, { shouldValidate: true });
  };

  // 프로필 제출 핸들러
  const onSubmitProfile: SubmitHandler<UpdateUserProfile> = async (data) => {
    try {
      let imageUrl = profileImageUrl;
      if (fileToUpload) {
        imageUrl = await uploadFile(fileToUpload);
      }

      const response = await axios.put("/api/users/me", {
        ...data,
        profileImageUrl: imageUrl,
      });
      updateUser(response.data.user);
      toast.success("프로필 업데이트 완료");
      setIsProfileChanged(false);
      reset();
    } catch (error) {
      toast.error("프로필 업데이트 실패");
    }
  };

  return (
    <div className="space-y-4 rounded-lg bg-white p-6">
      <div className="text-xl font-bold md:text-3xl">프로필</div>
      <div className="md:flex md:space-x-6">
        <div className="md:flex-1">
          <div className="flex items-center justify-start">
            <InputFile
              id="profile-image-input"
              label=""
              name="profileImage"
              value={previewImage || profileImageUrl}
              size="profile"
              onChange={handleProfileImageChange}
            />
          </div>
          {isFileLoading && <div>이미지 업로드 중...</div>}
          {fileError && <p className="text-error mt-2 text-center">{fileError}</p>}
        </div>
        <div className="mt-4 w-full md:mt-0 md:w-[276px] xl:w-[400px]">
          <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-base font-normal text-black02 md:text-lg">
                이메일
              </label>
              <InputItem id="email" type="email" value={user?.email} readOnly />
            </div>
            <div>
              <label htmlFor="nickname" className="block text-base font-normal text-black02 md:text-lg">
                닉네임 <span className="text-red-600">*</span>
              </label>
              <InputItem
                id="nickname"
                type="text"
                placeholder="닉네임 입력"
                {...register("nickname", { required: "닉네임은 필수 항목입니다." })} // 필수 항목으로 설정
                onChange={handleNicknameChange} // 닉네임 변경 핸들러
              />
              {formState.errors.nickname && (
                <p className="mt-1 text-sm text-red-600">{formState.errors.nickname.message}</p>
              )}
            </div>
            <ActiveBtn
              disabled={!isProfileChanged || formState.isSubmitting || !formState.isValid}
              onClick={handleSubmit(onSubmitProfile)} // 제출 시 처리
            >
              저장
            </ActiveBtn>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
