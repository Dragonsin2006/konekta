import { useEffect, useMemo, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuthGuard } from '../hooks/useAuthGuard';

const formatTime = (date) =>
  date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

const makeId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const conversationData = {
  'Michael Daws': [
    { type: 'received', text: "Hey there! How's it going?", time: '10:30 AM' },
    { type: 'sent', text: 'Pretty good! Just finished some work. How about you?', time: '10:32 AM', id: 'm1' },
    { type: 'received', text: "I'm doing great! Just got back from a hike. The views were amazing!", time: '10:35 AM' },
    { type: 'sent', text: 'That sounds awesome! Where did you go?', time: '10:36 AM', id: 'm2' },
    { type: 'received', text: 'Up to the Blue Ridge trail. You should definitely check it out sometime!', time: '10:40 AM' },
    { type: 'received', text: "I was thinking maybe we could go together next weekend?", time: '10:45 AM' },
    { type: 'sent', text: 'Wow, that view is incredible! 😍', time: '10:47 AM', id: 'm3' },
    { type: 'sent', text: "I'd love to go hiking next weekend! Saturday works best for me.", time: '10:48 AM', id: 'm4' },
    { type: 'received', text: "Perfect! Saturday it is then. I'll send you the details later this week.", time: '10:50 AM' },
  ],
  'Laura Quinn': [
    { type: 'received', text: 'Hey, are we still meeting today?', time: '09:15 AM' },
    { type: 'sent', text: "Yes, definitely! I'll be there at 6 PM.", time: '09:20 AM', id: 'l1' },
    { type: 'received', text: 'Great! Looking forward to it. Should I bring anything?', time: '09:22 AM' },
    { type: 'sent', text: "Just yourself! I've got everything covered.", time: '09:25 AM', id: 'l2' },
  ],
  'Anjali Mehra': [
    { type: 'received', text: 'Thanks again for recommending that restaurant!', time: '07:15 PM' },
    { type: 'sent', text: 'You’re welcome! Did you enjoy it?', time: '07:20 PM', id: 'a1' },
    { type: 'received', text: 'It was amazing! The food was delicious and the ambiance was perfect.', time: '07:25 PM' },
    { type: 'sent', text: "I'm glad you liked it! We should go together sometime.", time: '07:30 PM', id: 'a2' },
  ],
  'Rahul Sharma': [
    { type: 'received', text: 'Hey, are you free this weekend?', time: '06:10 PM' },
    { type: 'sent', text: 'I should be! What did you have in mind?', time: '06:15 PM', id: 'r1' },
    { type: 'received', text: 'I was thinking we could check out that new art exhibition.', time: '06:20 PM' },
    { type: 'sent', text: "Sounds great! Let's plan for Saturday afternoon.", time: '06:25 PM', id: 'r2' },
  ],
  'Priya Nair': [
    { type: 'received', text: 'The meeting is confirmed for tomorrow at 10 AM.', time: '04:20 PM' },
    { type: 'sent', text: "Great! I'll make sure to prepare the presentation tonight.", time: '04:25 PM', id: 'p1' },
    { type: 'received', text: "Don't forget to include the Q3 metrics.", time: '04:30 PM' },
    { type: 'sent', text: "Will do! I've already added the preliminary numbers.", time: '04:35 PM', id: 'p2' },
  ],
  'Aman Verma': [
    { type: 'received', text: 'Can you send me the project files when you get a chance?', time: '03:15 PM' },
    { type: 'sent', text: "Sure thing! I'll email them to you in a few minutes.", time: '03:20 PM', id: 'av1' },
    { type: 'received', text: 'Thanks! I need to review them before the client meeting.', time: '03:25 PM' },
  ],
};

const contactList = [
  {
    name: 'Michael Daws',
    avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    preview: 'Perfect! Saturday it is.',
    unread: 2,
    status: 'Active now',
  },
  {
    name: 'Laura Quinn',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    preview: 'See you at 6 PM!',
    unread: 0,
    status: 'Active 20m ago',
  },
  {
    name: 'Anjali Mehra',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    preview: "I'd love that! How about next Friday?",
    unread: 1,
    status: 'Typing…',
  },
  {
    name: 'Rahul Sharma',
    avatar: 'https://randomuser.me/api/portraits/men/48.jpg',
    preview: 'Perfect! I’ll get the tickets.',
    unread: 0,
    status: 'Active 2h ago',
  },
  {
    name: 'Priya Nair',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    preview: 'Remember to add Q3 metrics.',
    unread: 0,
    status: 'Active 1h ago',
  },
  {
    name: 'Aman Verma',
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    preview: 'Need the project files asap.',
    unread: 3,
    status: 'Active now',
  },
];

const Messenger = () => {
  useAuthGuard();
  const [threads, setThreads] = useState(conversationData);
  const [activeUser, setActiveUser] = useState(Object.keys(conversationData)[0]);
  const [search, setSearch] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [optionsMenu, setOptionsMenu] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messageAreaRef = useRef(null);

  useEffect(() => {
    document.title = 'Konekta | Messenger';
  }, []);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [threads, activeUser]);

  const filteredContacts = useMemo(
    () =>
      contactList.filter((contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const activeMessages = threads[activeUser] ?? [];

  const toggleOptions = (messageId) => {
    setOptionsMenu((prev) => (prev === messageId ? null : messageId));
  };

  const handleCopyMessage = async (messageId) => {
    const target = activeMessages.find((msg) => msg.id === messageId);
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target.text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 1500);
    } catch {
      console.warn('Clipboard not available');
    }
    setOptionsMenu(null);
  };

  const startEditing = (messageId) => {
    const target = activeMessages.find((msg) => msg.id === messageId);
    if (!target) return;
    setEditingMessageId(messageId);
    setEditingText(target.text);
    setOptionsMenu(null);
  };

  const saveEdit = () => {
    if (!editingMessageId) return;
    setThreads((prev) => ({
      ...prev,
      [activeUser]: prev[activeUser].map((msg) =>
        msg.id === editingMessageId ? { ...msg, text: editingText, time: `${formatTime(new Date())} (edited)` } : msg,
      ),
    }));
    setEditingMessageId(null);
    setEditingText('');
  };

  const deleteMessage = (messageId) => {
    setThreads((prev) => ({
      ...prev,
      [activeUser]: prev[activeUser].filter((msg) => msg.id !== messageId),
    }));
    setOptionsMenu(null);
  };

  const handleSend = () => {
    const text = messageInput.trim();
    if (!text) return;
    const newMessage = { id: makeId(), type: 'sent', text, time: formatTime(new Date()) };
    setThreads((prev) => {
      const nextMessages = [...(prev[activeUser] || []), newMessage];
      return { ...prev, [activeUser]: nextMessages };
    });
    setMessageInput('');

    setTimeout(() => {
      setThreads((prev) => {
        const existing = prev[activeUser] || [];
        const replyPool =
          existing.filter((msg) => msg.type === 'received').map((msg) => msg.text) ||
          contactList.map((contact) => `Thinking about ${contact.name} right now.`);
        const reply =
          replyPool[Math.floor(Math.random() * replyPool.length)] || 'Sounds interesting!';
        const replyMsg = { id: makeId(), type: 'received', text: reply, time: formatTime(new Date()) };
        return {
          ...prev,
          [activeUser]: [...existing, replyMsg],
        };
      });
    }, 1000 + Math.random() * 1500);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:flex-row gap-6 px-4 lg:px-8 py-6">
        <section className="lg:w-1/3 bg-black/70 border border-[#1f1f1f] rounded-3xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Messages</h2>
            <button
              type="button"
              className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FF007A] to-[#A200FF] text-sm font-semibold"
            >
              New Chat
            </button>
          </div>
          <div className="relative mb-4">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search friends, clubs..."
              className="w-full bg-[#111] border border-transparent focus:border-[#FF007A] rounded-full py-3 pl-12 pr-4 text-sm text-white"
            />
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
            {filteredContacts.map((contact) => (
              <button
                key={contact.name}
                type="button"
                onClick={() => {
                  setActiveUser(contact.name);
                  setOptionsMenu(null);
                  setEditingMessageId(null);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition ${
                  activeUser === contact.name ? 'bg-[#1a1a1a] border border-[#FF007A44]' : 'bg-[#111]'
                }`}
              >
                <div className="relative">
                  <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#111] bg-[#00F5FF]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{contact.name}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{contact.preview}</p>
                </div>
                {contact.unread > 0 && (
                  <span className="text-xs font-bold bg-[#FF007A] rounded-full px-2 py-0.5">{contact.unread}</span>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="flex-1 bg-black/70 border border-[#1f1f1f] rounded-3xl flex flex-col">
          <header className="flex items-center gap-4 border-b border-[#1f1f1f] px-6 py-4">
            <img
              src={contactList.find((c) => c.name === activeUser)?.avatar}
              alt={activeUser}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold">{activeUser}</p>
              <p className="text-xs text-gray-400">{contactList.find((c) => c.name === activeUser)?.status}</p>
            </div>
            <div className="flex gap-3 text-gray-400">
              <button type="button" className="w-10 h-10 rounded-full border border-[#333]">
                <i className="fa-regular fa-bell" />
              </button>
              <button type="button" className="w-10 h-10 rounded-full border border-[#333]">
                <i className="fa-solid fa-ellipsis" />
              </button>
            </div>
          </header>

          <div ref={messageAreaRef} className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-4">
            {activeMessages.map((message) => (
              <div key={message.id ?? Math.random()} className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed relative ${
                    message.type === 'sent'
                      ? 'bg-gradient-to-r from-[#FF007A] to-[#A200FF]'
                      : 'bg-[#111] border border-[#1f1f1f]'
                  }`}
                >
                  {message.type === 'sent' && message.id && (
                    <div className="absolute -top-2 -right-2">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-lg"
                        onClick={() => toggleOptions(message.id)}
                      >
                        {copiedMessageId === message.id ? '✓' : '⋯'}
                      </button>
                      {optionsMenu === message.id && (
                        <div className="absolute right-0 mt-2 bg-[#0c0c0c] border border-[#1f1f1f] rounded-2xl shadow-2xl w-36 text-left">
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(message.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 flex items-center gap-2"
                          >
                            <i className="fa-regular fa-copy" /> Copy
                          </button>
                          <button
                            type="button"
                            onClick={() => startEditing(message.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 flex items-center gap-2"
                          >
                            <i className="fa-regular fa-pen-to-square" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteMessage(message.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 flex items-center gap-2 text-red-400"
                          >
                            <i className="fa-regular fa-trash-can" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {editingMessageId === message.id ? (
                    <input
                      value={editingText}
                      onChange={(event) => setEditingText(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') saveEdit();
                        if (event.key === 'Escape') setEditingMessageId(null);
                      }}
                      className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-white text-sm"
                    />
                  ) : (
                    <p>{message.text}</p>
                  )}
                  <span className="block text-[11px] text-gray-200/70 mt-2">{message.time}</span>
                  {editingMessageId === message.id && (
                    <div className="flex gap-2 mt-2 text-xs">
                      <button type="button" onClick={saveEdit} className="px-3 py-1 rounded-full bg-black/40">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingMessageId(null)}
                        className="px-3 py-1 rounded-full bg-black/20 text-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <footer className="border-t border-[#1f1f1f] px-6 py-4 flex items-center gap-3">
            <button type="button" className="w-11 h-11 rounded-full bg-[#111] border border-[#333] text-xl text-gray-400">
              <i className="fa-solid fa-paperclip" />
            </button>
            <textarea
              value={messageInput}
              onChange={(event) => setMessageInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 resize-none bg-[#111] border border-transparent focus:border-[#FF007A] rounded-2xl px-4 py-3 text-sm text-white"
            />
            <button
              type="button"
              onClick={handleSend}
              className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#FF007A] to-[#00F5FF] text-lg flex items-center justify-center"
            >
              <i className="fa-solid fa-paper-plane" />
            </button>
          </footer>
        </section>
      </div>
    </div>
  );
};

export default Messenger;

