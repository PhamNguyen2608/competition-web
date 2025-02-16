import { db } from '../config/firebase.config';
import { collection, writeBatch, doc } from 'firebase/firestore';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    text: "Hệ thống chính trị nước CHXHCN Việt Nam vận hành theo cơ chế nào?",
    options: [
      { id: "A", text: "Đảng lãnh đạo, Nhà nước quản lý, nhân dân làm chủ" },
      { id: "B", text: "Đảng làm chủ, Nhà nước lãnh đạo, nhân dân quản lý" },
      { id: "C", text: "Đảng quản lý, nhà nước lãnh đạo, nhân dân làm chủ" },
      { id: "D", text: "Đảng lãnh đạo, Nhà nước làm chủ, nhân dân quản lý" },
    ],
    correctAnswer: "A" // Thêm đáp án đúng cho mỗi câu hỏi
  },
  {
    id: 2,
    text: "Thủ đô của Việt Nam là thành phố nào?",
    options: [
      { id: "A", text: "Hà Nội" },
      { id: "B", text: "Hồ Chí Minh" },
      { id: "C", text: "Đà Nẵng" },
      { id: "D", text: "Hải Phòng" },
    ],
    correctAnswer: "A"
  },
  // Thêm các câu hỏi khác vào đây
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
    return true; // Trả về true nếu thành công
  } catch (error) {
    console.error('Error seeding questions:', error);
    return false; // Trả về false nếu thất bại
  }
}

// Xóa dòng gọi hàm tự động
// seedQuestions(); 