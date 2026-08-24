import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBookmarks, deleteBookmark } from '../../data/repository';
import { getRoadmapById } from '../SkillRoadmap/data/roadmapData';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import { ArrowLeft, Bookmark, Trash2, Map } from 'lucide-react';
import './BookmarksPage.css';

export default function BookmarksPage() {
  const [topicBookmarks, setTopicBookmarks] = useState([]);
  const [roadmapBookmarks, setRoadmapBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const loadBookmarks = async () => {
    setLoading(true);
    // Load Topic Bookmarks from DB
    const bms = await getAllBookmarks();
    setTopicBookmarks(bms);

    // Load Roadmap Bookmarks from localStorage
    const rawRms = localStorage.getItem('studymapper_roadmap_bookmarks');
    const rmIds = rawRms ? JSON.parse(rawRms) : [];
    const rms = rmIds.map(id => getRoadmapById(id)).filter(Boolean);
    setRoadmapBookmarks(rms);

    setLoading(false);
  };

  useEffect(() => { loadBookmarks(); }, []);

  const handleDeleteTopic = async (e, id) => {
    e.stopPropagation();
    await deleteBookmark(id);
    toast('Topic bookmark removed', 'info');
    loadBookmarks();
  };

  const handleDeleteRoadmap = (e, id) => {
    e.stopPropagation();
    const rawRms = localStorage.getItem('studymapper_roadmap_bookmarks');
    let rmIds = rawRms ? JSON.parse(rawRms) : [];
    rmIds = rmIds.filter(rmId => rmId !== id);
    localStorage.setItem('studymapper_roadmap_bookmarks', JSON.stringify(rmIds));
    toast('Roadmap bookmark removed', 'info');
    loadBookmarks();
  };

  const hasBookmarks = topicBookmarks.length > 0 || roadmapBookmarks.length > 0;

  return (
    <div className="bookmarks-page">

      <h1><Bookmark size={24} /> Bookmarks</h1>

      {loading ? (
        <div className="loading-container"><div className="spinner spinner-lg"></div></div>
      ) : !hasBookmarks ? (
        <div className="empty-state">
          <Bookmark size={48} />
          <h3>No bookmarks yet</h3>
          <p>Bookmark roadmaps and topics while studying to access them quickly later.</p>
        </div>
      ) : (
        <div className="bookmarks-content">
          {roadmapBookmarks.length > 0 && (
            <div className="bookmarks-section">
              <h2>Roadmaps</h2>
              <div className="bookmarks-list">
                {roadmapBookmarks.map(rm => (
                  <div key={rm.id} className="bookmark-item" onClick={() => navigate(`/roadmap/${rm.id}`)}>
                    <Map size={24} color="#3b82f6" style={{ flexShrink: 0 }} />
                    <div className="bookmark-info">
                      <h4>{rm.title}</h4>
                      <p>Roadmap</p>
                    </div>
                    <button className="btn-icon" onClick={(e) => handleDeleteRoadmap(e, rm.id)} title="Remove bookmark">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {topicBookmarks.length > 0 && (
            <div className="bookmarks-section">
              <h2>Study Topics</h2>
              <div className="bookmarks-list">
                {topicBookmarks.map(bm => (
                  <div key={bm.id} className="bookmark-item" onClick={() => navigate(`/topic/${bm.topic_id}`)}>
                    <Bookmark size={24} color="var(--accent-brand)" style={{ flexShrink: 0 }} />
                    <div className="bookmark-info">
                      <h4>{bm.topic_title}</h4>
                      <p>Bookmarked {new Date(bm.created_at).toLocaleDateString()}</p>
                    </div>
                    <button className="btn-icon" onClick={(e) => handleDeleteTopic(e, bm.id)} title="Remove bookmark">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
