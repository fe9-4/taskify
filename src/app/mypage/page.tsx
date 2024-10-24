"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { ActiveBtn } from "@/components/button/ButtonComponents";
import InputItem from "@/components/input/InputItem";
import { useAuth } from "@/hooks/useAuth";
import {
  UpdateUserProfile,
  UpdateUserProfileSchema,
  UploadUserProfileImageResponse,
  UpdateUserPassword,
  UpdateUserPasswordSchema,
} from "@/zodSchema/userSchema";
import InputFile from "@/components/input/InputFile";
import { useFileUpload } from "@/hooks/useFileUpload";

const MyPage = () => {
  const { user, loading, logout, updateUser } = useAuth();
  const [isProfileChanged, setIsProfileChanged] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // 프로필 수정 폼 설정
  const profileForm = useForm<UpdateUserProfile>({
    resolver: zodResolver(UpdateUserProfileSchema),
    defaultValues: { nickname: "", profileImageUrl: null },
    mode: "onChange",
  });

  // 비밀번호 변경 폼 설정
  const passwordForm = useForm<UpdateUserPassword>({
    resolver: zodResolver(UpdateUserPasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    mode: "onChange",
  });

  // 사용자 정보가 있을 때 폼 초기값 설정
  useEffect(() => {
    if (user) {
      profileForm.reset({
        nickname: user.nickname || "",
        profileImageUrl: user.profileImageUrl || null,
      });
      setProfileImageUrl(user.profileImageUrl || null);
    }
  }, [user]); // 의존성 배열에서 profileForm 제거

  const { createFormData, isLoading: isFileLoading, error: fileError } = useFileUpload();

  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = async (file: string | File | null) => {
    if (file) {
      try {
        const formData = await createFormData(file);
        if (!formData) {
          throw new Error("FormData 생성 실패");
        }

        const response = await axios.post<UploadUserProfileImageResponse>("/api/user/profile/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data?.profileImageUrl) {
          setProfileImageUrl(response.data.profileImageUrl);
          profileForm.setValue("profileImageUrl", response.data.profileImageUrl);
          setIsProfileChanged(true);
          profileForm.trigger();
          updateUser({ profileImageUrl: response.data.profileImageUrl }); // 전역 상태 업데이트
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
      updateUser({ profileImageUrl: undefined }); // 전역 상태 업데이트
    }
  };

  // 닉네임 변경 감지
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    profileForm.setValue("nickname", newNickname, { shouldValidate: true });
    const isChanged = newNickname !== user?.nickname || profileImageUrl !== user?.profileImageUrl;
    setIsProfileChanged(isChanged);
  };

  // 프로필 수정 제출 핸들러
  const onSubmitProfile: SubmitHandler<UpdateUserProfile> = async (data) => {
    try {
      const response = await axios.put("/api/user/profile", {
        ...data,
        profileImageUrl: profileImageUrl,
      });
      updateUser(response.data.user); // 전역 상태 업데이트
      toast.success("프로필 업데이트 완료");
      setIsProfileChanged(false);
      profileForm.reset();
    } catch (error) {
      toast.error("프로필 업데이트 실패");
    }
  };

  // 비밀번호 변경 제출 핸들러
  const onSubmitPasswordChange: SubmitHandler<UpdateUserPassword> = async (data) => {
    try {
      await axios.put("/api/auth/changePassword", data);
      toast.success("비밀번호 변경 완료");
      passwordForm.reset();
      logout();
    } catch (error) {
      toast.error("비밀번호 변경 실패");
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      {loading && <div>로딩 중...</div>}
      {!loading && user && (
        <>
          <div className="space-y-4 rounded-lg bg-white p-6">
            <div className="flex justify-center">
              <InputFile
                id="profile-image-input"
                label="프로필 이미지"
                name="profileImage"
                value={profileImageUrl}
                size="profile"
                onChange={handleProfileImageChange}
              />
            </div>

            <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black02">
                  이메일
                </label>
                <InputItem id="email" type="email" value={user.email} readOnly />
              </div>
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-black02">
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

          <div className="space-y-4 rounded-lg bg-white p-6">
            <h2 className="text-2xl font-bold">비밀번호 변경</h2>
            <form onSubmit={passwordForm.handleSubmit(onSubmitPasswordChange)} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-black02">
                  현재 비밀번호
                </label>
                <InputItem
                  id="currentPassword"
                  type="password"
                  placeholder="현재 비밀번호 입력"
                  {...passwordForm.register("currentPassword")}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-black02">
                  새 비밀번호
                </label>
                <InputItem
                  id="newPassword"
                  type="password"
                  placeholder="새 비밀번호 입력"
                  {...passwordForm.register("newPassword")}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-black02">
                  새 비밀번호 확인
                </label>
                <InputItem
                  id="confirmPassword"
                  type="password"
                  placeholder="새 비밀번호 확인"
                  {...passwordForm.register("confirmPassword")}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <ActiveBtn
                disabled={passwordForm.formState.isSubmitting || !passwordForm.formState.isValid}
                onClick={passwordForm.handleSubmit(onSubmitPasswordChange)}
              >
                변경
              </ActiveBtn>
            </form>
          </div>
          {isFileLoading && <p>이미지 업로드 중...</p>}
          {fileError && <p className="text-error">{fileError}</p>}
        </>
      )}
      {!loading && !user && <div>사용자 정보를 불러올 수 없습니다.</div>}
    </div>
  );
};

export default MyPage;
