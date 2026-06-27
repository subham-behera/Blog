// LocalStorage wrapper to simulate a database for the anonymous blogging platform

const STORAGE_KEYS = {
  POSTS: 'inkognito_posts',
  OWNED_POSTS: 'inkognito_owned_post_ids',
  LIKED_POSTS: 'inkognito_liked_posts', // Format: { [postId]: { [emojiType]: true } }
  DRAFTS: 'inkognito_drafts',
  REPORTS: 'inkognito_reports' // Format: [postId]
};

const DEFAULT_POSTS = [
  {
    id: "1",
    title: "The Quiet Rebellion of a Tech Lead",
    summary: "A confession on why I spend 40% of my time writing boilerplate and Googling basic syntax, and why that is actually okay.",
    content: `### The Confession

I have been a Tech Lead at a mid-sized tech company for three years now. I oversee a team of eight incredibly talented engineers. I design architectures, approve RFCs, and coordinate with product managers. 

But here is the truth that I don't tell my direct reports: **I still Google basic programming syntax at least 20 times a day.**

Just this morning, I had to look up how to format a date in Python using \`strftime\` and the correct syntax for a CSS grid column span. 

### Why We Feel Imposter Syndrome

In the industry, we have built this myth of the "Omniscient Engineer." We expect senior developers to hold entire language specifications, CLI arguments, and framework APIs in their heads. 

When we don't, we feel like frauds. We experience **Imposter Syndrome**. 

But writing code is not about memorizing syntax. It is about:
1. **Problem decomposition**: Breaking a massive system into small, digestible components.
2. **Context mapping**: Knowing *what* is possible and *where* to apply a solution.
3. **Tradeoff analysis**: Choosing between speed, scalability, and maintainability.

### The Real Boilerplate Burden

Another secret? A massive chunk of my day goes into boilerplate. Writing configurations, writing glue code, resolving dependency conflicts, and filling out Jira tickets. 

As a Tech Lead, my most valuable contributions are not the lines of code I write, but the **errors I prevent**. It's the discussions where I say: *"Wait, if we structure the database schema this way, we will run into severe locking issues in six months."*

### So, Google Away

If you are a junior developer reading this: please do not feel discouraged when you see seniors coding quickly. They are using search engines, documentation tabs, and AI assistants just like you. The difference is they know exactly what terms to search for, how to validate the answers quickly, and how to fit them into the broader architecture.

Keep searching. Keep learning. Syntax is cheap; structure is gold.`,
    author: "Enigmatic Coder 🦊",
    date: "2026-06-12T10:30:00.000Z",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    category: "Tech Rants",
    tags: ["Programming", "Career", "Mindset", "WebDev"],
    passcode: "ink-tech01",
    views: 342,
    reactions: { love: 48, fire: 82, mindblown: 114, shocked: 12, sad: 4 },
    comments: [
      {
        id: "c1",
        author: "Humble Junior 🐣",
        content: "This makes me feel so much better! I literally spent 15 minutes today searching for how to slice an array in JavaScript.",
        date: "2026-06-12T12:00:00.000Z"
      },
      {
        id: "c2",
        author: "DevOps Nomad ☁️",
        content: "Honestly, the senior devs who claim they never Google are either lying or writing very repetitive code. Great share, OP.",
        date: "2026-06-12T14:35:00.000Z"
      }
    ],
    reports: 0
  },
  {
    id: "2",
    title: "My 10-Year Confession as a Remote Software Engineer",
    summary: "I have worked multiple full-time remote developer jobs simultaneously for the past 2 years. Here is how I manage it, why I am burnt out, and the psychological cost.",
    content: `### The Setup

Two years ago, during the height of the remote work transition, I realized that my day job at a logistics firm only required about 10-15 hours of active focused work per week. The rest was slow corporate synchronization, waiting for reviews, and attending status meetings where I didn't need to speak.

So, I did what a lot of people secretly talk about: **I took a second full-time remote job.**

Six months later, I took a third contracts-based gig. 

At my peak, I was making over $380,000 a year. But I paid for it with my soul.

### The Mechanics: How I Survived

To keep this jig going, I had to develop a rigorous system:

- **Calendar Deconfliction**: I maintained three separate laptops and merged all calendars onto a private iPad using different colored markers. If two meetings conflicted, I would use one laptop for "active attendance" (camera on) and the other on mute/audio-only. If I was called on both, I'd type in chat: *"Having microphone issues, one second!"* to buy time.
- **Micro-batching tasks**: I worked in 90-minute blocks of intense hyper-focus. I wrote clean, modular code so that it passed PR reviews on the first try, saving me conversation cycles.
- **Zero Emotional Attachment**: I had to treat work purely as transactional. No watercooler chats, no extra volunteering, no going above and beyond.

### The Breakdown

By month 18, the constant paranoia of getting caught started eating me alive. 

Every Slack message notification triggered a shot of cortisol. I began having vivid nightmares about mixed-up git accounts or sending a message meant for Job A to Job B's team. My health deteriorated; I stopped exercising, lived on delivery food, and was working 12 hours a day just to maintain the illusion of being "fully present" in three places.

### The Psychological Price

Being overemployed changes how you look at work. You realize how much padding is in corporate tech, but you also lose the joy of craftsmanship. You aren't coding to build something great anymore; you are coding to escape detection.

Last month, I resigned from Job 2 and Job 3. I am back to one job now. I make less, but my resting heart rate has dropped by 15 beats per minute.

If you're thinking of doing this, know that the money is real, but the burn-out is absolute. It is a sprint, not a marathon.`,
    author: "Overemployed Shadow 👤",
    date: "2026-06-10T16:15:00.000Z",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
    category: "Confessions",
    tags: ["RemoteWork", "Careers", "MentalHealth", "Secrets"],
    passcode: "ink-conf01",
    views: 890,
    reactions: { love: 95, fire: 142, mindblown: 210, shocked: 89, sad: 34 },
    comments: [
      {
        id: "c3",
        author: "Ethical Coder 🛡️",
        content: "This is a massive conflict of interest and highly unethical. You're taking jobs away from devs looking for a single steady income.",
        date: "2026-06-10T18:00:00.000Z"
      },
      {
        id: "c4",
        author: "Grindset Warrior ⚔️",
        content: "Honestly, corporate companies exploit developers all the time. If OP delivered their tasks on time for all three jobs, they fulfilled their contract. Kudos.",
        date: "2026-06-10T19:22:00.000Z"
      },
      {
        id: "c5",
        author: "BurntOutGuy ☕",
        content: "I did two jobs for 6 months and almost had a nervous breakdown. I can't imagine doing three. Glad you got out with your sanity intact, OP.",
        date: "2026-06-11T01:10:00.000Z"
      }
    ],
    reports: 0
  },
  {
    id: "3",
    title: "Why We'll Never Reach AGI (And Why That's Good)",
    summary: "An analysis of the physical limitations of compute, data exhaustion, and the fundamental differences between pattern association and conceptual reasoning.",
    content: `### The Current Hype Cycle

Every day we see headlines claiming Artificial General Intelligence (AGI) is just 18 months away. Tech CEOs promise a world where software does 100% of human cognitive work. 

But if you look under the hood of current Large Language Models, you see we are hitting a physical wall. We are polishing a mirror and expecting it to eventually reflect a soul.

### The Limits of Scaling (The Data Wall)

The primary driver of LLM improvements has been scaling: more parameters, more compute, and more training tokens. 

However, we are running out of high-quality human data. LLMs have already ingested almost the entire indexed, public, written output of human civilization. Training models on AI-generated data (synthetic data) leads to **Model Collapse**—where the output progressively degrades into gibberish, like photocopying a photocopy.

### Pattern Matching vs. Conceptual Understanding

An LLM does not *know* what a tree is. It knows that the word "tree" frequently appears near "leaves," "branches," "oak," and "green." It matches statistical patterns in high-dimensional vector space.

This is fundamentally different from human reasoning. Humans:
- **Build internal models of the physical world** through sensory interactions.
- **Learn continuously** from single, high-impact events (few-shot learning).
- **Incorporate logic structures** that operate outside of probabilistic predictions.

If you give a modern AI a logic puzzle it hasn't seen in its training data, it will frequently hallucinate a plausible-sounding but logically broken answer. It is prioritizing *association* over *deduction*.

### Why This is Good News

If we were truly on the verge of AGI, we would be facing a crisis of human agency. 

Instead, AI is settling into what it actually is: **a spectacular cognitive amplifier**. It is a tool that writes boilerplate, refactors code, compiles reports, and searches documentation at lightning speed. It does the routine work, leaving the human engineer, designer, or writer to do the creative synthesis.

We should stop waiting for AI to become our master and start mastering it as the ultimate developer instrument.`,
    author: "Philosophical Byte 🦉",
    date: "2026-06-08T08:00:00.000Z",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    category: "Deep Thoughts",
    tags: ["AI", "Technology", "Future", "Philosophy"],
    passcode: "ink-deep01",
    views: 512,
    reactions: { love: 35, fire: 18, mindblown: 84, shocked: 8, sad: 2 },
    comments: [
      {
        id: "c6",
        author: "Silicon Optimist 🤖",
        content: "You're underestimating neuro-symbolic AI and agentic workflows. Even if LLMs plateau, putting them in feedback loops with compilers and tools solves reasoning.",
        date: "2026-06-08T11:40:00.000Z"
      }
    ],
    reports: 0
  },
  {
    id: "4",
    title: "How I Built a Profitable Indie Hack Project with Zero Marketing",
    summary: "By solving my own extremely niche problem and talking about it on obscure message boards, I reached $4,200 MRR in 6 months. Here is my exact blueprint.",
    content: `### Solve Your Own Annoyance

Six months ago, I was managing three freelance design clients. My biggest pain point was tracking feedback on PDF mockups. Clients would email me, text me screenshots on WhatsApp, or dump comments on Slack. It was a disaster.

I looked for tools, but everything was bloated, expensive, or forced clients to sign up for an account.

So, I spent one weekend building a bare-bones tool: **markup-share.xyz**. It allowed me to drag in a PDF, generate an anonymous link, and let clients click anywhere to draw a red dot and leave a note. No signups, no onboarding.

### The 'Zero Marketing' Secret: Useful Posting

I didn't buy ads. I didn't post on Product Hunt. Instead, I went where my fellow freelance designers hang out:

1. **Subreddits**: I searched for threads where designers complained about client feedback loops. I didn't pitch my product. I wrote: *"I had this exact issue. I built a tiny free script to solve it for myself. Here is the link if you want to use it: [link]. Let me know if it helps."*
2. **Niche Discord Channels**: I shared it in design servers asking for feedback.
3. **Indie Hackers**: I documented my weekend build, showing the source code and the tech stack (Vite + Supabase).

Because the tool solved a sharp, immediate pain point and had zero friction (no signup required!), people shared it.

### Adding the Paywall

For the first two months, the tool was entirely free. I had about 800 active designers using it weekly.

Then, I added a premium tier: **$9/month** to password-protect feedback links, add custom branding, and upload PDFs larger than 25MB. 

Within 48 hours, 18 people upgraded. That was my first validation. Today, I have 467 paying subscribers, generating roughly **$4,200/month** in recurring revenue.

### Key Takeaways for Indie Hackers

- **Zero Friction is a superpower**: Let users experience the value of your app *before* asking for their email.
- **Solve micro-problems**: Huge SaaS companies ignore micro-problems because the market is too small for them. But a $4k/month business is life-changing for a solo developer.
- **Help, don't sell**: When promoting, focus on helping individuals resolve their specific issues, rather than spamming landing page links.`,
    author: "Solo Hacker 🚀",
    date: "2026-06-05T14:20:00.000Z",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    category: "Ideas",
    tags: ["IndieHacker", "SaaS", "Startup", "Bootstrap"],
    passcode: "ink-idea01",
    views: 670,
    reactions: { love: 72, fire: 89, mindblown: 54, shocked: 4, sad: 1 },
    comments: [
      {
        id: "c7",
        author: "Curious Indie 💡",
        content: "What stack did you use? Did you experience any scaling issues with Supabase free tier?",
        date: "2026-06-05T17:15:00.000Z"
      },
      {
        id: "c8",
        author: "Solo Hacker 🚀",
        content: "Hey! I used React (Vite) + Tailwind for the frontend, and Supabase for database + auth + storage. I upgraded to the $25/month tier once file storage crossed 10GB, but the free tier was more than enough to start!",
        date: "2026-06-05T18:05:00.000Z"
      }
    ],
    reports: 0
  }
];

// Initialize Storage if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(DEFAULT_POSTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.OWNED_POSTS)) {
    // By default, let's claim the first post (Tech Lead Rant) for the user to make the dashboard look populated!
    localStorage.setItem(STORAGE_KEYS.OWNED_POSTS, JSON.stringify(["1"]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LIKED_POSTS)) {
    localStorage.setItem(STORAGE_KEYS.LIKED_POSTS, JSON.stringify({}));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DRAFTS)) {
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]));
  }
};

// Initialize immediately on module import
initializeStorage();

export const Storage = {
  // Posts CRUD
  getPosts: () => {
    try {
      const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
      const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
      // Filter out posts with excessive reports (e.g. >= 3)
      return posts.filter(post => !reports.includes(post.id) && (post.reports || 0) < 3);
    } catch (e) {
      console.error("Failed to read posts from localStorage", e);
      return [];
    }
  },

  getPostById: (id) => {
    const posts = Storage.getPosts();
    const post = posts.find(p => p.id === id);
    if (post) {
      // Simulate viewing: increment view count (throttle locally so it doesn't inflate on every render)
      const viewedKey = `viewed_post_${id}`;
      const hasViewed = sessionStorage.getItem(viewedKey);
      if (!hasViewed) {
        post.views = (post.views || 0) + 1;
        sessionStorage.setItem(viewedKey, 'true');
        Storage.updatePostRaw(post);
      }
    }
    return post;
  },

  updatePostRaw: (updatedPost) => {
    try {
      const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
      const index = posts.findIndex(p => p.id === updatedPost.id);
      if (index !== -1) {
        posts[index] = updatedPost;
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      }
    } catch (e) {
      console.error(e);
    }
  },

  createPost: (postData) => {
    try {
      const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
      
      // Generate unique passcode & post ID
      const newId = String(Date.now());
      const pass = 'ink-' + Math.random().toString(36).substring(2, 8);
      
      const newPost = {
        id: newId,
        title: postData.title,
        summary: postData.summary,
        content: postData.content,
        author: postData.author || 'Anonymous',
        date: new Date().toISOString(),
        image: postData.image || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
        category: postData.category || 'Whispers',
        tags: postData.tags || [],
        passcode: pass,
        views: 1,
        reactions: { love: 0, fire: 0, mindblown: 0, shocked: 0, sad: 0 },
        comments: [],
        reports: 0
      };

      posts.unshift(newPost);
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

      // Add to user's owned posts list
      const owned = Storage.getOwnedPostIds();
      owned.push(newId);
      localStorage.setItem(STORAGE_KEYS.OWNED_POSTS, JSON.stringify(owned));

      return { post: newPost, passcode: pass };
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  updatePost: (id, passcode, updatedFields) => {
    try {
      const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
      const index = posts.findIndex(p => p.id === id);
      if (index === -1) return { success: false, error: 'Post not found' };

      const post = posts[index];
      if (post.passcode !== passcode) {
        return { success: false, error: 'Invalid passcode' };
      }

      posts[index] = {
        ...post,
        title: updatedFields.title ?? post.title,
        summary: updatedFields.summary ?? post.summary,
        content: updatedFields.content ?? post.content,
        image: updatedFields.image ?? post.image,
        category: updatedFields.category ?? post.category,
        tags: updatedFields.tags ?? post.tags,
      };

      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Storage error' };
    }
  },

  deletePost: (id, passcode) => {
    try {
      const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
      const index = posts.findIndex(p => p.id === id);
      if (index === -1) return { success: false, error: 'Post not found' };

      const post = posts[index];
      if (post.passcode !== passcode) {
        return { success: false, error: 'Invalid passcode' };
      }

      posts.splice(index, 1);
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

      // Remove from owned posts list
      const owned = Storage.getOwnedPostIds();
      const newOwned = owned.filter(oid => oid !== id);
      localStorage.setItem(STORAGE_KEYS.OWNED_POSTS, JSON.stringify(newOwned));

      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Storage error' };
    }
  },

  // Likes & Emoji Reactions
  likePost: (id, emojiType) => {
    try {
      const likedState = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKED_POSTS) || '{}');
      const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
      const index = posts.findIndex(p => p.id === id);
      
      if (index === -1) return null;
      const post = posts[index];
      if (!post.reactions) post.reactions = { love: 0, fire: 0, mindblown: 0, shocked: 0, sad: 0 };

      // Initialize structures if needed
      if (!likedState[id]) likedState[id] = {};

      const hasLikedThisEmoji = likedState[id][emojiType];

      if (hasLikedThisEmoji) {
        // Undo like
        post.reactions[emojiType] = Math.max(0, (post.reactions[emojiType] || 0) - 1);
        likedState[id][emojiType] = false;
      } else {
        // Add like
        post.reactions[emojiType] = (post.reactions[emojiType] || 0) + 1;
        likedState[id][emojiType] = true;
      }

      posts[index] = post;
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      localStorage.setItem(STORAGE_KEYS.LIKED_POSTS, JSON.stringify(likedState));

      return { reactions: post.reactions, isActive: !hasLikedThisEmoji };
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  getUserLikesForPost: (id) => {
    try {
      const likedState = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKED_POSTS) || '{}');
      return likedState[id] || {};
    } catch (e) {
      return {};
    }
  },

  // Comments System
  addComment: (postId, commentData) => {
    try {
      const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
      const index = posts.findIndex(p => p.id === postId);
      if (index === -1) return null;

      const post = posts[index];
      if (!post.comments) post.comments = [];

      const newComment = {
        id: String(Date.now()) + Math.random().toString(36).substring(2, 5),
        author: commentData.author || 'Anonymous Writer 👤',
        content: commentData.content,
        date: new Date().toISOString()
      };

      post.comments.push(newComment);
      posts[index] = post;

      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      return newComment;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  // Flags & Reports System
  reportPost: (id) => {
    try {
      const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
      if (!reports.includes(id)) {
        reports.push(id);
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      }

      // Also increment report count on the post
      const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
      const index = posts.findIndex(p => p.id === id);
      if (index !== -1) {
        posts[index].reports = (posts[index].reports || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  // Ownership Management
  getOwnedPostIds: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.OWNED_POSTS) || '[]');
    } catch (e) {
      return [];
    }
  },

  getOwnedPosts: () => {
    const ownedIds = Storage.getOwnedPostIds();
    // Return posts that are owned, including deleted checks (we load directly from raw list)
    try {
      const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
      return posts.filter(p => ownedIds.includes(p.id));
    } catch (e) {
      return [];
    }
  },

  claimPost: (passcode) => {
    try {
      const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
      const matchingPost = posts.find(p => p.passcode === passcode);
      if (!matchingPost) return { success: false, error: 'No post found with this passcode' };

      const owned = Storage.getOwnedPostIds();
      if (owned.includes(matchingPost.id)) {
        return { success: false, error: 'You already own this post' };
      }

      owned.push(matchingPost.id);
      localStorage.setItem(STORAGE_KEYS.OWNED_POSTS, JSON.stringify(owned));
      return { success: true, post: matchingPost };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Failed to claim post' };
    }
  },

  // Drafts System
  getDrafts: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.DRAFTS) || '[]');
    } catch (e) {
      return [];
    }
  },

  saveDraft: (draftData) => {
    try {
      const drafts = Storage.getDrafts();
      const draftId = draftData.id || String(Date.now() + Math.random());
      
      const newDraft = {
        id: draftId,
        title: draftData.title || '',
        summary: draftData.summary || '',
        content: draftData.content || '',
        author: draftData.author || '',
        category: draftData.category || '',
        tags: draftData.tags || '',
        image: draftData.image || '',
        updatedAt: new Date().toISOString()
      };

      const index = drafts.findIndex(d => d.id === draftId);
      if (index !== -1) {
        drafts[index] = newDraft;
      } else {
        drafts.unshift(newDraft);
      }

      localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
      return draftId;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  deleteDraft: (draftId) => {
    try {
      const drafts = Storage.getDrafts();
      const newDrafts = drafts.filter(d => d.id !== draftId);
      localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(newDrafts));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};
