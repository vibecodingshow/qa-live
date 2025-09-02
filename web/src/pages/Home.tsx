import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';

import QuestionCard from '../components/QuestionCard';
import QuestionFilter from '../components/QuestionFilter';
import QuestionModal from '../components/QuestionModal';
import FloatingSubmitButton from '../components/FloatingSubmitButton';
import HeroSection from '../components/HeroSection';
import { Question } from '../types';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../utils/apiService';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'answered' | 'unanswered'>('all');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showHeroSection, setShowHeroSection] = useState(true);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getQuestions();
        setQuestions(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Set responsive default visibility for hero section
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 768; // Standard mobile breakpoint
      setShowHeroSection(!isMobile); // Hide on mobile, show on desktop
    };

    // Check initial screen size
    checkScreenSize();

    // Add resize listener for responsive behavior
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const { speaker } = useAuth();

  const filteredAndSortedQuestions = useMemo(() => {
    let filtered = questions;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(q => q.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        q => 
          q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.submitterName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort: unanswered questions first (newest first), then answered questions (newest first)
    return filtered.sort((a, b) => {
      if (a.status === 'unanswered' && b.status === 'answered') return -1;
      if (a.status === 'answered' && b.status === 'unanswered') return 1;
      
      // Within the same status, sort by date (newest first)
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });
  }, [questions, searchTerm, statusFilter]);

  const questionCounts = useMemo(() => ({
    total: questions.length,
    answered: questions.filter(q => q.status === 'answered').length,
    unanswered: questions.filter(q => q.status === 'unanswered').length,
  }), [questions]);

  const handleQuestionSubmit = async (title: string, description: string, submitterName: string) => {
    try {
      const questionData = {
        title,
        description,
        submitterName
      };
      
      const newQuestion = await apiService.submitQuestion(questionData);
      setQuestions(prev => [newQuestion, ...prev]);
    } catch (err) {
      console.error('Failed to submit question:', err);
      // You could add error handling UI here
    }
  };

  const handleAnswerSubmit = async (questionId: string, answer: string) => {
    try {
      if (!speaker?.name) return;
      
      const updatedQuestion = await apiService.submitAnswer(questionId, answer, speaker.name);
      
      setQuestions(prev => prev.map(q => 
        q.id === questionId ? updatedQuestion : q
      ));
    } catch (err) {
      console.error('Failed to submit answer:', err);
      // You could add error handling UI here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onToggleHero={() => setShowHeroSection(!showHeroSection)}
        isHeroVisible={showHeroSection}
      />
      
      {showHeroSection && <HeroSection />}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t('questionList.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <QuestionFilter
          currentFilter={statusFilter}
          onFilterChange={setStatusFilter}
          questionCounts={questionCounts}
        />
        
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-2 text-gray-500">{t('questionList.loading')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t('questionList.retry')}
              </button>
            </div>
          ) : filteredAndSortedQuestions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm || statusFilter !== 'all' 
                  ? t('questionList.noQuestionsFiltered')
                  : t('questionList.noQuestions')
                }
              </p>
            </div>
          ) : (
            filteredAndSortedQuestions.map(question => (
              <QuestionCard 
                key={question.id} 
                question={question} 
                onAnswerSubmit={handleAnswerSubmit}
              />
            ))
          )}
        </div>
      </main>
      
      <FloatingSubmitButton onClick={() => setShowQuestionModal(true)} />
      
      {showQuestionModal && (
        <QuestionModal
          isOpen={showQuestionModal}
          onClose={() => setShowQuestionModal(false)}
          onSubmit={handleQuestionSubmit}
        />
      )}
    </div>
  );
};

export default Home;