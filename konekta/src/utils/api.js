// Local Storage API - No Backend Required

const STORAGE_KEYS = {
  USERS: 'konektaUsers',
  POSTS: 'konektaPosts',
  REELS: 'konektaReels',
  CURRENT_USER: 'user',
  USER_DATA: 'currentUserData',
};

// Helper functions for localStorage
const getFromStorage = (key, defaultValue = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const api = {
  // Authentication
  login: async (payload) => {
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const user = users.find(
      (u) => u.email === payload.username && u.password === payload.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, user.username);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    return { username: user.username };
  },

  register: async (payload) => {
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    
    // Check if username or email already exists
    const exists = users.some(
      (u) => u.username === payload.username || u.email === payload.email
    );

    if (exists) {
      throw new Error('Username or email already exists');
    }

    const newUser = {
      ...payload,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, newUser.username);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser));
    
    return { username: newUser.username };
  },

  // Posts
  fetchPosts: async () => {
    return getFromStorage(STORAGE_KEYS.POSTS, []);
  },

  createPost: async (payload) => {
    const posts = getFromStorage(STORAGE_KEYS.POSTS, []);
    const newPost = {
      ...payload,
      id: Date.now().toString(),
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    posts.unshift(newPost);
    saveToStorage(STORAGE_KEYS.POSTS, posts);
    return newPost;
  },

  likePost: async (postId, delta = 1) => {
    const posts = getFromStorage(STORAGE_KEYS.POSTS, []);
    const post = posts.find((p) => p.id === postId);
    if (post) {
      post.likes = (post.likes || 0) + delta;
      saveToStorage(STORAGE_KEYS.POSTS, posts);
    }
    return { likes: post?.likes || 0 };
  },

  addComment: async (postId, payload) => {
    const posts = getFromStorage(STORAGE_KEYS.POSTS, []);
    const post = posts.find((p) => p.id === postId);
    if (post) {
      const comment = {
        ...payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      post.comments = post.comments || [];
      post.comments.push(comment);
      saveToStorage(STORAGE_KEYS.POSTS, posts);
      return comment;
    }
    throw new Error('Post not found');
  },

  // Reels
  fetchReels: async () => {
    return getFromStorage(STORAGE_KEYS.REELS, []);
  },

  createReel: async (payload) => {
    const reels = getFromStorage(STORAGE_KEYS.REELS, []);
    const newReel = {
      ...payload,
      id: Date.now().toString(),
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString(),
    };
    reels.unshift(newReel);
    saveToStorage(STORAGE_KEYS.REELS, reels);
    return newReel;
  },

  likeReel: async (reelId, delta = 1) => {
    const reels = getFromStorage(STORAGE_KEYS.REELS, []);
    const reel = reels.find((r) => r.id === reelId);
    if (reel) {
      reel.likes = (reel.likes || 0) + delta;
      saveToStorage(STORAGE_KEYS.REELS, reels);
    }
    return { likes: reel?.likes || 0 };
  },

  viewReel: async (reelId) => {
    const reels = getFromStorage(STORAGE_KEYS.REELS, []);
    const reel = reels.find((r) => r.id === reelId);
    if (reel) {
      reel.views = (reel.views || 0) + 1;
      saveToStorage(STORAGE_KEYS.REELS, reels);
    }
    return { views: reel?.views || 0 };
  },
};

