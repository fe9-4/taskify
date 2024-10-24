"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { ActiveBtn } from "@/components/button/ButtonComponents";
import InputItem from "@/components/input/InputItem";
import { useAuth } from "@/hooks/useAuth";
import {
  UserProfileResponse,
  UpdateUserProfile,
  UpdateUserProfileSchema,
  UploadUserProfileImageResponse,
  UpdateUserPassword,
  UpdateUserPasswordSchema,
} from "@/zodSchema/userSchema";

const MyPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 프로필 이미지 관련 상태
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // 프로필 수정 폼 설정
  const profileForm = useForm<UpdateUserProfile>({
    resolver: zodResolver(UpdateUserProfileSchema),
    defaultValues: { nickname: "" },
  });

  // 비밀번호 변경 폼 설정
  const passwordForm = useForm<UpdateUserPassword>({
    resolver: zodResolver(UpdateUserPasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  // 사용자 정보가 있을 때 폼 초기값 설정
  useEffect(() => {
    if (!loading && user) {
      profileForm.setValue("nickname", user.nickname || "");
      if (user.profileImageUrl) {
        setProfileImageUrl(user.profileImageUrl);
      }
    }
  }, [user, loading, router]);

  // 프로필 수정 제출 핸들러
  const onSubmitProfile: SubmitHandler<UpdateUserProfile> = async (data) => {
    try {
      const response: UserProfileResponse = await axios.put("/api/user/profile", data);
      toast.success("프로필 업데이트 완료");
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      toast.error("프로필 업데이트 실패");
    }
  };

  // 비밀번호 변경 제출 핸들러
  const onSubmitPasswordChange: SubmitHandler<UpdateUserPassword> = async (data) => {
    try {
      await axios.put("/api/auth/changePassword", data);
      toast.success("비밀번호 변경 완료");
      passwordForm.reset(); // 폼 초기화
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      toast.error("비밀번호 변경 실패");
    }
  };

  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post<UploadUserProfileImageResponse>("/api/user/profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.profileImageUrl) {
          setProfileImageUrl(response.data.profileImageUrl);
          toast.success("프로필 이미지 업데이트 완료");
        }
      } catch (error) {
        console.error("프로필 이미지 업로드 오류:", error);
        toast.error("프로필 이미지 업로드 실패");
      }
    }
  };

  // 로딩 중일 때 로딩 화면 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 로그인하지 않은 경우 null 반환 (마이페이지를 렌더링하지 않음)
  if (!user) {
    return null;
  }

  // 마이페이지 UI 렌더링
  return (
    <div className="container mx-auto p-4">
      {/* 프로필 섹션 */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">프로필</h2>
        {/* 프로필 이미지 */}
        <div className="mb-4 flex items-center">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray03">
            {profileImageUrl ? (
              <Image src={profileImageUrl} alt="Profile" width={96} height={96} className="object-cover" />
            ) : (
              <button className="text-4xl" onClick={() => document.getElementById("profile-image-input")?.click()}>
                +
              </button>
            )}
            <input
              id="profile-image-input"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
          </div>
        </div>
        {/* 프로필 수정 폼 */}
        <form onSubmit={profileForm.handleSubmit(onSubmitProfile)}>
          <InputItem label="이메일" id="email" type="email" value={user.email} readOnly={true} />
          <InputItem
            label="닉네임"
            id="nickname"
            type="text"
            placeholder="닉네임 입력"
            {...profileForm.register("nickname")}
            errors={profileForm.formState.errors.nickname?.message}
          />
          <ActiveBtn
            disabled={profileForm.formState.isSubmitting || !profileForm.formState.isValid}
            onClick={profileForm.handleSubmit(onSubmitProfile)}
          >
            저장
          </ActiveBtn>
        </form>
      </div>

      {/* 비밀번호 변경 섹션 */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">비밀번호 변경</h2>
        <form onSubmit={passwordForm.handleSubmit(onSubmitPasswordChange)}>
          <InputItem
            label="현재 비밀번호"
            id="currentPassword"
            type="password"
            placeholder="현재 비밀번호 입력"
            {...passwordForm.register("currentPassword")}
            errors={passwordForm.formState.errors.currentPassword?.message}
          />
          <InputItem
            label="새 비밀번호"
            id="newPassword"
            type="password"
            placeholder="새 비밀번호 입력"
            {...passwordForm.register("newPassword")}
            errors={passwordForm.formState.errors.newPassword?.message}
          />
          <InputItem
            label="새 비밀번호 확인"
            id="confirmPassword"
            type="password"
            placeholder="새 비밀번호 확인"
            {...passwordForm.register("confirmPassword")}
            errors={passwordForm.formState.errors.confirmPassword?.message}
          />
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
