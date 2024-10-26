// 내 대시보드
interface IDashboardList {
  id: number;
  title: string;
  color: string;
  createdAt: string;
  createdByMe: boolean;
}

export interface IMyDashboard {
  dsahboards: IDashboardList[];
  totalCount: number;
  cursorId: number;
}

interface IInvitationList {
  id: number;
  inviter: {
    nickname: string;
    email: string;
  }
  teamId: string;
  dashboard: {
    title: string;
  }
  invitee: {
    nickname: string;
    email: string;
  }
  inviteAccepted: boolean;
}

export interface IInvitation {
  cursorId: number;
  invitations: IInvitationList[];
}