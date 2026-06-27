import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { FaUserSecret, FaRegComments, FaRegEye, FaArrowLeft, FaShareAlt, FaFlag, FaEdit, FaTrashAlt, FaLock } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { FaShuffle } from 'react-icons/fa6';

const EMOJIS = {
  love: '❤️',
  fire: '🔥',
  mindblown: '💡',
  shocked: '😮',
  sad: '😢'
};

const COMMENT_ADJECTIVES = ['Curious', 'Mysterious', 'Logical', 'Bold', 'Observant', 'Creative', 'Quiet', 'Skeptic'];
const COMMENT_NOUNS = ['Scribe', 'Hacker', 'Reader', 'Coder', 'Thinker', 'User', 'Voyager', 'Blogger'];
const COMMENT_EMOJIS = ['🦊', '🦉', '🐱', '👾', '🛡️', '☕', '💡', '🚀'];

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Core Post State
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLikes, setUserLikes] = useState({});

  // Comment Form States
  const [commentAuthorType, setCommentAuthorType] = useState('shuffle');
  const [commentShuffledAlias, setCommentShuffledAlias] = useState('');
  const [commentCustomAlias, setCommentCustomAlias] = useState('');
  const [commentText, setCommentText] = useState('');

  // Passcode Actions Modal
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: null, // 'edit' or 'delete'
    passcode: ''
  });

  // Edit Mode state
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    tags: '',
    image: ''
  });

  useEffect(() => {
    loadPost();
    generateCommentAlias();
  }, [id]);

  const loadPost = () => {
    setLoading(true);
    const data = Storage.getPostById(id);
    if (data) {
      setPost(data);
      setUserLikes(Storage.getUserLikesForPost(id));
      
      // Seed Edit Fields
      setEditFields({
        title: data.title,
        summary: data.summary,
        content: data.content,
        category: data.category,
        tags: data.tags?.join(', ') || '',
        image: data.image
      });
    }
    setLoading(false);
  };

  const generateCommentAlias = () => {
    const adj = COMMENT_ADJECTIVES[Math.floor(Math.random() * COMMENT_ADJECTIVES.length)];
    const noun = COMMENT_NOUNS[Math.floor(Math.random() * COMMENT_NOUNS.length)];
    const emoji = COMMENT_EMOJIS[Math.floor(Math.random() * COMMENT_EMOJIS.length)];
    setCommentShuffledAlias(`${adj} ${noun} ${emoji}`);
  };

  // Reactions Engine
  const handleReact = (emojiType) => {
    const res = Storage.likePost(id, emojiType);
    if (res) {
      setPost(prev => ({
        ...prev,
        reactions: res.reactions
      }));
      setUserLikes(prev => ({
        ...prev,
        [emojiType]: res.isActive
      }));
      showToast(res.isActive ? 'Reaction added' : 'Reaction removed', 'success');
    }
  };

  // Copy shareable link
  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    showToast('Share link copied to clipboard!', 'success');
  };

  // Report Flow
  const handleReport = () => {
    const confirmReport = window.confirm('Are you sure you want to flag this post? Content with too many flags will be reviewed.');
    if (confirmReport) {
      Storage.reportPost(id);
      showToast('Post reported for moderation review', 'warning');
      setTimeout(() => {
        navigate('/posts');
      }, 1000);
    }
  };

  // Pre-authorisation check
  const openActionModal = (type) => {
    const ownedIds = Storage.getOwnedPostIds();
    let prefilledPasscode = '';
    
    // Auto check if we own the post in this browser history
    if (ownedIds.includes(id) && post) {
      prefilledPasscode = post.passcode || '';
      showToast('Key retrieved from browser memory', 'info');
    }

    setActionModal({
      isOpen: true,
      type,
      passcode: prefilledPasscode
    });
  };

  const handleActionModalSubmit = (e) => {
    e.preventDefault();
    const { type, passcode } = actionModal;

    if (!passcode.trim()) {
      showToast('Passcode is required', 'error');
      return;
    }

    if (type === 'delete') {
      const confirmDelete = window.confirm('Are you absolutely sure you want to delete this whisper? This cannot be undone.');
      if (confirmDelete) {
        const res = Storage.deletePost(id, passcode);
        if (res.success) {
          showToast('Scribe deleted successfully', 'success');
          setActionModal({ isOpen: false, type: null, passcode: '' });
          navigate('/posts');
        } else {
          showToast(res.error || 'Failed to delete post', 'error');
        }
      }
    } else if (type === 'edit') {
      if (passcode === post.passcode) {
        setEditMode(true);
        setActionModal({ isOpen: false, type: null, passcode: '' });
        showToast('Editor unlocked', 'success');
      } else {
        showToast('Invalid post passcode', 'error');
      }
    }
  };

  const handleUpdatePost = (e) => {
    e.preventDefault();
    const tagsArray = editFields.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '');

    const res = Storage.updatePost(id, post.passcode, {
      title: editFields.title,
      summary: editFields.summary,
      content: editFields.content,
      category: editFields.category,
      tags: tagsArray,
      image: editFields.image
    });

    if (res.success) {
      showToast('Whisper updated successfully', 'success');
      setEditMode(false);
      loadPost(); // Reload updated content
    } else {
      showToast(res.error || 'Failed to update post', 'error');
    }
  };

  // Comments Submission
  const getCommentAuthorName = () => {
    if (commentAuthorType === 'pure-anon') return 'Anonymous 👤';
    if (commentAuthorType === 'custom') return commentCustomAlias.trim() ? `${commentCustomAlias.trim()} 👤` : 'Anonymous 👤';
    return commentShuffledAlias || 'Anonymous 👤';
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      showToast('Comment body cannot be empty', 'error');
      return;
    }

    const newComment = Storage.addComment(id, {
      content: commentText.trim(),
      author: getCommentAuthorName()
    });

    if (newComment) {
      setPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment]
      }));
      setCommentText('');
      generateCommentAlias();
      showToast('Comment posted anonymously', 'success');
    }
  };

  // Markdown Parser
  const parseMarkdown = (md) => {
    if (!md) return '';

    let html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-slate-800 mt-6 mb-3 font-outfit">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-slate-800 mt-8 mb-4 font-outfit">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold text-slate-900 mt-10 mb-4 font-outfit">$1</h1>');

    // Code Blocks
    html = html.replace(/```([\s\S]*?)```/gm, '<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto my-5">$1</pre>');
    
    // Inline Code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-rose-600 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>');

    // Bold & Italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-700">$1</em>');

    // Blockquotes
    html = html.replace(/^\s*&gt;\s+(.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-2 my-4 bg-slate-50 italic text-slate-600 rounded-r-lg">$1</blockquote>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 font-semibold hover:underline">$1</a>');

    // Bullet Lists
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="list-disc list-inside ml-4 py-0.5 text-slate-600">$1</li>');

    // Paragraph splits
    return html.split('\n').map(line => {
      if (line.trim().startsWith('<h') || line.trim().startsWith('<pre') || line.trim().startsWith('<block') || line.trim().startsWith('<li') || line.trim() === '') {
        return line;
      }
      return `<p class="mb-4 leading-relaxed text-slate-700 text-base">${line}</p>`;
    }).join('\n');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600 mx-auto" />
        <p className="mt-4 text-slate-500 font-semibold">Reading the whispers...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <span className="text-5xl">👻</span>
        <h2 className="mt-4 font-outfit text-2xl font-bold text-slate-800">Whisper Vanished</h2>
        <p className="mt-2 text-slate-500 font-medium">This post does not exist or has been flagged for removal.</p>
        <button
          onClick={() => navigate('/posts')}
          className="mt-6 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow cursor-pointer"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back navigation */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/posts')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <FaArrowLeft />
          <span>Back to Feed</span>
        </button>

        {/* Top Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Share"
          >
            <FaShareAlt className="text-sm" />
          </button>
          <button
            onClick={handleReport}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Flag Content"
          >
            <FaFlag className="text-xs" />
          </button>

          {!editMode && (
            <>
              <button
                onClick={() => openActionModal('edit')}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                title="Edit Post"
              >
                <FaEdit className="text-sm" />
              </button>
              <button
                onClick={() => openActionModal('delete')}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                title="Delete Post"
              >
                <FaTrashAlt className="text-xs" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* EDITING WORKSPACE PANEL */}
      {editMode ? (
        <form onSubmit={handleUpdatePost} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
          <h2 className="font-outfit text-xl font-bold text-slate-800">Edit Anonymous Post</h2>
          
          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Title</label>
            <input
              type="text"
              value={editFields.title}
              onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Summary</label>
            <input
              type="text"
              value={editFields.summary}
              onChange={(e) => setEditFields({ ...editFields, summary: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Content (Markdown)</label>
            <textarea
              rows="10"
              value={editFields.content}
              onChange={(e) => setEditFields({ ...editFields, content: e.target.value })}
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Category</label>
              <select
                value={editFields.category}
                onChange={(e) => setEditFields({ ...editFields, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold"
              >
                {['Tech Rants', 'Confessions', 'Deep Thoughts', 'Ideas', 'Whispers', 'Creative Writing'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Tags</label>
              <input
                type="text"
                value={editFields.tags}
                onChange={(e) => setEditFields({ ...editFields, tags: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-750 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        /* READ POST WORKSPACE */
        <article className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          
          {/* Cover Art */}
          <div className="h-64 sm:h-80 w-full overflow-hidden bg-slate-100">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Heading */}
          <div className="p-6 sm:p-10 pb-4">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg mb-4">
              {post.category}
            </span>
            <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {post.title}
            </h1>

            {/* Author bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pb-6 border-b border-slate-100 text-xs font-semibold text-slate-400">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 font-bold">{post.author}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span>{new Date(post.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <FaRegEye className="text-sm" />
                  <span>{post.views || 0} Views</span>
                </span>
                <span className="flex items-center gap-1">
                  <FaRegComments className="text-sm" />
                  <span>{post.comments?.length || 0} Comments</span>
                </span>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div 
            className="px-6 sm:px-10 pb-8 prose prose-slate max-w-none text-slate-700 leading-relaxed font-sans"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
          />

          {/* Tags cloud */}
          {post.tags && post.tags.length > 0 && (
            <div className="px-6 sm:px-10 pb-8 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg text-xs font-bold">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* EMOJI REACTIONS SECTION */}
          <div className="bg-slate-50/50 border-t border-slate-100 p-6 sm:px-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">React to this Whisper:</span>
            
            <div className="flex flex-wrap gap-2">
              {Object.entries(EMOJIS).map(([type, symbol]) => {
                const count = post.reactions?.[type] || 0;
                const isSelected = userLikes[type];

                return (
                  <button
                    key={type}
                    onClick={() => handleReact(type)}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-bold flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                        : 'bg-white text-slate-600 border-slate-150 hover:bg-slate-50'
                    }`}
                  >
                    <span>{symbol}</span>
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </article>
      )}

      {/* COMMENTS AREA */}
      {!editMode && (
        <div className="mt-10 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10 space-y-8">
          
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-outfit text-xl font-extrabold text-slate-800">Comments ({post.comments?.length || 0})</h3>
            <p className="text-slate-400 text-xs font-semibold mt-1">Join the anonymous discussion. Standard rules of respect apply.</p>
          </div>

          {/* Leave a comment form */}
          <form onSubmit={handleAddComment} className="space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              
              {/* Alias Shuffle for Commenter */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setCommentAuthorType('shuffle')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    commentAuthorType === 'shuffle' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  <span>Use Alias: {commentShuffledAlias}</span>
                  <FaShuffle className="text-[10px]" onClick={(e) => { e.stopPropagation(); generateCommentAlias(); }} />
                </button>

                <button
                  type="button"
                  onClick={() => setCommentAuthorType('pure-anon')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    commentAuthorType === 'pure-anon' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Invisible Anon
                </button>

                <button
                  type="button"
                  onClick={() => setCommentAuthorType('custom')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    commentAuthorType === 'custom' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  Custom
                </button>
              </div>

              {commentAuthorType === 'custom' && (
                <input
                  type="text"
                  placeholder="Your nickname..."
                  value={commentCustomAlias}
                  onChange={(e) => setCommentCustomAlias(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              )}
            </div>

            <div className="relative">
              <textarea
                rows="3"
                placeholder="Share your thoughts anonymously..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-12"
              />
              <button
                type="submit"
                className="absolute bottom-4 right-4 p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <FiSend className="text-sm" />
              </button>
            </div>

          </form>

          {/* List of comments */}
          <div className="space-y-4 pt-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100 flex flex-col space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-slate-200/70 text-slate-700 font-bold px-2 py-0.5 rounded">{comment.author}</span>
                    <span className="text-slate-400 font-medium">{new Date(comment.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 font-medium text-sm">
                No comments yet. Start the conversation!
              </div>
            )}
          </div>

        </div>
      )}

      {/* PASSCODE / ACTION VERIFICATION MODAL */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <form 
            onSubmit={handleActionModalSubmit} 
            className="bg-white max-w-sm w-full rounded-2xl shadow-2xl border border-slate-100 p-6 flex flex-col items-center text-center animate-slide-in relative"
          >
            
            <button
              type="button"
              onClick={() => setActionModal({ isOpen: false, type: null, passcode: '' })}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FaTimes className="text-sm" />
            </button>

            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mb-4">
              <FaLock />
            </div>

            <h3 className="font-outfit text-lg font-bold text-slate-900">Unlock Whisper Actions</h3>
            
            <p className="text-slate-500 text-xs font-semibold leading-relaxed mt-2 max-w-sm">
              Please enter the 6-digit passcode for this post to authorize the {actionModal.type === 'delete' ? 'deletion' : 'editing'}.
            </p>

            <input
              type="text"
              placeholder="e.g. ink-24a91c"
              value={actionModal.passcode}
              onChange={(e) => setActionModal({ ...actionModal, passcode: e.target.value })}
              required
              className="w-full text-center mt-5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-lg font-bold placeholder-slate-300 tracking-widest focus:outline-none"
            />

            <button
              type="submit"
              className={`w-full mt-6 py-3 text-white font-bold text-sm rounded-xl transition-all cursor-pointer ${
                actionModal.type === 'delete' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              Verify & Proceed
            </button>
            
          </form>
        </div>
      )}

    </div>
  );
};

export default PostDetail;
