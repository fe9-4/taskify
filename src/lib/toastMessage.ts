const toastMessages = {
  success: {
    login: "로그인에 성공했습니다",
    signup: "가입에 성공했습니다",
    editPassword: "비밀번호가 변경되었습니다",
    updateProfile: "프로필이 업데이트 되었습니다",

    createDashboard: "대시보드가 생성되었습니다",
    editDashboard: "대시보드가 수정되었습니다",
    deleteDashboard: "대시보드가 삭제되었습니다",

    invitation: "대시보드 초대를 보냈습니다",
    cancelInvitation: "초대가 취소되었습니다",
    acceptInvitation: "초대를 수락하였습니다",
    refuseInvitation: "초대를 거절하였습니다",
    deleteMember: "멤버가 삭제되었습니다",

    createColumn: "컬럼이 생성되었습니다",
    editColumn: "컬럼이 수정되었습니다",
    deleteColumn: "컬럼이 삭제되었습니다",

    uploardImage: "이미지가 업로드되었습니다",

    createCard: "카드가 생성되었습니다",
    editCard: "카드가 수정되었습니다",
    deleteCard: "카드가 삭제되었습니다",
    moveCard: "카드가 이동되었습니다",

    createComment: "댓글이 생성되었습니다",
    editCommnet: "댓글이 수정되었습니다",
    deleteComment: "댓글이 삭제되었습니다",
  },
  error: {
    login: "로그인에 실패하였습니다",
    signup: "가입에 실패하였습니다",
    editPassword: "비밀번호 변경이 실패하였습니다",
    updateProfile: "프로필 업데이트 실패하였습니다",

    isDashboardOwner: "대시보드를 생성한 유저는 삭제할 수 없습니다",
    isValidDashboard: "유효하지 않은 대시보드입니다.",
    getDashboardList: "대시보드 목록을 불러오는데 실패하였습니다",
    getDashboard: "대시보드 정보를 불러오는데 실패하였습니다",
    createDashboard: "대시보드 생성이 실패하였습니다",
    editDashboard: "대시보드 수정이 실패하였습니다",
    deleteDashboard: "대시보드 삭제가 실패하였습니다",

    invitation: "대시보드 초대에 실패하였습니다",
    cancelInvitation: "초대 취소가 실패하였습니다",

    getMemberList: "멤버 정보를 불러오는데 실패했습니다",
    deleteMember: "멤버 삭제가 실패하였습니다",

    getColumnList: "컬럼 목록을 불러오는데 실패하였습니다",
    createColumn: "컬럼 생성이 실패하였습니다",
    editColumn: "컬럼 수정이 실패하였습니다",
    deleteColumn: "컬럼 삭제가 실패하였습니다",

    uploardImage: "이미지 업로드가 실패하였습니다",

    getCardList: "카드 목록을 불러오는데 실패하였습니다",
    getCard: "카드 데이터를 불러오는데 실패하였습니다",
    createCard: "카드 생성이 실패하였습니다",
    editCard: "카드 수정이 실패하였습니다",
    deleteCard: "카드 삭제가 실패하였습니다",
    moveCard: "카드 이동이 실패하였습니다",

    getComment: "댓글 조회에 실해하였습니다",
    createComment: "댓글 생성이 실패하였습니다",
    editCommnet: "댓글 수정이 실패하였습니다",
    deleteComment: "댓글 삭제가 실패하였습니다",

    firstPage: "첫 번째 페이지입니다.",
    lasgPage: "마지막 페이지입니다.",
  },
};

export default toastMessages;
