import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Question } from '../types';
import { useAuth } from '../hooks/useAuth';

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  onSubmit: (questionId: string, answer: string) => void;
}

const AnswerModal: React.FC<AnswerModalProps> = ({ isOpen, onClose, question, onSubmit }) => {
  const [answer, setAnswer] = useState('');
  const [answerType, setAnswerType] = useState<'text' | 'stage'>('text');
  const { speaker } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() || answerType === 'stage') {
      const finalAnswer = answerType === 'stage' ? 'Answered live on stage' : answer;
      onSubmit(question.id, finalAnswer);
      setAnswer('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Answer Question</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-900 mb-2">{question.title}</h3>
          <p className="text-gray-600 text-sm">{question.description}</p>
          <p className="text-xs text-gray-500 mt-2">Asked by: {question.submitterName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you like to answer this question?
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="answerType"
                  value="text"
                  checked={answerType === 'text'}
                  onChange={(e) => setAnswerType(e.target.value as 'text' | 'stage')}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Provide written answer</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="answerType"
                  value="stage"
                  checked={answerType === 'stage'}
                  onChange={(e) => setAnswerType(e.target.value as 'text' | 'stage')}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Answer live on stage</span>
              </label>
            </div>
          </div>

          {answerType === 'text' && (
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                Your Answer
              </label>
              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Type your answer here..."
                required={answerType === 'text'}
              />
            </div>
          )}

          {answerType === 'stage' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                This question will be marked as answered and noted as "Answered live on stage".
                The audience will know that you addressed this question during your presentation.
              </p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Submit Answer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnswerModal;