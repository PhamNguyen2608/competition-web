export const SITE_CONFIG = {
    title: "CUỘC THI TRỰC TUYẾN TÌM HIỂU LỊCH SỬ ĐẢNG CỘNG SẢN VIỆT NAM",
    status: "CUỘC THI ĐÃ KẾT THÚC",
    loginMessage: "Bạn cần đăng nhập để dự thi",
  }
  
  export const NAV_ITEMS = [
    { label: "Trang chủ", href: "/" },
    { label: "Hướng dẫn", href: "#guidelines" },
    { label: "Bảng xếp hạng", href: "#leaderboard" },
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
    "Thí sinh có 45 phút để hoàn thành bài thi",
    "Không được phép tham khảo tài liệu",
    "Mỗi câu hỏi chỉ được chọn một đáp án", 
    "Hệ thống sẽ tự động nộp bài khi hết thời gian"
  ] as const;
  
  