"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { ActiveBtn } from "@/components/button/ButtonComponents";
import InputItem from "@/components/input/InputItem";
import { useAuth } from "@/hooks/useAuth";
import { UpdateUserProfile, UpdateUserProfileSchema, UploadUserProfileImageResponse } from "@/zodSchema/userSchema";
import InputFile from "@/components/input/InputFile";
import { useFileUpload } from "@/hooks/useFileUpload";

const UpdateProfile = () => {
  const { user, updateUser } = useAuth();
  const [isProfileChanged, setIsProfileChanged] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const profileForm = useForm<UpdateUserProfile>({
    resolver: zodResolver(UpdateUserProfileSchema),
    defaultValues: { nickname: "", profileImageUrl: null },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        nickname: user.nickname || "",
        profileImageUrl: user.profileImageUrl || null,
      });
      setProfileImageUrl(user.profileImageUrl || null);
    }
  }, [user]);

  const { createFormData, isLoading: isFileLoading, error: fileError } = useFileUpload();

  const handleProfileImageChange = async (file: string | File | null) => {
    if (file) {
      try {
        const formData = await createFormData(file);
        if (!formData) {
          throw new Error("FormData 생성 실패");
        }

        const response = await axios.post<UploadUserProfileImageResponse>("/api/users/me/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data?.profileImageUrl) {
          setProfileImageUrl(response.data.profileImageUrl);
          profileForm.setValue("profileImageUrl", response.data.profileImageUrl);
          setIsProfileChanged(true);
          profileForm.trigger();
          updateUser({ profileImageUrl: response.data.profileImageUrl });
          toast.success("프로필 이미지 업로드 완료");
        }
      } catch (error) {
        console.error("프로필 이미지 업로드 오류:", error);
        toast.error("프로필 이미지 업로드 실패");
      }
    } else {
      setProfileImageUrl(null);
      profileForm.setValue("profileImageUrl", null);
      setIsProfileChanged(true);
      profileForm.trigger();
      updateUser({ profileImageUrl: undefined });
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    profileForm.setValue("nickname", newNickname, { shouldValidate: true });
    const isChanged = newNickname !== user?.nickname || profileImageUrl !== user?.profileImageUrl;
    setIsProfileChanged(isChanged);
  };

  const onSubmitProfile: SubmitHandler<UpdateUserProfile> = async (data) => {
    try {
      const response = await axios.put("/api/users/me", {
        ...data,
        profileImageUrl: profileImageUrl,
      });
      updateUser(response.data.user);
      toast.success("프로필 업데이트 완료");
      setIsProfileChanged(false);
      profileForm.reset();
    } catch (error) {
      toast.error("프로필 업데이트 실패");
    }
  };

  return (
    <div className="space-y-4 rounded-lg bg-white p-6">
      <div className="text-xl font-bold md:text-3xl">프로필</div>
      <div className="md:flex md:space-x-6">
        <div className="md:flex-1">
          <div className="flex items-center justify-center md:justify-start">
            <InputFile
              id="profile-image-input"
              label=""
              name="profileImage"
              value={profileImageUrl}
              size="profile"
              onChange={handleProfileImageChange}
            />
          </div>
          {isFileLoading && <p className="mt-2 text-center">이미지 업로드 중...</p>}
          {fileError && <p className="text-error mt-2 text-center">{fileError}</p>}
        </div>
        <div className="mt-4 w-full md:mt-0 md:w-[276px] xl:w-[400px]">
          <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-base font-normal text-black02 md:text-lg">
                이메일
              </label>
              <InputItem id="email" type="email" value={user?.email} readOnly />
            </div>
            <div>
              <label htmlFor="nickname" className="block text-base font-normal text-black02 md:text-lg">
                닉네임
              </label>
              <InputItem
                id="nickname"
                type="text"
                placeholder="닉네임 입력"
                {...profileForm.register("nickname")}
                onChange={handleNicknameChange}
              />
              {profileForm.formState.errors.nickname && (
                <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.nickname.message}</p>
              )}
            </div>
            <ActiveBtn
              disabled={!isProfileChanged || profileForm.formState.isSubmitting || !profileForm.formState.isValid}
              onClick={profileForm.handleSubmit(onSubmitProfile)}
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
