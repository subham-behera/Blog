import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { Storage } from '../utils/storage';
import { FaEye, FaRegEye, FaImage, FaMarkdown, FaKey, FaChevronLeft, FaTimes } from 'react-icons/fa';
import { FaShuffle } from 'react-icons/fa6';
import { FiBold, FiItalic, FiList, FiCode, FiLink, FiCpu } from 'react-icons/fi';

const ADJECTIVES = ['Silent', 'Cryptic', 'Phantom', 'Nomad', 'Mystic', 'Hidden', 'Clever', 'Enigmatic', 'Cosmic', 'Wandering', 'Pragmatic'];
const NOUNS = ['Coder', 'Scribe', 'Fox', 'Owl', 'Byte', 'Hacker', 'Ghost', 'Sage', 'Mind', 'Pixels', 'Voyager'];
const EMOJIS = ['🦊', '🦉', '👤', '🚀', '💡', '🪐', '👾', '🎨', '🛡️', '🧬', '☕'];

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80'
];

const CATEGORIES = ['Tech Rants', 'Confessions', 'Deep Thoughts', 'Ideas', 'Whispers', 'Creative Writing'];

const Create = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const textareaRef = useRef(null);

  // States
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_IMAGES[0]);
  const [customImage, setCustomImage] = useState('');
  
  // Author & Alias state
  const [aliasType, setAliasType] = useState('shuffle'); // 'shuffle', 'pure-anon', 'custom'
  const [shuffledAlias, setShuffledAlias] = useState('');
  const [customAlias, setCustomAlias] = useState('');

  // Editor states
  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'
  const [draftId, setDraftId] = useState(null);

  // Modal State
  const [passcodeModal, setPasscodeModal] = useState({
    isOpen: false,
    passcode: '',
    postId: ''
  });

  // Prefill from Home prompts
  useEffect(() => {
    if (location.state) {
      if (location.state.prefillTitle) setTitle(location.state.prefillTitle);
      if (location.state.prefillCategory) setCategory(location.state.prefillCategory);
      if (location.state.prefillContent) setContent(location.state.prefillContent);
      // Clean location state to avoid repeating on refresh
      window.history.replaceState({}, document.title);
    }
    generateAlias();
  }, [location]);

  // Generate random alias
  const generateAlias = () => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    setShuffledAlias(`${adj} ${noun} ${emoji}`);
  };

  // Auto-save drafts
  useEffect(() => {
    if (!title && !content) return; // Don't save empty drafts

    const timer = setTimeout(() => {
      const savedId = Storage.saveDraft({
        id: draftId,
        title,
        summary,
        content,
        category,
        tags,
        image: customImage || coverImage,
        author: getAuthorName()
      });
      if (savedId && !draftId) {
        setDraftId(savedId);
        showToast('Draft auto-saved', 'info');
      }
    }, 1500); // Debounce save every 1.5s

    return () => clearTimeout(timer);
  }, [title, summary, content, category, tags, coverImage, customImage, aliasType, shuffledAlias, customAlias]);

  const getAuthorName = () => {
    if (aliasType === 'pure-anon') return 'Anonymous 👤';
    if (aliasType === 'custom') return customAlias.trim() ? `${customAlias.trim()} 👤` : 'Anonymous 👤';
    return shuffledAlias || 'Anonymous 👤';
  };

  // Markdown tool handler
  const insertMarkdown = (syntaxBefore, syntaxAfter = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const replacement = syntaxBefore + selectedText + syntaxAfter;
    setContent(text.substring(0, start) + replacement + text.substring(end));

    // Refocus and select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + syntaxBefore.length, start + syntaxBefore.length + selectedText.length);
    }, 0);
  };

  // Convert content to HTML for preview (simple regex parser)
  const parseMarkdown = (md) => {
    if (!md) return '<p class="text-slate-400 italic">Nothing to preview yet. Start typing!</p>';

    let html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-slate-800 mt-4 mb-2 font-outfit">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-slate-800 mt-5 mb-2 font-outfit">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-slate-800 mt-6 mb-3 font-outfit">$1</h1>');

    // Code Blocks
    html = html.replace(/```([\s\S]*?)```/gm, '<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto my-4">$1</pre>');
    
    // Inline Code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>');

    // Bold & Italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-700">$1</em>');

    // Blockquotes (multiline)
    html = html.replace(/^\s*&gt;\s+(.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-1 my-3 bg-slate-50 italic text-slate-600 rounded-r-lg">$1</blockquote>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 font-semibold hover:underline">$1</a>');

    // Bullet Lists
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="list-disc list-inside ml-4 py-0.5 text-slate-600">$1</li>');

    // Paragraph splits
    return html.split('\n').map(line => {
      if (line.trim().startsWith('<h') || line.trim().startsWith('<pre') || line.trim().startsWith('<block') || line.trim().startsWith('<li') || line.trim() === '') {
        return line;
      }
      return `<p class="mb-3 leading-relaxed text-slate-600">${line}</p>`;
    }).join('\n');
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('Title and content are required', 'error');
      return;
    }

    const tagsArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '');

    const finalImage = customImage.trim() || coverImage;

    const result = Storage.createPost({
      title: title.trim(),
      summary: summary.trim() || content.substring(0, 160) + '...',
      content: content.trim(),
      author: getAuthorName(),
      category,
      tags: tagsArray,
      image: finalImage
    });

    if (result) {
      showToast('Scribe published successfully!', 'success');
      
      // Delete draft
      if (draftId) {
        Storage.deleteDraft(draftId);
      }

      // Open Passcode modal
      setPasscodeModal({
        isOpen: true,
        passcode: result.passcode,
        postId: result.post.id
      });
    } else {
      showToast('Failed to publish scribe', 'error');
    }
  };

  const handleCopyPasscode = () => {
    navigator.clipboard.writeText(passcodeModal.passcode);
    showToast('Passcode copied to clipboard!', 'success');
  };

  const handleModalClose = () => {
    setPasscodeModal({ isOpen: false, passcode: '', postId: '' });
    navigate(`/post/${passcodeModal.postId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-3 cursor-pointer"
          >
            <FaChevronLeft />
            <span>Go Back</span>
          </button>
          <h1 className="font-outfit text-3xl font-extrabold text-slate-900">Create a New Whisper</h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">Draft your anonymous thoughts and control them with keys.</p>
        </div>
      </div>

      <form onSubmit={handlePublish} className="space-y-8">
        
        {/* Core Info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Category */}
            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Tags (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g., career, javascript, coding, secrets"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Title</label>
            <input
              type="text"
              placeholder="Give your whisper a catchy or cryptic title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-base font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Summary / Subtitle */}
          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Short Summary</label>
            <input
              type="text"
              placeholder="Write a brief teaser for the feed page (1-2 sentences)..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Alias Identity Badge Generator */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">Choose Your Pseudonym</label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Shuffled Alias */}
            <button
              type="button"
              onClick={() => { setAliasType('shuffle'); generateAlias(); }}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                aliasType === 'shuffle'
                  ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-500'
                  : 'border-slate-150 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shuffle Badge</span>
                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${aliasType === 'shuffle' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                  {aliasType === 'shuffle' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">{shuffledAlias}</span>
                <div className="p-1.5 rounded-lg bg-indigo-100/60 text-indigo-600 hover:bg-indigo-100 hover:scale-105 transition-all">
                  <FaShuffle className="text-xs" />
                </div>
              </div>
            </button>

            {/* Completely Invisible */}
            <button
              type="button"
              onClick={() => setAliasType('pure-anon')}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                aliasType === 'pure-anon'
                  ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-500'
                  : 'border-slate-150 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invisible</span>
                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${aliasType === 'pure-anon' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                  {aliasType === 'pure-anon' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <span className="mt-4 font-bold text-slate-800 text-sm">Anonymous 👤</span>
            </button>

            {/* Custom Pseudonym */}
            <div
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                aliasType === 'custom'
                  ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-500'
                  : 'border-slate-150 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <button
                type="button"
                onClick={() => setAliasType('custom')}
                className="flex items-center justify-between w-full text-left cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Custom Handle</span>
                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${aliasType === 'custom' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                  {aliasType === 'custom' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </button>
              <input
                type="text"
                disabled={aliasType !== 'custom'}
                placeholder="Enter custom pen-name..."
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="mt-2 w-full px-3 py-1.5 bg-white border border-slate-250 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
              />
            </div>

          </div>
        </div>

        {/* Artwork selector */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Cover Artwork</label>
            <p className="text-slate-400 text-xs font-medium mb-3">Choose a preset banner or input a custom link.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PRESET_IMAGES.map((imgUrl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setCoverImage(imgUrl); setCustomImage(''); }}
                className={`relative h-16 rounded-xl overflow-hidden border-2 cursor-pointer ${
                  coverImage === imgUrl && !customImage ? 'border-indigo-600 scale-105 shadow-md shadow-indigo-50' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt="Preset card" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="pt-2">
            <input
              type="url"
              placeholder="Paste a custom Unsplash/Pixabay cover image URL..."
              value={customImage}
              onChange={(e) => { setCustomImage(e.target.value); setCoverImage(''); }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Markdown Editor Workspace */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          
          {/* Editor Tabs Header */}
          <div className="flex justify-between items-center bg-slate-50 px-4 py-2.5 border-b border-slate-100">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'write' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Write Scribe
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="flex items-center gap-1">
                  <FaEye />
                  Preview
                </span>
              </button>
            </div>
            
            <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
              <FaMarkdown className="text-sm" />
              <span className="hidden sm:inline">Markdown Supported</span>
            </div>
          </div>

          {/* Editor Workspace Content */}
          {activeTab === 'write' ? (
            <div className="flex flex-col">
              
              {/* Toolbar */}
              <div className="flex items-center flex-wrap gap-1 bg-slate-50/50 px-4 py-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => insertMarkdown('**', '**')}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Bold Text"
                >
                  <FiBold />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('*', '*')}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Italic Text"
                >
                  <FiItalic />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('### ')}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer font-bold text-xs"
                  title="Heading"
                >
                  H3
                </button>
                <div className="w-px h-5 bg-slate-200 mx-1" />
                <button
                  type="button"
                  onClick={() => insertMarkdown('> ')}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer font-serif font-bold text-sm"
                  title="Blockquote"
                >
                  “
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('`', '`')}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Inline Code"
                >
                  <FiCode />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('```\n', '\n```')}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-xs font-mono font-bold"
                  title="Code Block"
                >
                  {"{ }"}
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('[', '](url)')}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Add Link"
                >
                  <FiLink />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('- ')}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Bullet List"
                >
                  <FiList />
                </button>
              </div>

              {/* Text Input Area */}
              <textarea
                ref={textareaRef}
                rows="12"
                placeholder="Write your story using markdown..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full p-6 bg-white border-0 text-slate-700 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-0 leading-relaxed font-sans"
              />
            </div>
          ) : (
            <div 
              className="p-6 min-h-[300px] max-h-[500px] overflow-y-auto bg-slate-50/30 prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
            />
          )}
        </div>

        {/* Publish CTA */}
        <div className="text-right">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FaRegEye className="text-base" />
            <span>Publish Whisper Anonymously</span>
          </button>
        </div>

      </form>

      {/* PASSCODE MODAL */}
      {passcodeModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-100 p-6 flex flex-col items-center text-center animate-slide-in relative">
            
            <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-4">
              <FaKey />
            </div>

            <h3 className="font-outfit text-xl font-bold text-slate-900">Your Private Whisper Key</h3>
            
            <p className="text-slate-500 text-xs font-semibold leading-relaxed mt-2 max-w-sm">
              We generated a secure passcode for this post. Because there are no user accounts, you **MUST** save this key to edit or delete your post later.
            </p>

            {/* Passcode Display Box */}
            <div className="w-full mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <span className="font-mono text-xl font-bold text-slate-800 tracking-wider">
                {passcodeModal.passcode}
              </span>
              <button
                onClick={handleCopyPasscode}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Copy Key
              </button>
            </div>

            <div className="w-full grid grid-cols-1 gap-2.5 mt-6">
              <button
                onClick={handleModalClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
              >
                View Published Whisper
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default Create;
