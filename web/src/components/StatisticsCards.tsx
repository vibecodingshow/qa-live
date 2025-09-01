import React from 'react';
import { Question } from '../types';
import { MessageSquare, CheckCircle, Clock } from 'lucide-react';

interface StatisticsCardsProps {
  questions: Question[];
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ questions }) => {
  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(q => q.status === 'answered').length;
  const unansweredQuestions = questions.filter(q => q.status === 'unanswered').length;

  const stats = [
    {
      title: 'Total Questions',
      value: totalQuestions,
      icon: MessageSquare,
      color: 'bg-blue-900',
    },
    {
      title: 'Answered',
      value: answeredQuestions,
      icon: CheckCircle,
      color: 'bg-green-600',
    },
    {
      title: 'Unanswered',
      value: unansweredQuestions,
      icon: Clock,
      color: 'bg-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.title} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} p-3 rounded-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;