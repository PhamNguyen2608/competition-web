import { db } from '../config/firebase.config';
import { collection, writeBatch, doc } from 'firebase/firestore';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    text: "Trong bối cảnh chuyển đổi số toàn diện năm 2025, chiến lược của Đảng Cộng sản Việt Nam trong hiện đại hóa bộ máy hành chính là gì?",
    options: [
      { id: "A", text: "Ứng dụng trí tuệ nhân tạo và phân tích dữ liệu lớn" },
      { id: "B", text: "Tăng cường đầu tư cơ sở vật chất truyền thống" },
      { id: "C", text: "Tập trung xây dựng hệ thống quản lý giấy tờ" },
      { id: "D", text: "Chỉ đào tạo cán bộ theo mô hình cũ" },
    ],
    correctAnswer: "A"
  },
  {
    id: 2,
    text: "Để phát huy vai trò lãnh đạo trong cuộc cách mạng công nghiệp 4.0, Đảng đã khuyến khích doanh nghiệp nhà nước đổi mới sáng tạo thông qua:",
    options: [
      { id: "A", text: "Hợp tác với các công ty khởi nghiệp công nghệ" },
      { id: "B", text: "Tăng cường đầu tư vào R&D (nghiên cứu và phát triển)" },
      { id: "C", text: "Áp dụng chuyển đổi số trong quản lý sản xuất" },
      { id: "D", text: "Tất cả các đáp án trên" },
    ],
    correctAnswer: "D"
  },
  {
    id: 3,
    text: "Để tăng cường đối thoại với giới trẻ, Đảng đã triển khai những hình thức nào nhằm thu hút sự tham gia của thanh niên?",
    options: [
      { id: "A", text: "Tổ chức diễn đàn trực tuyến và cuộc thi ý tưởng đổi mới sáng tạo" },
      { id: "B", text: "Chỉ tổ chức các hội thảo truyền thống" },
      { id: "C", text: "Phát hành sách lý luận dài dòng" },
      { id: "D", text: "Giới hạn thông tin truyền thông" },
    ],
    correctAnswer: "A"
  },
  {
    id: 4,
    text: "Trong bối cảnh toàn cầu hóa, Đảng chủ động thiết lập quan hệ hợp tác với các nước khác thông qua:",
    options: [
      { id: "A", text: "Tham gia diễn đàn quốc tế về chính trị và kinh tế" },
      { id: "B", text: "Tổ chức hội nghị đối thoại song phương" },
      { id: "C", text: "Phát triển dự án hợp tác công nghệ cao" },
      { id: "D", text: "Tất cả các đáp án trên" },
    ],
    correctAnswer: "D"
  },
  {
    id: 5,
    text: "Để đẩy mạnh công tác phòng, chống tham nhũng trong thời kỳ số hóa, Đảng đã thực hiện biện pháp nào phù hợp với tình hình hiện nay?",
    options: [
      { id: "A", text: "Tăng cường minh bạch thông tin và ứng dụng công nghệ giám sát" },
      { id: "B", text: "Thiết lập hệ thống kiểm tra nội bộ độc lập" },
      { id: "C", text: "Phối hợp chặt chẽ với các cơ quan điều tra" },
      { id: "D", text: "Tất cả các đáp án trên" },
    ],
    correctAnswer: "D"
  },
  {
    id: 6,
    text: "Trong chiến lược phát triển bền vững năm 2025, Đảng chú trọng đầu tư vào những lĩnh vực nào nhằm bảo vệ môi trường và nâng cao chất lượng cuộc sống?",
    options: [
      { id: "A", text: "Công nghệ xanh và năng lượng tái tạo" },
      { id: "B", text: "Hạ tầng giao thông công cộng hiện đại" },
      { id: "C", text: "Đô thị thông minh với ứng dụng CNTT" },
      { id: "D", text: "Tất cả các đáp án trên" },
    ],
    correctAnswer: "D"
  },
  {
    id: 7,
    text: "Để thích ứng với biến đổi khí hậu và ứng phó thiên tai, chính sách của Đảng hiện nay ưu tiên hướng đến việc:",
    options: [
      { id: "A", text: "Tăng cường hệ thống cảnh báo sớm" },
      { id: "B", text: "Đầu tư xây dựng cơ sở hạ tầng chống chịu thiên tai" },
      { id: "C", text: "Phát triển công nghệ dự báo thời tiết chính xác" },
      { id: "D", text: "Tất cả các đáp án trên" },
    ],
    correctAnswer: "D"
  },
  {
    id: 8,
    text: "Vai trò của thanh niên trong xây dựng và bảo vệ Tổ quốc được Đảng chú trọng qua các hoạt động nào?",
    options: [
      { id: "A", text: "Tuyên truyền lý tưởng cách mạng qua các phương tiện số" },
      { id: "B", text: "Tổ chức hoạt động tình nguyện và đổi mới sáng tạo" },
      { id: "C", text: "Chính sách hỗ trợ khởi nghiệp và đào tạo kỹ năng số" },
      { id: "D", text: "Tất cả các đáp án trên" },
    ],
    correctAnswer: "D"
  },
  {
    id: 9,
    text: "Trong quá trình hội nhập kinh tế quốc tế, cải cách pháp luật của Đảng hướng tới mục tiêu:",
    options: [
      { id: "A", text: "Tạo môi trường đầu tư minh bạch, thân thiện" },
      { id: "B", text: "Bảo vệ quyền lợi cho doanh nghiệp trong nước" },
      { id: "C", text: "Nâng cao cạnh tranh lành mạnh trên thị trường toàn cầu" },
      { id: "D", text: "Tất cả các đáp án trên" },
    ],
    correctAnswer: "D"
  },
  {
    id: 10,
    text: "Định hướng phát triển mới của Đảng năm 2025 nhấn mạnh mục tiêu gì nhằm đảm bảo sự phát triển toàn diện của đất nước?",
    options: [
      { id: "A", text: "Xây dựng nền kinh tế số và tri thức" },
      { id: "B", text: "Phát triển bền vững, bảo vệ môi trường và nâng cao chất lượng cuộc sống" },
      { id: "C", text: "Tăng cường hợp tác quốc tế và hội nhập kinh tế" },
      { id: "D", text: "Tất cả các đáp án trên" },
    ],
    correctAnswer: "D"
  },
  // Các câu hỏi chuyên về đối ngoại và kinh tế hot gần đây
  {
    id: 11,
    text: "Theo hiệp định CEPA ký với UAE vào năm 2024, UAE đã cam kết bãi bỏ thuế đối với bao nhiêu phần trăm hàng hóa xuất khẩu của Việt Nam?",
    options: [
      { id: "A", text: "90%" },
      { id: "B", text: "95%" },
      { id: "C", text: "98.5%" },
      { id: "D", text: "99%" },
    ],
    correctAnswer: "D"
  },
  {
    id: 12,
    text: "Trong các thỏa thuận vừa ký giữa các doanh nghiệp của Việt Nam và Hoa Kỳ, Việt Nam dự kiến sẽ tập trung phát triển những lĩnh vực nào?",
    options: [
      { id: "A", text: "Năng lượng" },
      { id: "B", text: "Trí tuệ nhân tạo (AI)" },
      { id: "C", text: "Trung tâm dữ liệu" },
      { id: "D", text: "Tất cả các đáp án trên" },
    ],
    correctAnswer: "D"
  },
  {
    id: 13,
    text: "Theo Thủ tướng Phạm Minh Chính, điều gì đang được kỳ vọng từ Hoa Kỳ để hỗ trợ sự phát triển công nghệ của Việt Nam?",
    options: [
      { id: "A", text: "Giảm thuế nhập khẩu" },
      { id: "B", text: "Bãi bỏ lệnh cấm xuất khẩu công nghệ quan trọng" },
      { id: "C", text: "Tăng cường hỗ trợ viện trợ phát triển" },
      { id: "D", text: "Thúc đẩy đầu tư hạ tầng" },
    ],
    correctAnswer: "B"
  },
  {
    id: 14,
    text: "Thách thức lớn nhất với kinh tế Việt Nam 2025 theo Ngân hàng Thế giới?",
    options: [
      { id: "A", text: "Nợ công cao" },
      { id: "B", text: "Biến đổi khí hậu" },
      { id: "C", text: "Phụ thuộc vào FDI" },
      { id: "D", text: " Thiếu lao động trẻ" },
    ],
    correctAnswer: "B"
  },
  {
    id: 15,
    text: "Giải pháp chống biến đổi khí hậu 2025",
    options: [
      { id: "A", text: "Phát triển năng lượng tái tạo" },
      { id: "B", text: "Xây đê biển thông minh" },
      { id: "C", text: "Ứng dụng AI dự báo thiên tai" },
      { id: "D", text: "Tất cả các đáp án trên" },
    ],
    correctAnswer: "D"
  }
];

export async function seedQuestions() {
  try {
    const batch = writeBatch(db);
    const questionsRef = collection(db, 'questions');

    QUIZ_QUESTIONS.forEach((question) => {
      const docRef = doc(questionsRef, question.id.toString());
      batch.set(docRef, question);
    });

    await batch.commit();
    console.log('Successfully seeded questions to Firestore');
    return true;
  } catch (error) {
    console.error('Error seeding questions:', error);
    return false;
  }
}

// Xóa dòng gọi hàm tự động
// seedQuestions();
