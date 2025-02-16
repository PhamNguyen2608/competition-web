import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '../../ui/button';
import { ExamResultService } from '../../../services/examResultService';
import { ExamResult as ExamResultType } from '../../../types/exam';
import { resetQuiz } from '../../../features/exam-question/quizSlice';
import { ParticipantService } from '../../../services/participantService';
import { TIEU_KHU } from '../../../lib/constants';

export const ExamResult = () => {
  const { examResult, questions } = useAppSelector((state) => state.quiz);
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [allResults, setAllResults] = useState<ExamResultType[]>([]);

  const getScoreColor = useCallback((score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchAllResults = async () => {
      try {
        const results = await ExamResultService.getUserResults();
        if (isMounted) {
          setAllResults([...results].sort((a, b) => 
            b.completedAt.toDate().getTime() - a.completedAt.toDate().getTime()
          ));
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };
    
    fetchAllResults();
    return () => { isMounted = false };
  }, [examResult]);

  useEffect(() => {
    const addParticipant = async () => {
      if (examResult && user) {
        try {
          await ParticipantService.addParticipant({
            userId: user.uid,
            name: user.displayName || 'Anonymous',
            score: examResult.score,
            attemptCount: examResult.attemptCount,
            subDistrict: user.tieuKhu
          });
        } catch (error) {
          console.error('Error adding participant:', error);
        }
      }
    };
    addParticipant();
  }, [examResult, user]);

  // Cache kết quả bài thi
  const examResultContent = useMemo(() => {
    if (!examResult) return null;

    return (
      <div className="space-y-4 mb-8">
        <div className="text-center">
          <p className="text-lg">Điểm số của bạn</p>
          <p className={`text-4xl font-bold ${getScoreColor(examResult.score)}`}>
            {Math.round(examResult.score)}/100
          </p>
        </div>

        <div className="text-center">
          <p className="text-lg">Số câu trả lời đúng</p>
          <p className="text-2xl font-semibold">
            {examResult?.correctAnswers}/{questions.length} câu
          </p>
        </div>

        <div className="text-center">
          <p className="text-lg">Số lần đã thi</p>
          <p className="text-2xl font-semibold">
            {examResult?.attemptCount || 0} lần
          </p>
        </div>

        {examResult?.score && examResult.score >= 80 ? (
          <div className="text-center text-green-600 font-medium">
            Chúc mừng! Bạn đã vượt qua bài thi.
          </div>
        ) : (
          <div className="text-center text-red-600 font-medium">
            Bạn chưa đạt điểm yêu cầu. Hãy cố gắng hơn!
          </div>
        )}
      </div>
    );
  }, [examResult, questions.length, getScoreColor]);

  // Cache lịch sử thi
  const examHistoryContent = useMemo(() => {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Lịch sử các lần thi</h3>
        <div className="space-y-4">
          {allResults.map((result) => (
            <div key={result.completedAt.toDate().getTime()} className="p-4 border rounded">
              <div>Lần thi {result.attemptCount}</div>
              <div>Điểm số: {result.score}/100</div>
              <div>Thời gian: {new Date(result.completedAt.toMillis()).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hourCycle: 'h23'
              })}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }, [allResults]);

  if (!examResult) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Kết quả bài thi</h2>
      
      {examResultContent}

      <div className="flex justify-center gap-4">
        <CustomButton
          onClick={() => {
            dispatch(resetQuiz());
            navigate('/exam/questions');
          }}
          variant="outline"
          color="primary"
        >
          Thi lại
        </CustomButton>
        <CustomButton
          onClick={() => navigate('/')}
          variant="solid"
          color="primary"
        >
          Về trang chủ
        </CustomButton>
      </div>

      {examHistoryContent}
    </div>
  );
};
