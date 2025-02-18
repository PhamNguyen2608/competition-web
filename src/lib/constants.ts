export const SITE_CONFIG = {
    title: "CUỘC THI TRỰC TUYẾN TÌM HIỂU LỊCH SỬ ĐẢNG BỘ THỊ TRẤN LƯƠNG SƠN",
    status: "CUỘC THI ĐÃ KẾT THÚC",
    loginMessage: "Bạn cần đăng nhập để dự thi",
  }
  
  export const NAV_ITEMS = [
    { label: "Trang chủ", href: "/" },
    { label: "Hướng dẫn", href: "#guidelines" },
    { label: "Bảng xếp hạng", href: "/leaderboard", adminOnly: true },
    { label: "Kết quả thi", href: "/exam/result", userOnly: true },
  ]
  
  export const AUTH_NAV_ITEMS = {
    authenticated: { label: "Đăng xuất", href: "#", isLogout: true },
    unauthenticated: { label: "Đăng nhập", href: "/login" }
  }
  
  export const TIMER_UNITS = ["Ngày", "Giờ", "Phút", "Giây"]
  
  export const GUIDELINES = [
    {
      id: "registration",
      title: "Hướng dẫn đăng ký thi trên MyAladdin",
      content: "Chào các bạn, sau đây Admin hướng dẫn bạn các thao tác tham gia dự thi trên Myaloha.1. Nếu bạn muốn tham gia cuộc thi ngẫu nhiên nào đó, bạn chỉ cần vào trang chủ Myaloha tìm kiếm theo chủ đề và thực hiện các bước tham gia dự thi theo yêu cầu",
    },
    {
      id: "results",
      title: "Hướng dẫn xem lại kết quả làm bài",
      content: "Myaloha xin chào Hôm nay Admin chia sẻ với mọi người về cách tra cứu lịch sử làm bài của thí sinh sau khi tham gia cuộc thi.Để kiểm tra thông tin bài làm bạn có thể thực hiện các bước sau:",
    },
    {
      id: "account",
      title: "Hướng dẫn đăng ký tài khoản trên cổng triển lãm",
      content: "[Nội dung hướng dẫn đăng ký tài khoản]",
    },
    {
      id: "privacy",
      title: "Bảo mật thông tin cá nhân",
      content: "[Nội dung về bảo mật thông tin]",
    },
  ]
  
  export const EXAM_RULES = [
    "Thí sinh có 30 phút để hoàn thành bài thi",
    "Mỗi câu hỏi chỉ được chọn một đáp án", 
    "Hệ thống sẽ tự động nộp bài khi hết thời gian"
  ] as const;
  
  export const EXAM_CONFIG = {
    DURATION: 30 * 60, // 30 phút (tính bằng giây)
    MAX_ATTEMPTS: 3,
    PASS_SCORE: 80,
    TOTAL_QUESTIONS: 30,
    REWARDS: {
      FIRST_PRIZE: 5000000,
      SECOND_PRIZE: 3000000,
      THIRD_PRIZE: 1000000
    }
  } as const;
  
  export const LOCATION_CONSTANTS = {
    PROVINCE: {
      code: "17",
      name: "Tỉnh Hòa Bình"
    },
    DISTRICT: {
      code: "148",
      name: "Huyện Lương Sơn"
    },
    WARD: {
      code: "4789",
      name: "Thị trấn Lương Sơn"
    }
  }
  
  export const TIEU_KHU = [
    { code: "TK1", name: "Tiểu khu 1" },
    { code: "TK2", name: "Tiểu khu 2" },
    { code: "TK3", name: "Tiểu khu 3" },
    { code: "TK4", name: "Tiểu khu 4" },
    { code: "TK5", name: "Tiểu khu 5" },
    { code: "TK6", name: "Tiểu khu 6" },
    { code: "TK7", name: "Tiểu khu 7" },
    { code: "TK8", name: "Tiểu khu 8" },
    { code: "TK9", name: "Tiểu khu 9" },
    { code: "TK10", name: "Tiểu khu 10" },
    { code: "TK11", name: "Tiểu khu 11" },
    { code: "TK12", name: "Tiểu khu 12" },
    { code: "TK13", name: "Tiểu khu 13" },
    { code: "TK14", name: "Tiểu khu 14" },
    { code: "LIEN_SON", name: "Liên Sơn" },
    { code: "MONG", name: "Mòng" },
    { code: "MO", name: "Mỏ" },
    { code: "DONG_BAI", name: "Đồng Bái" },
    { code: "TH_THCS_BAI_LANG", name: "Trường TH & THCS Bãi Lạng" },
    { code: "TH_THCS_CUU_LONG", name: "Trường TH & THCS Cửu Long" },
    { code: "TH_THCS_HUNG_SON", name: "Trường TH & THCS Hùng Sơn" }
  ];
  
  