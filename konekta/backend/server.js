const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/konekta';

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected!');
});

// ==================== USER SCHEMA ====================
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ==================== POST SCHEMA ====================
const postSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [{ user: String, text: String, timestamp: { type: Date, default: Date.now } }],
  timestamp: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// ==================== REEL SCHEMA ====================
const reelSchema = new mongoose.Schema({
  user: { type: String, required: true },
  videoUrl: { type: String, required: true },
  caption: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  comments: [{ 
    user: String, 
    text: String, 
    timestamp: { type: Date, default: Date.now }
  }],
  views: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

const Reel = mongoose.model('Reel', reelSchema);

// ==================== USER ROUTES ====================

// Register
app.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName, dob, age, gender } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      fullName, 
      dob, 
      age, 
      gender 
    });
    await newUser.save();
    res.status(201).json({ username: newUser.username, message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ $or: [{ username }, { email: username }] });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ username: user.username, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== POST ROUTES ====================

// Get all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new post
app.post('/posts', async (req, res) => {
  try {
    const { user, text } = req.body;
    const newPost = new Post({ user, text });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/posts/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const deltaInput = Number(req.body?.delta ?? 1);
    const delta = Number.isFinite(deltaInput) ? deltaInput : 1;
    post.likes = Math.max(0, post.likes + delta);
    await post.save();
    res.json({ postId: post.id, likes: post.likes });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/posts/:id/comment', async (req, res) => {
  try {
    const { comment, user } = req.body || {};
    if (!comment) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const newComment = {
      user: user || 'anon',
      text: comment,
    };
    post.comments.push(newComment);
    await post.save();
    res.status(201).json({ postId: post.id, comment: newComment });
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== REEL ROUTES ====================

// Get all reels
app.get('/reels', async (req, res) => {
  try {
    const reels = await Reel.find().sort({ timestamp: -1 });
    res.json(reels);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new reel
app.post('/reels', async (req, res) => {
  try {
    const { user, videoUrl, caption } = req.body;
    const newReel = new Reel({ user, videoUrl, caption });
    await newReel.save();
    res.status(201).json(newReel);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like a reel
app.post('/reels/:id/like', async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }
    const deltaInput = Number(req.body?.delta ?? 1);
    const delta = Number.isFinite(deltaInput) ? deltaInput : 1;
    reel.likes = Math.max(0, reel.likes + delta);
    await reel.save();
    res.json(reel);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment reel views
app.post('/reels/:id/view', async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }
    reel.views += 1;
    await reel.save();
    res.json(reel);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== START SERVER ====================
app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState;
  res.json({
    status: state === 1 ? 'ok' : 'disconnected',
    mongoState: state,
    timestamp: Date.now(),
  });
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    console.error('Verify MongoDB is running and the MONGO_URI is correct.');
    process.exit(1);
  }
}

startServer();
