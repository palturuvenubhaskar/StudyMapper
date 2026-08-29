import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../data/db';
import { TrendingUp, Award, Clock, Target, Brain, Code, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ProgressOverview() {
  const stats = useLiveQuery(async () => {
    const learnProgress = await db.placement_learning_progress.toArray();
    const testResults = await db.placement_test_results.toArray();
    const bookmarks = await db.placement_bookmarks.toArray();
    
    const byCategory = {
      aptitude: { learned: 0, tested: 0, avgScore: 0, tests: [] },
      technical: { learned: 0, tested: 0, avgScore: 0, tests: [] },
      hr: { learned: 0, tested: 0, avgScore: 0, tests: [] },
    };
    
    learnProgress.forEach(p => {
      const cat = p.topic_id.split('-')[0];
      if (byCategory[cat] && p.status === 'completed') byCategory[cat].learned++;
    });
    
    testResults.forEach(r => {
      if (byCategory[r.category]) {
        byCategory[r.category].tested++;
        byCategory[r.category].tests.push(r.score / r.total_questions * 100);
      }
    });
    
    Object.keys(byCategory).forEach(cat => {
      const scores = byCategory[cat].tests;
      byCategory[cat].avgScore = scores.length ? Math.round(scores.reduce((a,b) => a+b, 0) / scores.length) : 0;
    });
    
    return { byCategory, totalBookmarks: bookmarks.length };
  });

  const categories = [
    { id: 'aptitude', name: 'Aptitude', icon: Brain, color: '#6366f1' },
    { id: 'technical', name: 'Technical', icon: Code, color: '#10b981' },
    { id: 'hr', name: 'HR & Behavioral', icon: Users, color: '#f59e0b' },
  ];

  return (
    <div className="progress-overview">
      <div className="progress-cards">
        {categories.map(cat => {
          const catStats = stats?.byCategory[cat.id];
          return (
            <div key={cat.id} className="progress-category-card" style={{ '--cat-color': cat.color }}>
              <div className="progress-cat-header">
                <cat.icon size={20} />
                <span>{cat.name}</span>
              </div>
              <div className="progress-cat-stats">
                <div>
                  <span className="stat-value">{catStats?.learned || 0}</span>
                  <span className="stat-label">Learned</span>
                </div>
                <div>
                  <span className="stat-value">{catStats?.tested || 0}</span>
                  <span className="stat-label">Tests</span>
                </div>
                <div>
                  <span className="stat-value">{catStats?.avgScore || 0}%</span>
                  <span className="stat-label">Avg Score</span>
                </div>
              </div>
              <Link to={`/placement/${cat.id}/learn`} className="progress-cta">
                Continue Learning
                <ChevronRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>
      
      {stats?.totalBookmarks > 0 && (
        <div className="progress-bookmarks">
          <h3>Saved for Later</h3>
          <span>{stats.totalBookmarks} bookmarked topics</span>
        </div>
      )}
    </div>
  );
}
