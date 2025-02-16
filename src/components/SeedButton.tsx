import React, { useState } from 'react';
import { seedQuestions } from '../scripts/seedQuestions';

const SeedButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const success = await seedQuestions();
      if (success) {
        setMessage('Thêm câu hỏi thành công!');
      } else {
        setMessage('Có lỗi xảy ra khi thêm câu hỏi.');
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra khi thêm câu hỏi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleSeed}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? 'Đang thêm câu hỏi...' : 'Thêm câu hỏi'}
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default SeedButton; 