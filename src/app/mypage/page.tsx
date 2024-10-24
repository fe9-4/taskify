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

const MyPage = () => {
  const { user, loading, logout } = useAuth();
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
    if (!loading && user) {
      profileForm.reset({
        nickname: user.nickname || "",
        profileImageUrl: user.profileImageUrl || null,
      });
      setProfileImageUrl(user.profileImageUrl || null);
    }
  }, [user, loading, profileForm]);

  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = async (file: string | File | null) => {
    if (file) {
      try {
        const formData = new FormData();
        if (file instanceof File) {
          formData.append("image", file);
        } else {
          const response = await fetch(file);
          const blob = await response.blob();
          formData.append("image", blob, "profile.jpg");
        }

        const response = await axios.post<UploadUserProfileImageResponse>("/api/user/profile/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data?.profileImageUrl) {
          //console.log("profileImageUrl data: ", response.data?.profileImageUrl);
          setProfileImageUrl(response.data.profileImageUrl);
          profileForm.setValue("profileImageUrl", response.data.profileImageUrl);
          setIsProfileChanged(true);
          profileForm.trigger(); // 폼의 유효성을 다시 확인
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
      profileForm.trigger(); // 폼의 유효성을 다시 확인
    }
  };

  // 닉네임 변경 감지
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    profileForm.setValue("nickname", newNickname, { shouldValidate: true });
    const isChanged = newNickname !== user?.nickname || profileImageUrl !== user?.profileImageUrl;
    setIsProfileChanged(isChanged);
    // console.log("닉네임 변경 상태: ", isChanged); // 주석 처리
  };

  // 프로필 수정 제출 핸들러
  const onSubmitProfile: SubmitHandler<UpdateUserProfile> = async (data) => {
    try {
      await axios.put("/api/user/profile", {
        ...data,
        profileImageUrl: profileImageUrl,
      });
      toast.success("프로필 업데이트 완료");
      setIsProfileChanged(false);
      profileForm.reset();
    } catch (error) {
      //console.error("프로필 업데이트 실패:", error);
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
      //console.error("비밀번호 변경 오류:", error);
      toast.error("비밀번호 변경 실패");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!user) return null;

  return (
    <div className="container mx-auto space-y-6 p-4">
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
    </div>
  );
};

export default MyPage;
