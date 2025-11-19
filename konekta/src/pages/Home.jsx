import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Stories',
    description: 'Instantly share neon-laced stories and keep your circle in the loop.',
    glow: 'shadow-[0_0_20px_#A200FF55]',
  },
  {
    title: 'Swipe Cards',
    description: 'Discover new matches with Tinder-style cards built for campus vibes.',
    glow: 'shadow-[0_0_20px_#FF007A55]',
  },
  {
    title: 'Chats',
    description: 'Slide into colorful, real-time chats and keep every convo flowing.',
    glow: 'shadow-[0_0_20px_#00F5FF55]',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <main className="flex flex-col md:flex-row items-center justify-center gap-16 px-6 lg:px-12 py-16 lg:py-24 w-full max-w-6xl mx-auto">
        <div className="text-center md:text-left space-y-6 max-w-xl">
          <p className="uppercase tracking-[0.4em] text-xs text-gray-400">Konekta</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-poppins font-bold bg-gradient-to-r from-[#FF007A] via-[#A200FF] to-[#00F5FF] bg-clip-text text-transparent">
            Swipe. Share. Spark.
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Connect, explore, and share your college experience on Konekta. Find matches, swap stories,
            and spark meaningful friendships in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link
              to="/login"
              className="flex-1 text-center font-semibold font-poppins py-3 rounded-full bg-gradient-to-r from-[#FF007A] via-[#E900B5] to-[#00F5FF] shadow-[0_10px_40px_#A200FF55] hover:scale-[1.01] transition-transform"
            >
              Log-In to Continue
            </Link>
            <Link
              to="/signup"
              className="flex-1 text-center font-semibold font-poppins py-3 rounded-full border border-[#FF007A] hover:bg-[#FF007A22] transition-colors"
            >
              Sign Up to Get Started
            </Link>
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <img
            src="/hero.jpg"
            alt="Konekta preview"
            className="rounded-[36px] w-full shadow-[0_0_70px_#A200FF55]"
          />
        </div>
      </main>

      <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 pb-16">
        {features.map((feature) => (
          <article
            key={feature.title}
            className={`bg-[#111111] rounded-3xl p-6 text-center border border-[#1f1f1f] ${feature.glow}`}
          >
            <h2 className="text-2xl font-poppins font-bold mb-3 bg-gradient-to-r from-[#FF007A] via-[#A200FF] to-[#00F5FF] bg-clip-text text-transparent">
              {feature.title}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
          </article>
        ))}
      </section>

      <footer className="text-center py-8 text-gray-500 text-sm tracking-wide">
        © {new Date().getFullYear()} Konekta. Designed for campus connection.
      </footer>
    </div>
  );
};

export default Home;

