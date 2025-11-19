import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuthGuard } from '../hooks/useAuthGuard';

const generateId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const defaultProfile = {
  name: 'jane_doe',
  bio: 'Design + CS @ Parsons. Coffee-fueled storyteller. DMs open for collabs ✨',
  link: 'konekta.bio/jane',
  avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
};

const seedPosts = [
  {
    id: 'post-1',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=80',
    caption: 'Night walk before crits.',
    likes: 230,
  },
  {
    id: 'post-2',
    image: 'https://images.unsplash.com/photo-1526481280695-3c46977f9240?auto=format&fit=crop&w=700&q=80',
    caption: 'Neon study w/ @Cris',
    likes: 198,
  },
  {
    id: 'post-3',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80',
    caption: 'Reel shoot BTS',
    likes: 341,
  },
  {
    id: 'post-4',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80',
    caption: 'Studio pop-up',
    likes: 412,
  },
];

const Profile = () => {
  useAuthGuard();
  const [profile, setProfile] = useState(defaultProfile);
  const [posts, setPosts] = useState(seedPosts);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [createForm, setCreateForm] = useState({ caption: '', image: null });
  const [editForm, setEditForm] = useState(defaultProfile);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const editAvatarRef = useRef(null);

  useEffect(() => {
    document.title = 'Konekta | Profile';
  }, []);

  const handleCreatePost = (event) => {
    event.preventDefault();
    if (!createForm.image) {
      setError('Please select an image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const newPost = {
        id: generateId(),
        image: reader.result,
        caption: createForm.caption,
        likes: 0,
      };
      setPosts((prev) => [newPost, ...prev]);
      setCreateForm({ caption: '', image: null });
      setShowCreateModal(false);
      setError('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(createForm.image);
  };

  const handleEditProfile = (event) => {
    event.preventDefault();
    const applyProfileUpdate = (avatarSrc) => {
      setProfile({
        name: editForm.name,
        bio: editForm.bio,
        link: editForm.link,
        avatar: avatarSrc ?? profile.avatar,
      });
      setShowEditModal(false);
    };

    const avatarFile = editAvatarRef.current?.files?.[0];
    if (avatarFile) {
      const reader = new FileReader();
      reader.onload = () => applyProfileUpdate(reader.result);
      reader.readAsDataURL(avatarFile);
    } else {
      applyProfileUpdate();
    }
  };

  const deletePost = (id) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const toggleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.likes + (post.liked ? -1 : 1),
            }
          : post,
      ),
    );
  };

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % posts.length);
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + posts.length) % posts.length);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      <Sidebar />
      <div className="flex-1 px-4 lg:px-12 py-10">
        <header className="flex flex-col lg:flex-row gap-8">
          <img src={profile.avatar} alt={profile.name} className="w-32 h-32 rounded-full object-cover border-4 border-[#FF007A]" />
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-3xl font-poppins font-semibold">{profile.name}</h1>
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 rounded-full border border-[#333] hover:border-[#FF007A]"
              >
                Edit profile
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF007A] to-[#00F5FF] text-black font-semibold"
              >
                Create post
              </button>
            </div>
            <p className="text-gray-300 max-w-2xl">{profile.bio}</p>
            <a href={`https://${profile.link}`} target="_blank" rel="noreferrer" className="text-[#00F5FF] text-sm">
              {profile.link}
            </a>
            <div className="flex gap-6 text-sm">
              <span>
                <strong>{posts.length}</strong> posts
              </span>
              <span>
                <strong>5.2k</strong> followers
              </span>
              <span>
                <strong>384</strong> following
              </span>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="relative group cursor-pointer"
              onClick={() => openLightbox(index)}
              onKeyDown={() => {}}
              role="presentation"
            >
              <img src={post.image} alt={post.caption} className="aspect-square object-cover rounded-2xl" />
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  deletePost(post.id);
                }}
                className="absolute top-3 left-3 w-10 h-10 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition"
              >
                <i className="fa-regular fa-trash-can" />
              </button>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 text-lg font-semibold">
                <span className="flex items-center gap-2">
                  <i className="fa-regular fa-heart" /> {post.likes}
                </span>
                <span className="flex items-center gap-2">
                  <i className="fa-regular fa-comment-dots" /> {Math.floor(post.likes / 4) || 0}
                </span>
              </div>
            </div>
          ))}
        </section>
      </div>

      {lightboxIndex !== null && posts[lightboxIndex] && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur flex items-center justify-center z-50">
          <button type="button" onClick={closeLightbox} className="absolute top-6 right-8 text-2xl">
            <i className="fa-regular fa-circle-xmark" />
          </button>
          <button type="button" onClick={prevImage} className="absolute left-8 text-3xl">
            ‹
          </button>
          <div className="max-w-3xl flex flex-col gap-4 items-center">
            <img src={posts[lightboxIndex].image} alt="lightbox" className="w-full rounded-3xl object-cover" />
            <p className="text-sm text-gray-300">{posts[lightboxIndex].caption}</p>
            <button
              type="button"
              onClick={() => toggleLike(posts[lightboxIndex].id)}
              className={`px-4 py-2 rounded-full ${
                posts[lightboxIndex].liked ? 'bg-[#FF007A]' : 'bg-white/10'
              }`}
            >
              <i className="fa-regular fa-heart mr-2" />
              {posts[lightboxIndex].likes} likes
            </button>
          </div>
          <button type="button" onClick={nextImage} className="absolute right-8 text-3xl">
            ›
          </button>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleCreatePost}
            className="w-full max-w-md bg-[#111] border border-[#1f1f1f] rounded-3xl p-6 space-y-4"
          >
            <h3 className="text-xl font-semibold">Create new post</h3>
            <textarea
              value={createForm.caption}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, caption: event.target.value }))}
              placeholder="Write a caption..."
              className="w-full bg-black/40 border border-transparent focus:border-[#FF007A] rounded-2xl px-4 py-3 text-sm text-white"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => setCreateForm((prev) => ({ ...prev, image: event.target.files?.[0] ?? null }))}
              className="w-full text-sm text-gray-400"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-full border border-[#333]">
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF007A] to-[#00F5FF] text-black font-semibold"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleEditProfile}
            className="w-full max-w-md bg-[#111] border border-[#1f1f1f] rounded-3xl p-6 space-y-4"
          >
            <h3 className="text-xl font-semibold">Edit profile</h3>
            <label className="text-sm text-gray-400 flex flex-col gap-2">
              Display name
              <input
                type="text"
                value={editForm.name}
                onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full bg-black/40 border border-transparent focus:border-[#FF007A] rounded-2xl px-4 py-2 text-white"
              />
            </label>
            <label className="text-sm text-gray-400 flex flex-col gap-2">
              Bio
              <textarea
                value={editForm.bio}
                onChange={(event) => setEditForm((prev) => ({ ...prev, bio: event.target.value }))}
                className="w-full bg-black/40 border border-transparent focus:border-[#FF007A] rounded-2xl px-4 py-2 text-white"
              />
            </label>
            <label className="text-sm text-gray-400 flex flex-col gap-2">
              Link
              <input
                type="text"
                value={editForm.link}
                onChange={(event) => setEditForm((prev) => ({ ...prev, link: event.target.value }))}
                className="w-full bg-black/40 border border-transparent focus:border-[#FF007A] rounded-2xl px-4 py-2 text-white"
              />
            </label>
            <label className="text-sm text-gray-400 flex flex-col gap-2">
              Profile photo
              <input ref={editAvatarRef} type="file" accept="image/*" className="text-gray-400" />
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-full border border-[#333]">
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF007A] to-[#00F5FF] text-black font-semibold"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;

