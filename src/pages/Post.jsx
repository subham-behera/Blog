import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Storage } from '../utils/storage';
import { FaSearch, FaRegComments, FaRegEye, FaArrowRight } from 'react-icons/fa';
import { RiFireLine, RiTimeLine, RiChatNewLine } from 'react-icons/ri';

const CATEGORIES = ['All', 'Tech Rants', 'Confessions', 'Deep Thoughts', 'Ideas', 'Whispers', 'Creative Writing'];
const POSTS_PER_PAGE = 5;

const Post = () => {
  // Feed states
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'popular', 'discussion'

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  // Load posts
  useEffect(() => {
    const data = Storage.getPosts();
    setPosts(data);
  }, []);

  // Filter and sort posts
  useEffect(() => {
    let result = [...posts];

    // Search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        post =>
          post.title.toLowerCase().includes(term) ||
          post.summary.toLowerCase().includes(term) ||
          post.author.toLowerCase().includes(term) ||
          post.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter(post => post.category === activeCategory);
    }

    // Tag filter (from sidebar tags click)
    if (selectedTag !== '') {
      result = result.filter(post => post.tags.includes(selectedTag));
    }

    // Sorting
    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => {
        const reactionsA = Object.values(a.reactions || {}).reduce((sum, v) => sum + v, 0);
        const reactionsB = Object.values(b.reactions || {}).reduce((sum, v) => sum + v, 0);
        return reactionsB - reactionsA;
      });
    } else if (sortBy === 'discussion') {
      result.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    }

    setFilteredPosts(result);
    setCurrentPage(1); // Reset page to 1 on filter/sort change
  }, [posts, searchTerm, activeCategory, selectedTag, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Extract all unique tags for the sidebar tag cloud
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags || []))
  ).slice(0, 12); // Limit to top 12 unique tags

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Category Tabs Scroll Wrapper */}
      <div className="mb-8 border-b border-slate-100 pb-2 overflow-x-auto scrollbar-none">
        <div className="flex space-x-2 min-w-max">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedTag(''); // Clear tag filter on category change
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === cat && selectedTag === ''
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-50'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main List Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            
            {/* Sorting controls */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort:</span>
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
                <button
                  onClick={() => setSortBy('recent')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    sortBy === 'recent' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <RiTimeLine />
                    Recent
                  </span>
                </button>
                <button
                  onClick={() => setSortBy('popular')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    sortBy === 'popular' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <RiFireLine />
                    Popular
                  </span>
                </button>
                <button
                  onClick={() => setSortBy('discussion')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    sortBy === 'discussion' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <RiChatNewLine />
                    Hot Chats
                  </span>
                </button>
              </div>
            </div>

            {/* Total Results */}
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {filteredPosts.length} Scribes Found
            </span>

          </div>

          {/* Active Tags Badge */}
          {selectedTag && (
            <div className="flex items-center gap-2 bg-indigo-50/50 px-4 py-2.5 rounded-xl border border-indigo-100/50 self-start">
              <span className="text-xs font-semibold text-slate-600">Showing posts tagged with:</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-xs font-bold flex items-center gap-1">
                #{selectedTag}
                <button 
                  onClick={() => setSelectedTag('')} 
                  className="hover:text-red-200 transition-colors font-bold ml-1 cursor-pointer"
                >
                  &times;
                </button>
              </span>
            </div>
          )}

          {/* Post Items */}
          {currentPosts.length > 0 ? (
            <div className="space-y-6">
              {currentPosts.map((post) => {
                const totalReactions = Object.values(post.reactions || {}).reduce((sum, v) => sum + v, 0);
                const commentCount = post.comments?.length || 0;

                return (
                  <article 
                    key={post.id}
                    className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 flex flex-col md:flex-row h-full md:h-60"
                  >
                    {/* Cover image banner */}
                    <div className="relative w-full md:w-56 h-48 md:h-full overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-xs font-semibold text-indigo-700 shadow-sm">
                        {post.category}
                      </span>
                    </div>

                    {/* Post contents detail */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">{post.author}</span>
                          <span>{new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>

                        <Link 
                          to={`/post/${post.id}`}
                          className="block group-hover:text-indigo-600 transition-colors"
                        >
                          <h3 className="font-outfit text-xl font-bold text-slate-800 leading-snug line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                          {post.summary}
                        </p>
                      </div>

                      {/* Bottom row metrics */}
                      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <span>❤️</span>
                            <span>{totalReactions}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <FaRegComments className="text-slate-400" />
                            <span>{commentCount}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <FaRegEye className="text-slate-400" />
                            <span>{post.views || 0}</span>
                          </span>
                        </div>

                        <Link
                          to={`/post/${post.id}`}
                          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:gap-1.5 transition-all"
                        >
                          <span>Read Whisper</span>
                          <FaArrowRight className="text-[9px]" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <span className="text-4xl">🔍</span>
              <h3 className="mt-4 font-outfit text-lg font-bold text-slate-800">No Whispers Found</h3>
              <p className="mt-1 text-slate-400 text-sm font-medium">Try broadening your keywords or clearing the active filters.</p>
              {(searchTerm || activeCategory !== 'All' || selectedTag) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('All');
                    setSelectedTag('');
                  }}
                  className="mt-6 px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-sm cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination Component */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              {[...Array(totalPages).keys()].map(page => (
                <button
                  key={page + 1}
                  onClick={() => setCurrentPage(page + 1)}
                  className={`w-9 h-9 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    currentPage === page + 1
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          )}

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Search Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-outfit text-base font-extrabold text-slate-800 mb-3.5">Search</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search keywords, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
            </div>
          </div>

          {/* Tag Cloud Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-outfit text-base font-extrabold text-slate-800 mb-3.5">Popular Tags</h3>
            
            {allTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(tag);
                      setActiveCategory('All'); // Priority to tag search
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs font-semibold text-slate-400">No tags available yet.</p>
            )}
          </div>

          {/* Writing Tips Card */}
          <div className="bg-gradient-to-tr from-indigo-900 to-indigo-950 rounded-2xl p-6 text-white shadow-sm">
            <h3 className="font-outfit text-base font-bold text-white mb-2">Write a Whisper</h3>
            <p className="text-xs text-slate-300 font-medium leading-relaxed mb-5">
              Have an idea you can't share on your main social profiles? Inkognito gives you a safe space to share raw code insights, industry confessions, or bootstrap strategies.
            </p>
            <Link
              to="/create"
              className="inline-flex w-full items-center justify-center gap-1.5 px-4 py-3 bg-white hover:bg-slate-50 text-indigo-950 text-sm font-extrabold rounded-xl shadow-sm transition-all"
            >
              <span>Publish a Scribe</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Post;
