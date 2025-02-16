import React from 'react';
import { CustomButton } from '../../ui/button';

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

interface ExamQuestionProps {
  question: Question;
  selectedAnswer: string | null;
  onSelectAnswer: (answerId: string) => void;
  questionNumber: number;
}

export const ExamQuestion: React.FC<ExamQuestionProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  questionNumber,
}) => {
  return (
    <div className="space-y-4">
      <div className="font-medium text-lg text-gray-900">
        <span className="mr-2">Câu {questionNumber}:</span>
        {question.text}
      </div>
      
      <div className="space-y-2">
        {question.options.map((option) => (
         <CustomButton
         key={option.id}
         variant={selectedAnswer === option.id ? "solid" : "outline"}
         color={selectedAnswer === option.id ? "primary" : "muted"}
         className="w-full justify-start text-left p-4"
         onClick={() => onSelectAnswer(option.id)}
       >
         {option.text}
       </CustomButton>
       
        ))}
      </div>
    </div>
  );
};