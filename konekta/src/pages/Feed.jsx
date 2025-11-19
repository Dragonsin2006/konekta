import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { api } from '../utils/api';
import { useAuthGuard } from '../hooks/useAuthGuard';

const generateId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const stories = [
  {
    id: 1,
    name: 'Laura Quinn',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    background: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    live: true,
  },
  {
    id: 2,
    name: 'James Williams',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    background: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Lura Cap',
    avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
    background: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    name: 'Michael Daws',
    avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    background: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    name: 'Dora Swis',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    background: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    name: 'Cris',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    background: 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 7,
    name: 'Kiara Dua',
    avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
    background: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 8,
    name: 'Evan',
    avatar: 'https://randomuser.me/api/portraits/men/71.jpg',
    background: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
  },
];

const matchDeck = [
  {
    id: 'match-1',
    name: 'Aisha Khan',
    age: 21,
    major: 'Design',
    distance: '0.8 mi away',
    interests: ['Art walks', 'Spotify swaps', 'Photo clubs'],
    avatar: 'https://randomuser.me/api/portraits/women/52.jpg',
    background: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'match-2',
    name: 'Sid Mehta',
    age: 22,
    major: 'Computer Science',
    distance: '1.5 mi away',
    interests: ['Hackathons', 'Indie music', 'Late-night coffee'],
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    background: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'match-3',
    name: 'Meera Rao',
    age: 20,
    major: 'Psychology',
    distance: 'On campus',
    interests: ['Book club', 'Pilates', 'Street food'],
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    background: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  },
];

const activitySeed = {
  notifications: [
    {
      id: 'notif-1',
      avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
      text: 'Anny liked your post ❤️',
    },
    {
      id: 'notif-2',
      avatar: 'https://randomuser.me/api/portraits/men/40.jpg',
      text: 'Michael commented “Nice!” 💬',
    },
    {
      id: 'notif-3',
      avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
      text: 'Aisha shared your post 🔗',
    },
  ],
  requests: [
    {
      id: 'req-ash',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      text: 'Ash sent a match request 💌',
      status: 'pending',
    },
    {
      id: 'req-meera',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      text: 'Meera wants to follow you 👀',
      status: 'pending',
    },
  ],
  matches: [
    {
      id: 'match-danny',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      text: 'Danny – matched ✅',
    },
    {
      id: 'match-sid',
      avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
      text: 'Sid – matched ✅',
    },
  ],
};

const staticPosts = [
  {
    id: 'local-1',
    user: 'Danny Alvarez',
    handle: '@dannyo',
    time: '2h ago',
    text: 'Neon nights + rooftop jam session with the media crew. Still buzzing from the energy ⚡️',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    likes: 128,
    comments: [
      { id: 'c1', user: 'Aisha', text: 'This looks unreal! Invite next time 🤞' },
      { id: 'c2', user: 'Zara', text: 'The drip + vibe is immaculate🔥' },
    ],
    shareCount: 12,
  },
  {
    id: 'local-2',
    user: 'Laura Quinn',
    handle: '@lauraq',
    time: '4h ago',
    text: 'Dropped my first mini film shot entirely on phone lenses. Who wants the BTS breakdown?',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    likes: 201,
    comments: [{ id: 'c3', user: 'Meera', text: 'YES please share the setup!' }],
    shareCount: 33,
  },
  {
    id: 'local-3',
    user: 'Campus Stories',
    handle: '@konekta_live',
    time: 'Live',
    text: 'Swipe by the quad for a surprise DJ set + glow paint tonight. RSVP to grab your wristband.',
    likes: 95,
    comments: [],
    shareCount: 8,
  },
];

const Feed = () => {
  const username = useAuthGuard();
  const [posts, setPosts] = useState(staticPosts);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [requests, setRequests] = useState(activitySeed.requests);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Konekta Feed';
  }, []);

  useEffect(() => {
    const fetchRemotePosts = async () => {
      try {
        setLoadingPosts(true);
        const response = await api.fetchPosts();
        if (!Array.isArray(response)) return;
        const normalized = response.map((post) => ({
          id: post._id || post.id || generateId(),
          user: post.user || 'Konekta user',
          handle: post.user ? `@${post.user.toLowerCase().split(' ')[0]}` : '@konekta',
          time: post.timestamp ? new Date(post.timestamp).toLocaleString() : 'Just now',
          text: post.text || post.body || '',
          image: post.imageUrl,
          likes: post.likes ?? 0,
          comments: (post.comments || []).map((comment, index) => ({
            id: `${post._id || post.id}-comment-${index}`,
            user: comment.user || 'anon',
            text: comment.text || comment.body || comment.comment,
          })),
          shareCount: post.shares ?? 0,
          isRemote: true,
        }));

        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const merged = [...prev];
          normalized.forEach((post) => {
            if (!existingIds.has(post.id)) {
              merged.push(post);
            }
          });
          return merged;
        });
      } catch {
        setError('Unable to load latest posts right now.');
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchRemotePosts();
  }, []);

  const orderedPosts = useMemo(
    () =>
      [...posts].sort((a, b) => {
        if (a.isRemote && !b.isRemote) return 1;
        if (!a.isRemote && b.isRemote) return -1;
        return 0;
      }),
    [posts],
  );

  const handleLike = async (postId) => {
    const targetPost = posts.find((post) => post.id === postId);
    const delta = targetPost && targetPost.liked ? -1 : 1;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: Math.max(0, post.likes + (post.liked ? -1 : 1)),
            }
          : post,
      ),
    );

    try {
      await api.likePost(postId, delta);
    } catch (err) {
      console.warn('Like request failed', err);
    }
  };

  const toggleComment = (postId) => {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentChange = (postId, value) => {
    setCommentDrafts((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (event, postId) => {
    event.preventDefault();
    const text = commentDrafts[postId]?.trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: generateId(),
                  user: username || 'You',
                  text,
                },
              ],
            }
          : post,
      ),
    );
    setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
    setOpenComments((prev) => ({ ...prev, [postId]: false }));

    try {
      await api.addComment(postId, { comment: text, user: username || 'You' });
    } catch (err) {
      console.warn('Comment request failed', err);
    }
  };

  const handleShare = (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const sharePayload = {
      title: 'Konekta Post',
      text: post.text,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(sharePayload).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${post.text} — ${window.location.href}`);
      alert('Post copied! Ready to share ✨');
    }
  };

  const handleRequestAction = (requestId, action) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: action,
            }
          : req,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      <Sidebar />

      <section className="flex-1 flex flex-col">
        <header className="lg:hidden sticky top-0 z-20 bg-[#0A0A0A]/95 backdrop-blur border-b border-[#1f1f1f] px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Konekta</p>
            <h1 className="font-poppins text-xl font-bold">Swipe. Share. Spark.</h1>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center"
            >
              <i className="fa-solid fa-rotate text-lg" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF007A] to-[#A200FF] flex items-center justify-center"
            >
              <i className="fa-regular fa-bell text-lg" />
            </button>
          </div>
        </header>

        <div className="flex flex-col xl:flex-row gap-6 px-4 lg:px-8 py-8 flex-1">
          <main className="flex-1 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Stories</h2>
                <button
                  type="button"
                  className="text-sm text-[#FF007A] hover:text-white transition flex items-center gap-2"
                >
                  <i className="fa-regular fa-plus" />
                  Add story
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {stories.map((story) => (
                  <article
                    key={story.id}
                    className="relative w-24 h-40 rounded-2xl overflow-hidden flex-shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.35)] bg-[#111]"
                  >
                    <img src={story.background} alt={story.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                    <div className="absolute bottom-2 left-2 flex items-center gap-2">
                      <img
                        src={story.avatar}
                        alt={story.name}
                        className="w-7 h-7 rounded-full border-2 border-[#FF007A] object-cover"
                      />
                      <span className="text-xs font-semibold truncate">{story.name}</span>
                    </div>
                    {story.live && (
                      <span className="absolute top-2 left-2 bg-[#FF007A] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                        LIVE
                      </span>
                    )}
                  </article>
                ))}
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-5">
              {matchDeck.map((card) => (
                <article
                  key={card.id}
                  className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] rounded-3xl border border-[#1f1f1f] overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.4)]"
                >
                  <div className="relative h-48">
                    <img src={card.background} alt={card.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <img
                        src={card.avatar}
                        alt={card.name}
                        className="w-14 h-14 rounded-full border-4 border-[#FF007A] object-cover"
                      />
                      <div>
                        <p className="font-poppins text-lg font-semibold">{card.name}</p>
                        <p className="text-sm text-gray-300">
                          {card.age} • {card.major}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <p className="text-sm text-gray-400">{card.distance}</p>
                    <div className="flex flex-wrap gap-2">
                      {card.interests.map((interest) => (
                        <span
                          key={interest}
                          className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-[#1a1a1a] border border-[#FF007A33]"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="flex-1 py-2 rounded-full border border-[#333] hover:border-[#FF007A] transition"
                      >
                        Pass
                      </button>
                      <button
                        type="button"
                        className="flex-1 py-2 rounded-full bg-gradient-to-r from-[#FF007A] to-[#A200FF] shadow-lg shadow-[#FF007A55]"
                      >
                        Match
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="space-y-6">
              {error && (
                <p className="text-sm text-red-400 bg-red-900/20 border border-red-500/40 rounded-2xl px-4 py-3">
                  {error}
                </p>
              )}
              {loadingPosts && <p className="text-sm text-gray-400">Fetching latest posts...</p>}

              {orderedPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-black/70 border border-[#1f1f1f] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden"
                >
                  <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF007A] to-[#A200FF] flex items-center justify-center font-semibold">
                      {post.user[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{post.user}</p>
                      <p className="text-xs text-gray-400">
                        {post.handle} • {post.time}
                      </p>
                    </div>
                    {post.isRemote && (
                      <span className="ml-auto text-xs bg-[#1f1f1f] px-3 py-1 rounded-full text-gray-400">
                        Live Post
                      </span>
                    )}
                  </div>

                  <p className="px-6 pb-4 text-base leading-relaxed text-gray-100">{post.text}</p>

                  {post.image && (
                    <img src={post.image} alt="Post visual" className="w-full max-h-[420px] object-cover" />
                  )}

                  <div className="px-6 py-4 border-t border-[#1f1f1f] space-y-4">
                    <div className="flex items-center gap-6 text-sm text-gray-300">
                      <button
                        type="button"
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 ${post.liked ? 'text-[#FF007A]' : 'hover:text-white'}`}
                      >
                        <i className={`fa-${post.liked ? 'solid' : 'regular'} fa-heart`} />
                        {post.likes}
                      </button>
                      <button type="button" onClick={() => toggleComment(post.id)} className="flex items-center gap-2">
                        <i className="fa-regular fa-comment" />
                        {post.comments.length}
                      </button>
                      <button type="button" onClick={() => handleShare(post.id)} className="flex items-center gap-2">
                        <i className="fa-regular fa-paper-plane" />
                        {post.shareCount ?? 0}
                      </button>
                    </div>

                    {openComments[post.id] && (
                      <form className="flex gap-3" onSubmit={(event) => handleCommentSubmit(event, post.id)}>
                        <input
                          type="text"
                          value={commentDrafts[post.id] ?? ''}
                          onChange={(event) => handleCommentChange(post.id, event.target.value)}
                          placeholder="Write a comment..."
                          className="flex-1 rounded-full bg-[#1a1a1a] border border-transparent focus:border-[#FF007A] px-4 py-2 text-sm text-white"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF007A] to-[#00F5FF] text-sm font-semibold"
                        >
                          Post
                        </button>
                      </form>
                    )}

                    <div className="space-y-3">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="bg-[#111111] rounded-2xl px-4 py-2 text-sm text-gray-200">
                          <span className="font-semibold mr-2">{comment.user}:</span>
                          {comment.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </main>

          <aside className="w-full xl:w-96 bg-black/70 border border-[#1f1f1f] rounded-3xl h-fit max-h-[90vh] overflow-y-auto no-scrollbar p-6 space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Activity</h3>
              <span className="text-xs bg-[#FF007A] px-3 py-1 rounded-full">5 new</span>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500 tracking-[0.3em] mb-3">Notifications</p>
              <div className="space-y-3">
                {activitySeed.notifications.map((notif) => (
                  <div key={notif.id} className="flex items-center gap-3 border border-[#1f1f1f] rounded-2xl p-3">
                    <img src={notif.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-[#333]" />
                    <p className="text-sm text-gray-200">{notif.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500 tracking-[0.3em] mb-3">Requests</p>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between gap-3 border border-[#1f1f1f] rounded-2xl p-3">
                    <div className="flex items-center gap-3">
                      <img src={request.avatar} alt={request.text} className="w-10 h-10 rounded-full border border-[#333]" />
                      <p className="text-sm text-gray-200">{request.text}</p>
                    </div>
                    {request.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleRequestAction(request.id, 'accepted')}
                          className="px-3 py-1 rounded-full bg-[#FF007A] text-xs"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRequestAction(request.id, 'declined')}
                          className="px-3 py-1 rounded-full bg-[#1f1f1f] text-xs"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs uppercase tracking-wide text-gray-400">
                        {request.status === 'accepted' ? 'Accepted' : 'Declined'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500 tracking-[0.3em] mb-3">Matches</p>
              <div className="space-y-3">
                {activitySeed.matches.map((match) => (
                  <div key={match.id} className="flex items-center gap-3 border border-[#1f1f1f] rounded-2xl p-3">
                    <img src={match.avatar} alt={match.text} className="w-10 h-10 rounded-full border border-[#333]" />
                    <p className="text-sm text-gray-200">{match.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Feed;

