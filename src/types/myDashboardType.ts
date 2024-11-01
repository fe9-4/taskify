// 내 대시보드
interface IDashboardList {
  id: number;
  title: string;
  color: string;
  createdAt: string;
  createdByMe: boolean;
}

export interface IMyDashboard {
  dashboards: IDashboardList[];
  totalCount: number;
  cursorId: number;
}

export interface IInvitationList {
  id: number;
  inviter: {
    nickname: string;
    email: string;
  };
  teamId: string;
  dashboard: {
    title: string;
    id: number;
  };
  invitee: {
    nickname: string;
    email: string;
    id: number;
  };
  inviteAccepted: boolean;
}

export interface IInvitation {
  cursorId: number;
  invitations: IInvitationList[];
}
