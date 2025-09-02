import React, { useState } from 'react';
import { Filter, List, CheckCircle2, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuestionFilterProps {
  currentFilter: 'all' | 'answered' | 'unanswered';
  onFilterChange: (filter: 'all' | 'answered' | 'unanswered') => void;
  questionCounts: {
    total: number;
    answered: number;
    unanswered: number;
  };
}

const QuestionFilter: React.FC<QuestionFilterProps> = ({ 
  currentFilter, 
  onFilterChange, 
  questionCounts 
}) => {
  const { t } = useTranslation();
  
  const filterOptions = [
    { value: 'all' as const, label: t('questionFilter.allQuestions'), icon: List, count: questionCounts.total },
    { value: 'answered' as const, label: t('questionFilter.answered'), icon: CheckCircle2, count: questionCounts.answered },
    { value: 'unanswered' as const, label: t('questionFilter.unanswered'), icon: HelpCircle, count: questionCounts.unanswered },
  ];

  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">{t('questionList.title')}</h2>
      
      <div className="flex items-center space-x-2">
        <Filter className="h-5 w-5 text-gray-400" />
        <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          {filterOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div key={option.value} className="relative">
                <button
                  onClick={() => onFilterChange(option.value)}
                  onMouseEnter={() => setHoveredFilter(option.value)}
                  onMouseLeave={() => setHoveredFilter(null)}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center ${
                    currentFilter === option.value
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">{option.label}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    currentFilter === option.value
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {option.count}
                  </span>
                </button>
                
                {/* Mobile tooltip */}
                {hoveredFilter === option.value && (
                  <div className="md:hidden absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                    {option.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionFilter;