export interface IUploadTypes {
  CARD: "card";
  PROFILE: "profile";
}

export const uploadType: IUploadTypes = {
  CARD: "card",
  PROFILE: "profile",
} as const;

export type IUploadType = IUploadTypes[keyof IUploadTypes];
