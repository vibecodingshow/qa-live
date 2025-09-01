import React, { useState } from 'react';
import { Question } from '../types';
import { timeAgo } from '../utils/dateUtils';
import { CheckCircle, Clock, User, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AnswerModal from './AnswerModal';

interface QuestionCardProps {
  question: Question;
  onAnswerSubmit: (questionId: string, answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswerSubmit }) => {
  const { isAuthenticated } = useAuth();
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  const handleSelectToAnswer = () => {
    setShowAnswerModal(true);
  };

  return (
    <>
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            {question.status === 'answered' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Clock className="h-5 w-5 text-red-600" />
            )}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              question.status === 'answered' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {question.status === 'answered' ? 'Answered' : 'Unanswered'}
            </span>
          </div>
          
          {isAuthenticated && question.status === 'unanswered' && (
            <button
              onClick={handleSelectToAnswer}
              className="px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Select to Answer
            </button>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {question.title}
        </h3>
        
        <p className="text-gray-700 mb-4 leading-relaxed">
          {question.description}
        </p>

        {question.answer && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Answer:</h4>
            <p className="text-gray-700 leading-relaxed">{question.answer}</p>
            {question.answeredBy && (
              <p className="text-xs text-gray-500 mt-2">
                Answered by {question.answeredBy}
                {question.answeredAt && ` • ${timeAgo(question.answeredAt)}`}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{question.submitterName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{timeAgo(question.submittedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {showAnswerModal && (
        <AnswerModal
          isOpen={showAnswerModal}
          onClose={() => setShowAnswerModal(false)}
          question={question}
          onSubmit={onAnswerSubmit}
        />
      )}
    </>
  );
};

export default QuestionCard;