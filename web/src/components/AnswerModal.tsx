import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Question } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() || answerType === 'stage') {
      const finalAnswer = answerType === 'stage' ? t('answerModal.answeredLiveOnStage') : answer;
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
          <h2 className="text-lg font-semibold text-gray-900">{t('answerModal.title')}</h2>
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
          <p className="text-xs text-gray-500 mt-2">{t('answerModal.askedBy')}: {question.submitterName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('answerModal.howToAnswer')}
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
                <span className="ml-2 text-sm text-gray-700">{t('answerModal.provideWrittenAnswer')}</span>
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
                <span className="ml-2 text-sm text-gray-700">{t('answerModal.answerLiveOnStage')}</span>
              </label>
            </div>
          </div>

          {answerType === 'text' && (
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                {t('answerModal.yourAnswer')}
              </label>
              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={t('answerModal.answerPlaceholder')}
                required={answerType === 'text'}
              />
            </div>
          )}

          {answerType === 'stage' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                {t('answerModal.stageAnswerExplanation')}
              </p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {t('answerModal.submitAnswer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnswerModal;