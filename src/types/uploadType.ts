export interface IUploadTypes {
  CARD: "card";
  PROFILE: "profile";
}

export const uploadType: IUploadTypes = {
  CARD: "card",
  PROFILE: "profile",
} as const; // 값을 리터럴 타입으로 고정

export type IUploadType = IUploadTypes[keyof IUploadTypes];
