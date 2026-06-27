import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserSecret, FaKey, FaChartBar, FaRegComments, FaArrowRight, FaPenNib } from 'react-icons/fa';
import { Storage } from '../utils/storage';

const Home = () => {
  const navigate = useNavigate();
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    // Fetch posts and sort by popularity (views + sum of reactions)
    const posts = Storage.getPosts();
    const sorted = [...posts]
      .sort((a, b) => {
        const scoreA = (a.views || 0) + Object.values(a.reactions || {}).reduce((sum, v) => sum + v, 0);
        const scoreB = (b.views || 0) + Object.values(b.reactions || {}).reduce((sum, v) => sum + v, 0);
        return scoreB - scoreA;
      })
      .slice(0, 3); // Get top 3
    setTrendingPosts(sorted);
  }, []);

  const prompts = [
    {
      title: "The Production Mistake",
      text: "Write about a time you accidentally broke production. What happened and how did you resolve it?",
      category: "Confessions"
    },
    {
      title: "The Dev Rant",
      text: "What is your most controversial opinion about a framework, library, or engineering practice?",
      category: "Tech Rants"
    },
    {
      title: "The Indie Goal",
      text: "If you had 30 days and $5,000 to launch any software product, what would it be and why?",
      category: "Ideas"
    }
  ];

  const handlePromptClick = (prompt) => {
    // Navigate to create page with pre-filled title and category
    navigate('/create', {
      state: {
        prefillTitle: `Draft: ${prompt.title} - `,
        prefillCategory: prompt.category,
        prefillContent: `> Prompt: ${prompt.text}\n\nType your story here...`
      }
    });
  };

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(#e2e8f5_1px,transparent_1px)] [background-size:24px_24px] bg-[#fafbfc]">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 animate-pulse">
          <FaUserSecret />
          <span>100% Pseudonymous & Private</span>
        </div>
        
        <h1 className="font-outfit text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Express Yourself. <br />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
            Completely Anonymously.
          </span>
        </h1>
        
        <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-slate-600 font-medium leading-relaxed">
          Share your deepest software engineering rants, raw life confessions, startup hacks, or quiet ideas. No signups, no trackers. Retain ultimate control with dynamic post passcodes.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/posts"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>Explore Whispers</span>
            <FaArrowRight className="text-sm" />
          </Link>
          <Link
            to="/create"
            className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-indigo-600 text-slate-700 hover:text-indigo-600 font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FaPenNib className="text-sm" />
            <span>Write Scribe</span>
          </Link>
        </div>

        {/* Floating Quick Stats */}
        <div className="mt-16 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
          <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 shadow-sm">
            <span className="block font-outfit text-3xl font-bold text-slate-800">10k+</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weekly Views</span>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 shadow-sm">
            <span className="block font-outfit text-3xl font-bold text-slate-800">100%</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Encryption Ready</span>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 shadow-sm">
            <span className="block font-outfit text-3xl font-bold text-slate-800">0</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Signups</span>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 shadow-sm">
            <span className="block font-outfit text-3xl font-bold text-slate-800">100+</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daily Prompts</span>
          </div>
        </div>
      </section>

      {/* Feature Pillar Section */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-outfit text-3xl font-extrabold text-slate-900">How Inkognito Empowers Anonymity</h2>
            <p className="mt-3 text-slate-500 font-medium">Built with mechanisms that guarantee ownership control while avoiding personal database footprints.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <FaUserSecret className="text-2xl" />
              </div>
              <h3 className="font-outfit text-xl font-bold text-slate-800">Dynamic Alias Badging</h3>
              <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">
                Generate funny, mysterious, or serious pseudonymous identities using our integrated generator. Choose completely invisible or a randomized emoji persona.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <FaKey className="text-xl" />
              </div>
              <h3 className="font-outfit text-xl font-bold text-slate-800">6-Digit Key Control</h3>
              <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">
                No accounts needed. Every post creates a private 6-digit passcode. Store it locally or input it manually on other devices to edit, delete, or claim post statistics.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <FaChartBar className="text-xl" />
              </div>
              <h3 className="font-outfit text-xl font-bold text-slate-800">Personal Insights Hub</h3>
              <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">
                Your browser automatically tracks post views, comment threads, and emoji reactions. Monitor your content reach through simulated interactive charts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Writing Prompts Panel */}
      <section className="py-16 bg-[#fafbfc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
            <div>
              <h2 className="font-outfit text-3xl font-extrabold text-slate-900">Feeling Inspired?</h2>
              <p className="mt-2 text-slate-500 font-medium">Click on any hot topic prompt to launch into the editor immediately.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {prompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(prompt)}
                className="text-left p-6 rounded-2xl border border-slate-100 bg-white hover:border-indigo-500/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer group"
              >
                <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold mb-4 self-start">
                  {prompt.category}
                </span>
                <h3 className="font-outfit text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {prompt.title}
                </h3>
                <p className="mt-3 text-xs text-slate-500 font-medium leading-relaxed flex-grow">
                  {prompt.text}
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:gap-2.5 transition-all">
                  <span>Draft this scribe</span>
                  <FaArrowRight className="text-[10px]" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Popular Posts Feed */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-outfit text-3xl font-extrabold text-slate-900">Trending Whispers</h2>
            <p className="mt-2 text-slate-500 font-medium">The most widely viewed and discussed anonymous notes in the network.</p>
          </div>

          {trendingPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trendingPosts.map((post) => {
                // Sum reactions
                const totalReactions = Object.values(post.reactions || {}).reduce((a, b) => a + b, 0);
                const commentCount = post.comments?.length || 0;

                return (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="flex flex-col h-full rounded-2xl border border-slate-100 bg-[#fafbfc] overflow-hidden hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-xs font-semibold text-indigo-700 shadow-sm">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-3">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">{post.author}</span>
                        <span>{new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>

                      <h3 className="font-outfit text-xl font-bold text-slate-800 leading-snug line-clamp-2 hover:text-indigo-600 transition-colors">
                        {post.title}
                      </h3>

                      <p className="mt-3 text-sm text-slate-500 line-clamp-3 leading-relaxed flex-grow">
                        {post.summary}
                      </p>

                      <div className="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between text-xs font-semibold text-slate-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5">
                            <span className="text-base text-rose-400">❤️</span>
                            <span>{totalReactions}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FaRegComments className="text-indigo-400 text-sm" />
                            <span>{commentCount}</span>
                          </span>
                        </div>
                        <span className="text-indigo-600 flex items-center gap-1 group-hover:underline">
                          Read Full
                          <FaArrowRight className="text-[9px]" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <p className="text-slate-500 font-medium">No trending posts found. Write the first scribe!</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/posts"
              className="inline-flex items-center gap-1.5 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-md shadow-slate-100 hover:bg-slate-800 transition-all duration-200"
            >
              <span>Browse All Scribes</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
