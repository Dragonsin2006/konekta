import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuthGuard } from '../hooks/useAuthGuard';

const notificationFeed = [
  {
    id: 'n1',
    avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
    title: 'Anny liked your post ❤️',
    time: '2m ago',
    type: 'likes',
  },
  {
    id: 'n2',
    avatar: 'https://randomuser.me/api/portraits/men/40.jpg',
    title: 'Michael mentioned you in a comment “Nice!” 💬',
    time: '12m ago',
    type: 'mentions',
  },
  {
    id: 'n3',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    title: 'Aisha shared your festival recap 🔗',
    time: '25m ago',
    type: 'shares',
  },
  {
    id: 'n4',
    avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
    title: 'Kiara dropped a reaction on your neon story 🔥',
    time: '45m ago',
    type: 'reactions',
  },
];

const requestSeed = [
  {
    id: 'req1',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    title: 'Ash sent a match request 💌',
    status: 'pending',
  },
  {
    id: 'req2',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    title: 'Meera wants to follow you 👀',
    status: 'pending',
  },
];

const suggestedProfiles = [
  {
    id: 's1',
    name: 'Chandni',
    role: 'AR Design @ FIT',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
  },
  {
    id: 's2',
    name: 'Neil',
    role: 'Product Club Lead',
    avatar: 'https://randomuser.me/api/portraits/men/21.jpg',
  },
  {
    id: 's3',
    name: 'Reva',
    role: 'Campus DJ',
    avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
  },
];

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'mentions', label: 'Mentions' },
  { id: 'likes', label: 'Likes' },
  { id: 'shares', label: 'Shares' },
];

const Notifications = () => {
  useAuthGuard();
  const [requests, setRequests] = useState(requestSeed);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    document.title = 'Konekta | Notifications';
  }, []);

  const filteredNotifications =
    activeFilter === 'all'
      ? notificationFeed
      : notificationFeed.filter((notif) => notif.type === activeFilter);

  const handleRequestAction = (id, status) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
            }
          : request,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      <Sidebar />
      <main className="flex-1 px-4 lg:px-12 py-10 flex flex-col lg:flex-row gap-8">
        <section className="flex-1 space-y-8">
          <header>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Stream</p>
            <h1 className="text-3xl font-poppins font-semibold">Notifications</h1>
          </header>

          <div className="flex flex-wrap gap-3">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  activeFilter === tab.id
                    ? 'bg-gradient-to-r from-[#FF007A] to-[#00F5FF] text-black border-transparent'
                    : 'border-[#2a2a2a] bg-[#111]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredNotifications.map((notif) => (
              <article
                key={notif.id}
                className="flex items-center gap-4 p-4 rounded-3xl border border-[#1f1f1f] bg-black/60 hover:border-[#FF007A55]"
              >
                <img src={notif.avatar} alt={notif.title} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm">{notif.title}</p>
                  <p className="text-xs text-gray-500">{notif.time}</p>
                </div>
                <button type="button" className="text-sm text-[#FF007A]">
                  View
                </button>
              </article>
            ))}
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Requests</h2>
              <button type="button" className="text-xs uppercase tracking-[0.3em] text-gray-500">
                See all
              </button>
            </div>

            <div className="space-y-3">
              {requests.map((request) => (
                <article key={request.id} className="flex items-center justify-between p-4 border border-[#1f1f1f] rounded-3xl">
                  <div className="flex items-center gap-3">
                    <img src={request.avatar} alt={request.title} className="w-12 h-12 rounded-full object-cover" />
                    <p className="text-sm">{request.title}</p>
                  </div>
                  {request.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleRequestAction(request.id, 'accepted')}
                        className="px-3 py-1 rounded-full bg-[#FF007A] text-xs font-semibold"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRequestAction(request.id, 'declined')}
                        className="px-3 py-1 rounded-full bg-[#1a1a1a] border border-[#333] text-xs"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`text-xs font-semibold ${
                        request.status === 'accepted' ? 'text-[#00F5FF]' : 'text-gray-500'
                      }`}
                    >
                      {request.status === 'accepted' ? 'Accepted' : 'Declined'}
                    </span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <aside className="w-full lg:w-96 space-y-6">
          <div className="bg-black/70 border border-[#1f1f1f] rounded-3xl p-6">
            <h3 className="text-lg font-semibold mb-4">Your vibe summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-[#111] border border-[#1f1f1f] text-center">
                <p className="text-2xl font-bold">145</p>
                <p className="text-gray-400">Mentions</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#111] border border-[#1f1f1f] text-center">
                <p className="text-2xl font-bold">34</p>
                <p className="text-gray-400">New follows</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#111] border border-[#1f1f1f] text-center">
                <p className="text-2xl font-bold">87</p>
                <p className="text-gray-400">Shares</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#111] border border-[#1f1f1f] text-center">
                <p className="text-2xl font-bold">23</p>
                <p className="text-gray-400">Requests</p>
              </div>
            </div>
          </div>

          <div className="bg-black/70 border border-[#1f1f1f] rounded-3xl p-6">
            <h3 className="text-lg font-semibold mb-4">Recommended Profiles</h3>
            <div className="space-y-4">
              {suggestedProfiles.map((profile) => (
                <div key={profile.id} className="flex items-center gap-3">
                  <img src={profile.avatar} alt={profile.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold">{profile.name}</p>
                    <p className="text-xs text-gray-400">{profile.role}</p>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-full border border-[#333] text-xs hover:border-[#FF007A]"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Notifications;

