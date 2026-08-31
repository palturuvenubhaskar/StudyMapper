import { useEffect } from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Brain, Code, Users, BookOpen, Target, TrendingUp, Clock, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../data/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { ProgressOverview } from './ProgressOverview';
import './Placement.css';


const CATEGORIES = [
  {
    id: 'aptitude',
    name: 'Aptitude Practice',
    icon: Brain,
    color: '#6366f1', // Indigo
    gradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
    description: 'Master Quantitative, Logical Reasoning, and Verbal Ability',
    learnPath: '/placement/aptitude/learn',
    testPath: '/placement/aptitude/test',
    subcategories: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'],
  },
  {
    id: 'technical',
    name: 'Technical Interview',
    icon: Code,
    color: '#10b981', // Emerald
    gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    description: 'DSA, OS, DBMS, Networking, System Design',
    learnPath: '/placement/technical/learn',
    testPath: '/placement/technical/test',
    subcategories: ['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'System Design', 'OOP'],
  },
  {
    id: 'hr',
    name: 'HR & Behavioral',
    icon: Users,
    color: '#f59e0b', // Amber
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    description: 'STAR method, leadership stories, cultural fit',
    learnPath: '/placement/hr/learn',
    testPath: '/placement/hr/test',
    subcategories: ['STAR Method', 'Leadership', 'Teamwork', 'Conflict Resolution', 'Self Introduction', 'Company Research'],
  },
];

export default function Placement() {
  useDocumentTitle('Placement Prep');
  const navigate = useNavigate();

  // Fetch aggregated stats from IndexedDB
  const stats = useLiveQuery(async () => {
    const learnProgress = await db.placement_learning_progress.toArray();
    const testResults = await db.placement_test_results.toArray();
    
    return {
      topicsLearned: learnProgress.filter(p => p.status === 'completed').length,
      totalTopics: await db.placement_topics.count(),
      testsTaken: testResults.length,
      avgScore: testResults.length 
        ? Math.round(testResults.reduce((a, r) => a + (r.score / r.total_questions * 100), 0) / testResults.length)
        : 0,
      totalInteractions: testResults.length * 5 + learnProgress.length, // approximate
    };
  }, []);

  return (
    <div className="placement-hub">
      {/* Header Section */}
      <div className="placement-header">
        <div className="placement-header-content">
          <span className="placement-badge">
            <Target size={14} />
            Career Prep Mode
          </span>
          <h1>Placement <span className="text-accent">Prep</span></h1>
          <p className="placement-subtitle">
            Master concepts before you test. Structured learning paths for every interview stage.
          </p>
          
          {/* Quick Stats */}
          <div className="placement-quick-stats">
            <div className="quick-stat">
              <BookOpen size={18} />
              <span>{stats?.topicsLearned || 0} Topics Learned</span>
            </div>
            <div className="quick-stat">
              <Award size={18} />
              <span>{stats?.avgScore || 0}% Avg Score</span>
            </div>
            <div className="quick-stat">
              <TrendingUp size={18} />
              <span>{stats?.testsTaken || 0} Tests Taken</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards - Redesigned with Learn + Test CTAs */}
      <div className="placement-categories">
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} category={cat} stats={stats} />
        ))}
      </div>

      {/* Recent Activity / Progress Section */}
      <div className="placement-activity">
        <h2>Your Progress</h2>
        <ProgressOverview />
      </div>
    </div>
  );
}

function CategoryCard({ category, stats }) {
  const Icon = category.icon;
  
  // Calculate category-specific progress
  const progress = useLiveQuery(async () => {
    const topics = await db.placement_topics.where('category').equals(category.id).toArray();
    const topicIds = topics.map(t => t.id);
    const learned = await db.placement_learning_progress.where('topic_id').anyOf(topicIds).and(p => p.status === 'completed').count();
    const tested = await db.placement_test_results.where('category').equals(category.id).count();
    
    return {
      totalTopics: topics.length,
      learned,
      tested,
      percentComplete: topics.length ? Math.round((learned / topics.length) * 100) : 0,
    };
  }, [category.id]);

  return (
    <div className="category-card" style={{ '--cat-color': category.color }}>
      <div className="category-card-header" style={{ background: category.gradient }}>
        <div className="category-icon-wrapper">
          <Icon size={28} style={{ color: category.color }} />
        </div>
        <div className="category-progress-ring">
          <svg viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={category.color}
              strokeWidth="3"
              strokeDasharray={`${progress?.percentComplete || 0}, 100`}
            />
          </svg>
          <span>{progress?.percentComplete || 0}%</span>
        </div>
      </div>
      
      <div className="category-card-body">
        <h3>{category.name}</h3>
        <p>{category.description}</p>
        
        <div className="category-topics-preview">
          {category.subcategories.slice(0, 3).map(sub => (
            <span key={sub} className="topic-tag">{sub}</span>
          ))}
          {category.subcategories.length > 3 && (
            <span className="topic-tag more">+{category.subcategories.length - 3}</span>
          )}
        </div>

        <div className="category-card-actions">
          <Link to={category.learnPath} className="btn-learn">
            <BookOpen size={16} />
            Learn
            {progress && progress.learned > 0 && (
              <span className="action-badge">{progress.learned}/{progress.totalTopics}</span>
            )}
          </Link>
          <Link to={category.testPath} className="btn-test">
            <Target size={16} />
            Test
            {progress && progress.tested > 0 && (
              <span className="action-badge">{progress.tested}</span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
