import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { FaBookOpen, FaRegEye, FaRegComments, FaTrashAlt, FaEdit, FaChevronRight, FaPen, FaClock, FaKey, FaChevronLeft } from 'react-icons/fa';
import { MdTrendingUp, MdSpaceDashboard } from 'react-icons/md';

const Dashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Tab State
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'drafts', 'claim'

  // Data States
  const [ownedPosts, setOwnedPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [claimPasscode, setClaimPasscode] = useState('');

  // Stats
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalReactions: 0,
    totalComments: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const posts = Storage.getOwnedPosts();
    const activeDrafts = Storage.getDrafts();
    setOwnedPosts(posts);
    setDrafts(activeDrafts);

    // Calculate Stats
    let viewsCount = 0;
    let reactionsCount = 0;
    let commentsCount = 0;

    posts.forEach(post => {
      viewsCount += post.views || 0;
      commentsCount += post.comments?.length || 0;
      reactionsCount += Object.values(post.reactions || {}).reduce((sum, v) => sum + v, 0);
    });

    setStats({
      totalPosts: posts.length,
      totalViews: viewsCount,
      totalReactions: reactionsCount,
      totalComments: commentsCount
    });
  };

  // Claim post flow
  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!claimPasscode.trim()) {
      showToast('Passcode is required', 'error');
      return;
    }

    const res = Storage.claimPost(claimPasscode.trim());
    if (res.success) {
      showToast(`Successfully claimed: "${res.post.title}"`, 'success');
      setClaimPasscode('');
      loadDashboardData();
      setActiveTab('posts');
    } else {
      showToast(res.error || 'Failed to claim post', 'error');
    }
  };

  // Draft resume
  const handleResumeDraft = (draft) => {
    // Direct create page prefill using location.state
    navigate('/create', {
      state: {
        prefillTitle: draft.title,
        prefillCategory: draft.category,
        prefillContent: draft.content
      }
    });
  };

  // Draft discard
  const handleDiscardDraft = (draftId) => {
    if (window.confirm('Are you sure you want to discard this draft?')) {
      Storage.deleteDraft(draftId);
      showToast('Draft discarded', 'info');
      loadDashboardData();
    }
  };

  // Delete published post direct from Dashboard
  const handleDeletePost = (post) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${post.title}"? This cannot be undone.`);
    if (confirmDelete) {
      const res = Storage.deletePost(post.id, post.passcode);
      if (res.success) {
        showToast('Scribe deleted', 'success');
        loadDashboardData();
      } else {
        showToast(res.error || 'Failed to delete post', 'error');
      }
    }
  };

  // SVG Chart path calculation
  const generateChartPath = () => {
    // Generate simulated points that change slightly depending on total view count
    const basePoints = [35, 45, 20, 65, 50, 75, 80]; // simulated percentages
    const scalingFactor = Math.min(stats.totalViews, 100) / 100;
    
    const points = basePoints.map(p => {
      const offset = (Math.random() - 0.5) * 10 * scalingFactor;
      return Math.min(95, Math.max(5, p + offset));
    });

    // Convert coordinates to SVG path (width: 500, height: 120)
    // Points count: 7 days
    const xStep = 500 / 6;
    let path = `M 0 ${120 - (points[0] * 120 / 100)}`;
    for (let i = 1; i < 7; i++) {
      const x = i * xStep;
      const y = 120 - (points[i] * 120 / 100);
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-3 cursor-pointer"
          >
            <FaChevronLeft />
            <span>Go to Home</span>
          </button>
          <h1 className="font-outfit text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <MdSpaceDashboard className="text-indigo-600" />
            <span>My Scribe Hub</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">Analyze your post metrics, reclaim ownership keys, and manage pending drafts.</p>
        </div>

        <button
          onClick={() => navigate('/create')}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
        >
          <FaPen className="text-xs" />
          <span>Write New Scribe</span>
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Published Scribes</span>
            <span className="block font-outfit text-3xl font-extrabold text-slate-800 mt-1">{stats.totalPosts}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
            <FaBookOpen />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Views</span>
            <span className="block font-outfit text-3xl font-extrabold text-slate-800 mt-1">{stats.totalViews}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-lg">
            <FaRegEye />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reactions Recieved</span>
            <span className="block font-outfit text-3xl font-extrabold text-slate-800 mt-1">{stats.totalReactions}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-lg">
            <span>❤️</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Comments</span>
            <span className="block font-outfit text-3xl font-extrabold text-slate-800 mt-1">{stats.totalComments}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
            <FaRegComments />
          </div>
        </div>

      </div>

      {/* Analytics Graph & Claims Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Custom SVG Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-outfit text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                <MdTrendingUp className="text-emerald-500 text-lg" />
                <span>Visitor Traffic (7 Days)</span>
              </h3>
              <p className="text-slate-400 text-xs font-semibold">Simulated daily active reading metric across your owned stories.</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1">
              +14.2% Growth
            </span>
          </div>

          {/* Chart SVG */}
          <div className="relative w-full h-32 mt-2">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 500 120" 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00"/>
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" />

              {/* Area path */}
              <path 
                d={`${generateChartPath()} L 500 120 L 0 120 Z`}
                fill="url(#chartGradient)"
              />

              {/* Line path */}
              <path 
                d={generateChartPath()}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Chart X axis */}
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-3 border-t border-slate-50 pt-2 px-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Claim / Reclaim Ownership Panel */}
        <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-outfit text-lg font-bold text-white mb-1 flex items-center gap-2">
              <FaKey className="text-indigo-400 text-sm" />
              <span>Import Post Authorship</span>
            </h3>
            <p className="text-xs text-slate-300 font-semibold leading-relaxed">
              If you published a post on another browser or device, enter its private 6-digit key below to claim authorship. This claims stats tracking and editing privileges.
            </p>
          </div>

          <form onSubmit={handleClaimSubmit} className="space-y-3 mt-6">
            <input
              type="text"
              placeholder="Post Passcode (e.g. ink-7ac3f9)"
              value={claimPasscode}
              onChange={(e) => setClaimPasscode(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 text-xs font-mono font-bold tracking-widest focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="w-full py-3 bg-white hover:bg-slate-100 text-indigo-950 font-extrabold text-xs rounded-xl shadow-sm cursor-pointer transition-all"
            >
              Claim Authorship
            </button>
          </form>
        </div>

      </div>

      {/* Tabs list */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Navigation Tabs Header */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'posts'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            My Published Scribes ({ownedPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-6 py-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'drafts'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Local Drafts ({drafts.length})
          </button>
        </div>

        {/* Tab 1 content: Posts list */}
        {activeTab === 'posts' && (
          <div className="p-6">
            {ownedPosts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Post details</th>
                      <th className="pb-3 font-semibold">Passcode Key</th>
                      <th className="pb-3 font-semibold">Metrics</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ownedPosts.map((post) => {
                      const totalReactions = Object.values(post.reactions || {}).reduce((sum, v) => sum + v, 0);

                      return (
                        <tr key={post.id} className="group text-sm">
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <img src={post.image} alt={post.title} className="w-10 h-10 rounded-lg object-cover" />
                              <div>
                                <span className="text-xs font-bold text-indigo-600 block">{post.category}</span>
                                <span className="font-bold text-slate-800 line-clamp-1 max-w-sm">{post.title}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 font-mono font-bold text-xs rounded-lg border border-slate-200">
                              {post.passcode}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                              <span className="flex items-center gap-1">
                                <FaRegEye className="text-slate-400" />
                                <span>{post.views || 0}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <span>❤️</span>
                                <span>{totalReactions}</span>
                              </span>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => navigate(`/post/${post.id}`)}
                                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                                title="Read"
                              >
                                <FaChevronRight className="text-xs" />
                              </button>
                              <button
                                onClick={() => {
                                  // Nav to edit
                                  navigate(`/post/${post.id}`);
                                  setTimeout(() => {
                                    // Trigger custom modal click edit flow
                                    showToast('Scroll to top and click Edit to begin editing', 'info');
                                  }, 500);
                                }}
                                className="p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-600 transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <FaEdit className="text-xs" />
                              </button>
                              <button
                                onClick={() => handleDeletePost(post)}
                                className="p-2 bg-rose-50 hover:bg-rose-100 rounded-lg text-rose-600 transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <FaTrashAlt className="text-xs" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 font-medium">
                You haven't written any posts from this browser. Start writing today!
              </div>
            )}
          </div>
        )}

        {/* Tab 2 content: Drafts list */}
        {activeTab === 'drafts' && (
          <div className="p-6">
            {drafts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drafts.map((draft) => (
                  <div 
                    key={draft.id}
                    className="p-5 bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">{draft.category || 'Draft'}</span>
                        <span className="flex items-center gap-1">
                          <FaClock className="text-[10px]" />
                          <span>Updated {new Date(draft.updatedAt).toLocaleDateString()}</span>
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{draft.title || 'Untitled Draft'}</h4>
                      <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {draft.content || 'Draft content empty...'}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-200/60 flex items-center justify-between">
                      <button
                        onClick={() => handleDiscardDraft(draft.id)}
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
                      >
                        Discard
                      </button>
                      
                      <button
                        onClick={() => handleResumeDraft(draft)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                      >
                        <span>Resume Scribe</span>
                        <FaChevronRight className="text-[9px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 font-medium">
                No active drafts in progress.
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;
