import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import StatisticsCards from '../components/StatisticsCards';
import QuestionCard from '../components/QuestionCard';
import QuestionFilter from '../components/QuestionFilter';
import QuestionModal from '../components/QuestionModal';
import FloatingSubmitButton from '../components/FloatingSubmitButton';
import HeroSection from '../components/HeroSection';
import { Question } from '../types';
import { sampleQuestions } from '../data/Questions';
import { useAuth } from '../hooks/useAuth';

const Home: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'answered' | 'unanswered'>('all');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showHeroSection, setShowHeroSection] = useState(true);
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
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        onToggleHero={() => setShowHeroSection(!showHeroSection)}
        isHeroVisible={showHeroSection}
      />
      
      {showHeroSection && <HeroSection />}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatisticsCards questions={questions} />
        
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
                  ? 'No questions found matching your filters.' 
                  : 'No questions yet. Be the first to ask!'
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