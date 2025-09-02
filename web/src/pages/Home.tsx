import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';

import QuestionCard from '../components/QuestionCard';
import QuestionFilter from '../components/QuestionFilter';
import QuestionModal from '../components/QuestionModal';
import FloatingSubmitButton from '../components/FloatingSubmitButton';
import HeroSection from '../components/HeroSection';
import { Question } from '../types';
import { sampleQuestions } from '../data/Questions';
import { useAuth } from '../hooks/useAuth';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'answered' | 'unanswered'>('all');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showHeroSection, setShowHeroSection] = useState(true);

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

  const handleQuestionSubmit = (title: string, description: string, submitterName: string) => {
    const newQuestion: Question = {
      id: `${Date.now()}`,
      title,
      description,
      submitterName,
      submittedAt: new Date(),
      status: 'unanswered',
    };
    
    setQuestions(prev => [newQuestion, ...prev]);
  };

  const handleAnswerSubmit = (questionId: string, answer: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? {
            ...q,
            status: 'answered' as const,
            answer,
            answeredBy: speaker?.name,
            answeredAt: new Date(),
          }
        : q
    ));
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
          {filteredAndSortedQuestions.length === 0 ? (
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