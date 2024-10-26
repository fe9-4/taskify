interface InvitationsItemType {
  id: number;
  inviter: {
    id: number;
    email: string;
    nickname: string;
  };
  teamId: "9-4";
  dashboard: {
    id: number;
    title: string;
  };
  invitee: {
    id: number;
    email: string;
    nickname: string;
  };
  inviteAccepted: null;
  createdAt: string;
  updatedAt: string;
}

export default InvitationsItemType;
