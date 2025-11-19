import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/feed', iconClass: 'fa-solid fa-house' },
  { label: 'Search', to: '/feed', iconClass: 'fa-solid fa-magnifying-glass' },
  { label: 'Explore', to: '/feed', iconClass: 'fa-regular fa-compass' },
  { label: 'Reels', to: '/reels', iconClass: 'fa-solid fa-clapperboard' },
  { label: 'Messages', to: '/messenger', iconClass: 'fa-regular fa-envelope', badge: '8' },
  { label: 'Notifications', to: '/notifications', iconClass: 'fa-regular fa-bell' },
  { label: 'Create', to: '/profile', iconClass: 'fa-regular fa-square-plus' },
  { label: 'Profile', to: '/profile', iconClass: 'fa-regular fa-user' },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col items-center bg-[#121212] min-h-screen pt-6 pb-8 gap-6 w-20 hover:w-60 transition-all duration-300 border-r border-[#1f1f1f]">
      <img
        src="https://randomuser.me/api/portraits/women/44.jpg"
        alt="Profile avatar"
        className="w-16 h-16 rounded-full border-4 border-[#FF007A] object-cover transition-transform duration-300 hover:scale-110"
      />

      <nav className="flex flex-col gap-3 w-full px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              [
                'flex items-center justify-center lg:justify-start gap-3 text-white font-semibold rounded-2xl px-3 py-2 transition-all',
                isActive
                  ? 'bg-gradient-to-r from-[#FF007A] via-[#A200FF] to-[#00F5FF] text-black shadow-lg shadow-[#FF007A55]'
                  : 'hover:bg-[#1f1f1f]',
              ].join(' ')
            }
          >
            <i className={`${item.iconClass} text-xl`} />
            <span className="hidden lg:inline">{item.label}</span>
            {item.badge && (
              <span className="ml-auto text-xs font-bold text-white bg-[#FF007A] px-2 py-0.5 rounded-full shadow hidden lg:inline">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center lg:justify-start gap-3 text-white font-semibold rounded-2xl px-3 py-2 transition-all hover:bg-[#1f1f1f]"
        >
          <i className="fa-solid fa-right-from-bracket text-xl" />
          <span className="hidden lg:inline">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
