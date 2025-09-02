import React from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FloatingSubmitButtonProps {
  onClick: () => void;
}

const FloatingSubmitButton: React.FC<FloatingSubmitButtonProps> = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 z-40"
      aria-label={t('questionForm.submit')}
    >
      <Plus className="h-6 w-6" />
    </button>
  );
};

export default FloatingSubmitButton;