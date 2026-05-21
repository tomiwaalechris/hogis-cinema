'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'react-qr-code';
import { 
  Film, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Ticket, 
  X, 
  Check,
  CreditCard,
  Mail,
  Printer,
  Popcorn,
  Search,
  Settings
} from 'lucide-react';
import { getMovies, INITIAL_MOVIES, Movie, generateSeats } from '@/lib/data';
import { cn } from '@/lib/utils';

// --- View States ---
type ViewState = 'HOME' | 'SEAT_SELECTION' | 'CHECKOUT' | 'RECEIPT' | 'MOVIES' | 'CONCESSIONS';

interface BookingDetails {
  movie: Movie | null;
  time: string | null;
  seats: string[];
  totalPrice: number;
  customerName?: string;
  email?: string;
  orderId?: string;
}

export default function Home() {
  const [view, setView] = useState<ViewState>('HOME');
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [booking, setBooking] = useState<BookingDetails>({
    movie: null,
    time: null,
    seats: [],
    totalPrice: 0,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMovies(getMovies());
  }, []);

  const goHome = () => {
    setView('HOME');
    setBooking({ movie: null, time: null, seats: [], totalPrice: 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={goHome}
          >
            <div className="w-12 h-12 bg-[#E50914] text-white flex items-center justify-center rounded-sm shadow-lg shadow-[#E50914]/20 group-hover:scale-105 transition-transform">
              <Film size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black tracking-tighter uppercase text-white leading-none">
                Hogis <span className="text-[#E50914]">Cinemas</span>
              </h1>
            </div>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400 uppercase tracking-widest">
            <button 
              onClick={() => { setView('HOME'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={cn("transition-colors pb-1", view === 'HOME' || view === 'SEAT_SELECTION' || view === 'CHECKOUT' || view === 'RECEIPT' ? "text-white border-b-2 border-[#E50914]" : "border-b-2 border-transparent hover:text-white")}
            >
              Schedule
            </button>
            <button 
              onClick={() => { setView('MOVIES'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={cn("transition-colors pb-1", view === 'MOVIES' ? "text-white border-b-2 border-[#E50914]" : "border-b-2 border-transparent hover:text-white")}
            >
              Movies
            </button>
            <button 
              onClick={() => { setView('CONCESSIONS'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={cn("transition-colors pb-1", view === 'CONCESSIONS' ? "text-white border-b-2 border-[#E50914]" : "border-b-2 border-transparent hover:text-white")}
            >
              Concessions
            </button>
            <a href="/admin" className="hover:text-white transition-colors pb-1 border-b-2 border-transparent flex items-center gap-1"><Settings size={14} /> Admin</a>
          </nav>

          <button className="hidden md:flex bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-neutral-200 transition-colors">
            Sign In
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {view === 'HOME' && movies.length > 0 && (
            <HomeView 
              key="home" 
              movies={movies}
              onSelectMovie={(movie, time) => {
                setBooking((prev) => ({ ...prev, movie, time }));
                setView('SEAT_SELECTION');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          )}
          {view === 'SEAT_SELECTION' && booking.movie && booking.time && (
            <SeatSelectionView 
              key="seats"
              booking={booking}
              onBack={() => setView('HOME')}
              onConfirm={(seats, price) => {
                setBooking((prev) => ({ ...prev, seats, totalPrice: price }));
                setView('CHECKOUT');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
          {view === 'CHECKOUT' && booking.seats.length > 0 && (
            <CheckoutView
              key="checkout"
              booking={booking}
              onBack={() => setView('SEAT_SELECTION')}
              onSuccess={(name, email) => {
                const orderId = `HC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
                
                const newOrder = {
                  id: orderId,
                  movie: booking.movie!,
                  time: booking.time!,
                  seats: booking.seats,
                  totalPrice: booking.totalPrice,
                  customerName: name,
                  email,
                  status: 'VALID' as const,
                  createdAt: new Date().toISOString()
                };
                
                if (typeof window !== 'undefined') {
                  const stored = JSON.parse(localStorage.getItem('hogis_orders') || '[]');
                  localStorage.setItem('hogis_orders', JSON.stringify([...stored, newOrder]));
                }

                setBooking((prev) => ({ 
                  ...prev, 
                  customerName: name, 
                  email,
                  orderId
                }));
                setView('RECEIPT');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
          {view === 'RECEIPT' && booking.orderId && (
            <ReceiptView
              key="receipt"
              booking={booking}
              onDone={goHome}
            />
          )}
          {view === 'MOVIES' && (
            <MoviesView 
              key="movies"
              movies={movies}
              onSelectMovie={(movie) => {
                setBooking((prev) => ({ ...prev, movie, time: movie.times[0] }));
                setView('SEAT_SELECTION');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
          {view === 'CONCESSIONS' && (
            <ConcessionsView key="concessions" />
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0A0A0A] border-t border-white/10 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
             <div className="w-8 h-8 bg-[#E50914] text-white flex items-center justify-center rounded-sm font-black italic tracking-tighter">
             H
            </div>
            <div>
              <p className="font-display text-lg font-black tracking-tighter uppercase text-white leading-none">Hogis <span className="text-[#E50914]">Cinemas</span></p>
            </div>
          </div>
          <p className="text-neutral-500 text-sm focus:outline-none">
            &copy; {new Date().getFullYear()} Hogis Cinemas. Your Ticket to Adventure.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// VIEWS
// ==========================================

function HomeView({ movies, onSelectMovie }: { movies: Movie[]; onSelectMovie: (m: Movie, t: string) => void }) {
  const featured = movies[0];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const allGenres = Array.from(new Set(movies.slice(1).flatMap(m => m.genre)));
  const filteredMovies = movies.slice(1).filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre ? movie.genre.includes(selectedGenre) : true;
    return matchesSearch && matchesGenre;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col pb-24"
    >
      {/* Featured Hero */}
      <div className="relative w-full h-[60vh] md:h-[75vh] min-h-[500px]">
        <div className="absolute inset-0">
          <Image 
            src={featured.backdropUrl} 
            alt={featured.title}
            fill
            className="object-cover object-top opacity-40 mix-blend-screen"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col md:flex-row gap-8 items-center md:items-end">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:block w-64 aspect-[2/3] relative rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-neutral-800"
            >
              <Image 
                src={featured.posterUrl} 
                alt={featured.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="flex-1 max-w-2xl">
             <span className="px-2 py-1 bg-[#E50914] text-[10px] font-bold uppercase tracking-wider rounded mb-2 inline-block text-white">
                Featured Tonight
              </span>
              <h2 className="text-5xl md:text-7xl font-display font-black uppercase text-white mb-4 leading-tight">
                {featured.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-neutral-300 mb-6">
                <span className="px-2 py-0.5 border border-neutral-700 rounded text-neutral-400">{featured.rating}</span>
                <span>{featured.duration}</span>
                <span className="flex items-center gap-1.5 text-neutral-400"><Popcorn size={16}/> {featured.genre.join(', ')}</span>
              </div>
              <p className="text-neutral-400 text-lg mb-8 line-clamp-3 max-w-xl">
                {featured.synopsis}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {featured.times.map(time => (
                  <button 
                    key={time}
                    onClick={() => onSelectMovie(featured, time)}
                    className="group relative px-6 py-3 bg-white text-black font-bold rounded-lg overflow-hidden hover:scale-105 transition-transform"
                  >
                    <div className="absolute inset-0 bg-[#E50914] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 group-hover:text-white transition-colors">{time}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-12 md:mt-24">
         <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2 shrink-0">
            <span className="w-1 h-4 bg-[#E50914]"></span>Today&apos;s Schedule
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141414] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#E50914] transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0 hide-scrollbar">
              <button
                onClick={() => setSelectedGenre(null)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors",
                  selectedGenre === null 
                    ? "bg-[#E50914] text-white" 
                    : "bg-[#222] text-gray-400 hover:text-white border border-white/5 hover:border-white/20"
                )}
              >
                All
              </button>
              {allGenres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors",
                    selectedGenre === genre 
                      ? "bg-[#E50914] text-white" 
                      : "bg-[#222] text-gray-400 hover:text-white border border-white/5 hover:border-white/20"
                  )}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {filteredMovies.length === 0 ? (
            <div className="bg-[#141414] border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <Film size={48} className="text-gray-700 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">No movies found</h4>
              <p className="text-sm text-gray-500">We couldn&apos;t find any movies matching your search criteria.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedGenre(null); }}
                className="mt-6 px-6 py-2 bg-[#E50914] text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:brightness-110 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredMovies.map((movie, idx) => (
            <motion.div 
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-[#141414] border border-white/5 rounded-xl overflow-hidden flex flex-col sm:flex-row items-center justify-between hover:border-[#E50914]/50 transition-colors p-4"
            >
              <div className="flex gap-4 items-center">
                <div className="w-16 h-24 sm:w-16 sm:h-24 relative overflow-hidden shrink-0 rounded bg-gray-800">
                <Image 
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent sm:hidden" />
              </div>
              <div className="p-6 flex flex-col justify-between flex-1 relative">
                <div>
                  <h4 className="text-2xl font-display font-bold text-white mb-2">{movie.title}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-neutral-400 mb-4">
                    <span className="border border-neutral-700 px-1.5 py-0.5 rounded">{movie.rating}</span>
                    <span>{movie.duration}</span>
                    <span>{movie.genre.join(', ')}</span>
                  </div>
                  <p className="text-sm text-neutral-500 line-clamp-2 md:line-clamp-3 mb-6">
                    {movie.synopsis}
                  </p>
                </div>
              </div>
              </div>
              <div className="flex flex-col sm:items-end flex-1 sm:pl-6 w-full sm:w-auto mt-4 sm:mt-0">
                <div className="flex flex-wrap gap-2">
                  {movie.times.map(time => (
                    <button 
                      key={time}
                      onClick={() => onSelectMovie(movie, time)}
                      className="px-4 py-2 border border-white/10 bg-[#222] rounded text-sm font-bold hover:bg-[#E50914] hover:text-white transition-colors"
                    >
                     {time}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )))}
        </div>
      </div>
    </motion.div>
  );
}

function SeatSelectionView({ 
  booking, 
  onBack, 
  onConfirm 
}: { 
  booking: BookingDetails; 
  onBack: () => void; 
  onConfirm: (seats: string[], price: number) => void;
}) {
  const [seats, setSeats] = useState(() => generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  const movie = booking.movie!;

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.isOccupied) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length >= 8) return; // Max 8 seats
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const seat = seats.find(s => s.id === seatId);
    return sum + (seat?.price || 0);
  }, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 lg:gap-12"
    >
      <div className="flex-1">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-8 transition-colors"
        >
          <X size={16} /> Cancel Booking
        </button>

        <h2 className="text-lg font-bold uppercase tracking-widest mb-2">Select Seats</h2>
        <p className="text-gray-400 mb-10 flex items-center gap-2">
          <Clock size={16}/> {booking.time} &bull; {movie.title}
        </p>

        {/* Screen layout */}
        <div className="w-full max-w-3xl mx-auto overflow-x-auto pb-8">
          <div className="min-w-[500px]">
             {/* The Screen */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#E50914] to-transparent rounded-full shadow-[0_0_15px_rgba(229,9,20,0.5)] mb-16 relative flex items-center justify-center">
              <span className="text-white/40 text-sm font-bold uppercase tracking-[0.5em] mt-8">Screen</span>
            </div>

            {/* Seat Grid */}
            <div className="flex flex-col gap-3">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(row => (
                <div key={row} className="flex items-center justify-center gap-2 md:gap-3">
                  <span className="w-6 text-center text-xs font-bold text-neutral-500">{row}</span>
                  <div className="flex gap-2 md:gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => {
                      // Add an aisle break
                      const isAisle = num === 3 || num === 10;
                      const seatId = `${row}${num}`;
                      const seat = seats.find(s => s.id === seatId);
                      const isPremium = seat?.price === 25;
                      const isOccupied = seat?.isOccupied;
                      const isSelected = selectedSeats.includes(seatId);

                      return (
                        <div key={seatId} className={cn("flex", isAisle && "ml-4 md:ml-8")}>
                          <button
                            disabled={isOccupied}
                            onClick={() => handleSeatClick(seatId)}
                            className={cn(
                              "w-8 h-8 md:w-10 md:h-10 rounded-sm transition-all relative overflow-hidden group",
                              isOccupied 
                                ? "bg-[#333] cursor-not-allowed opacity-50"
                                : isSelected
                                  ? "bg-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.5)] scale-110 z-10"
                                  : isPremium
                                    ? "bg-gray-800 hover:bg-[#E50914]/40 border-b-2 border-amber-500/50" 
                                    : "bg-gray-800 hover:bg-[#E50914]/40"
                            )}
                          >
                            <span className={cn(
                              "text-[10px] md:text-xs font-bold absolute inset-0 flex items-center justify-center transition-colors",
                              isSelected ? "text-white" : "text-transparent group-hover:text-white/50"
                            )}>
                              {num}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <span className="w-6 text-center text-xs font-bold text-neutral-500">{row}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 p-4 bg-[#141414] rounded-xl border border-white/5 text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-800 rounded-sm" />
            <span className="text-gray-400">Regular ($15)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-800 rounded-sm flex items-end justify-center border-b-2 border-amber-500/50" />
            <span className="text-gray-400">VIP Rows G-H ($25)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#E50914] rounded-sm" />
            <span className="text-white">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#333] rounded-sm opacity-50" />
            <span className="text-gray-500">Taken</span>
          </div>
        </div>
      </div>

      {/* Sidebar Summary */}
      <div className="w-full lg:w-[35%] shrink-0">
        <div className="bg-[#0F0F0F] border-l border-white/10 p-6 min-h-full flex flex-col">
           <div className="flex justify-between items-start text-xs text-gray-500 uppercase tracking-widest mb-4">
             <span>Booking Summary</span>
           </div>

           <div className="space-y-3 mt-auto border-t border-white/10 pt-6">
             <div className="flex justify-between text-sm">
               <span className="text-gray-400">Seats ({selectedSeats.length})</span>
               <span className="font-bold uppercase">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</span>
             </div>
             {selectedSeats.length > 0 && (
               <div className="flex justify-between text-sm">
                 <span className="text-gray-400">Total Price</span>
                 <span className="font-bold">${totalPrice.toFixed(2)}</span>
               </div>
             )}
           </div>
           
           <div className="flex justify-between text-lg font-black border-t border-white/5 pt-4">
             <span>TOTAL</span>
             <span className="text-[#E50914]">${totalPrice.toFixed(2)}</span>
           </div>

           <button
             disabled={selectedSeats.length === 0}
             onClick={() => onConfirm(selectedSeats, totalPrice)}
             className="w-full bg-[#E50914] text-white py-4 rounded-xl mt-8 font-black uppercase tracking-widest text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
           >
             Continue to Payment
           </button>
        </div>
      </div>
    </motion.div>
  );
}

function CheckoutView({
  booking,
  onBack,
  onSuccess
}: {
  booking: BookingDetails;
  onBack: () => void;
  onSuccess: (name: string, email: string) => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const movie = booking.movie!;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(name, email);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row gap-12"
    >
       <div className="flex-1">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-8 transition-colors"
        >
          <X size={16} /> Back to Seats
        </button>

        <h2 className="text-3xl font-display font-bold text-white mb-8">Secure Checkout</h2>

        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Full Name</label>
                <input required name="name" type="text" placeholder="John Doe" className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] rounded-lg px-4 py-3 text-white outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Email Address</label>
                <input required name="email" type="email" placeholder="john@example.com" className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] rounded-lg px-4 py-3 text-white outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 my-6" />

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
               Payment Details <CreditCard size={18} className="text-neutral-500" />
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Card Number</label>
                <input required type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] rounded-lg px-4 py-3 text-white outline-none transition-all font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Expiry (MM/YY)</label>
                  <input required type="text" placeholder="MM/YY" maxLength={5} className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] rounded-lg px-4 py-3 text-white outline-none transition-all font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">CVV</label>
                  <input required type="text" placeholder="123" maxLength={4} className="w-full bg-[#141414] border border-white/10 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] rounded-lg px-4 py-3 text-white outline-none transition-all font-mono" />
                </div>
              </div>
            </div>
          </div>
        </form>

      </div>

      <div className="w-full md:w-80 shrink-0">
         <div className="bg-[#0F0F0F] border-l border-white/10 p-6 min-h-full flex flex-col">
           <div className="flex justify-between items-start text-xs text-gray-500 uppercase tracking-widest mb-4">
             <span>Booking Summary</span>
           </div>

           <div className="flex gap-4 mb-6">
              <div className="aspect-[2/3] w-16 relative rounded-md overflow-hidden shrink-0">
                <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h4 className="font-display font-bold text-white leading-tight mb-1">{movie.title}</h4>
                <p className="text-neutral-400 text-xs">{booking.time} &bull; English 2D</p>
              </div>
           </div>

           <div className="space-y-3 mt-auto border-t border-white/10 pt-6">
             <div className="flex justify-between text-sm">
               <span className="text-gray-400">Tickets ({booking.seats.length})</span>
               <span className="font-bold uppercase">${booking.totalPrice.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-gray-400">Taxes & Fees</span>
               <span className="font-bold uppercase">$3.50</span>
             </div>
           </div>

           <div className="flex justify-between text-lg font-black border-t border-white/5 pt-4 mt-4">
             <span>TOTAL</span>
             <span className="text-[#E50914]">${(booking.totalPrice + 3.5).toFixed(2)}</span>
           </div>

           <button
             type="submit"
             form="checkout-form"
             disabled={isProcessing}
             className="w-full bg-[#E50914] text-white py-4 rounded-xl mt-8 font-black uppercase tracking-widest text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
           >
             {isProcessing ? (
               <span className="animate-pulse">Processing Payment...</span>
             ) : (
               <>Pay ${(booking.totalPrice + 3.5).toFixed(2)}</>
             )}
           </button>
           <p className="text-center text-xs text-neutral-500 mt-4 flex justify-center items-center gap-1">
              <Ticket size={14} /> Payments are secure & encrypted
           </p>
         </div>
      </div>
    </motion.div>
  );
}

function ReceiptView({
  booking,
  onDone
}: {
  booking: BookingDetails;
  onDone: () => void;
}) {
  const [emailSent, setEmailSent] = useState(false);
  const movie = booking.movie!;

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <motion.div 
       initial={{ opacity: 0, scale: 0.95 }}
       animate={{ opacity: 1, scale: 1 }}
       className="flex-1 w-full flex items-center justify-center p-4 md:p-8"
    >
      <div className="max-w-md w-full relative">
        {/* Toast for email */}
        <AnimatePresence>
          {emailSent && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute -top-16 left-0 right-0 py-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-center font-bold text-sm"
            >
               Receipt sent to {booking.email}
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Ticket / Receipt */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl relative" id="printable-receipt">
           {/* Perforated top edge simulation */}
           <div className="h-4 w-full bg-[#0A0A0A] flex space-x-2 -mt-2 px-2 overflow-hidden items-end pb-1 opacity-20">
             {[...Array(20)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#0A0A0A] rounded-full shrink-0 translate-y-1/2" />
             ))}
           </div>
           
           <div className="p-8 text-black">
              <div className="flex flex-col items-center mb-8 text-center pt-2">
                <div className="w-12 h-12 bg-[#E50914] text-white flex items-center justify-center rounded-sm mb-4">
                  <Film size={24} strokeWidth={2.5} />
                </div>
                <h1 className="font-display text-3xl font-black tracking-tighter uppercase text-neutral-900 leading-none">
                  Hogis <span className="text-[#E50914]">Cinemas</span>
                </h1>
                <div className="mt-4 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                   <Check size={14} /> Booking Confirmed
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Movie</p>
                  <p className="text-xl font-display font-bold text-neutral-900">{movie.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Date & Time</p>
                    <p className="font-bold text-neutral-800">Today, {booking.time}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Seats</p>
                    <p className="font-bold text-neutral-800">{booking.seats.join(', ')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Order ID</p>
                    <p className="font-mono text-sm font-bold text-neutral-800">{booking.orderId}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Total Paid</p>
                    <p className="font-bold text-neutral-800">${(booking.totalPrice + 3.5).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="mt-10 flex flex-col items-center">
                 <div className="w-40 h-40 bg-white p-2 flex items-center justify-center">
                    <QRCode value={booking.orderId || ''} size={144} />
                 </div>
                 <p className="text-[10px] font-mono text-neutral-500 mt-2">{booking.orderId} • SCAN AT ENTRANCE</p>
              </div>
           </div>

           {/* Perforated bottom edge simulation */}
           <div className="h-4 w-full bg-[#0A0A0A] flex space-x-2 -bottom-2 px-2 overflow-hidden absolute rotate-180 opacity-20">
             {[...Array(20)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#0A0A0A] rounded-full shrink-0 translate-y-1/2" />
             ))}
           </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handlePrint}
            className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Printer size={18} /> Print Ticket
          </button>
          <button 
            onClick={handleEmail}
            className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Mail size={18} /> Email Receipt
          </button>
        </div>
        
        <button 
           onClick={onDone}
           className="w-full py-3 mt-3 text-neutral-400 hover:text-white font-medium transition-colors text-sm"
        >
          Return to Home
        </button>
      </div>
    </motion.div>
  );
}

function MoviesView({ movies, onSelectMovie }: { movies: Movie[]; onSelectMovie: (m: Movie) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 md:px-8 py-12 w-full"
    >
      <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter mb-8 text-white">
        Now <span className="text-[#E50914]">Showing</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {movies.map(movie => (
          <div key={movie.id} className="group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1A1A1A] mb-4">
              <Image 
                src={movie.posterUrl} 
                alt={movie.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 p-4">
                 <button 
                   onClick={() => onSelectMovie(movie)} 
                   className="w-full px-6 py-3 bg-[#E50914] text-white font-bold uppercase tracking-widest text-xs rounded hover:brightness-110 transition-colors"
                 >
                   Book Now
                 </button>
                 <p className="text-xs text-white text-center font-medium opacity-80 leading-snug line-clamp-4">
                    {movie.synopsis}
                 </p>
              </div>
            </div>
            <h3 className="font-bold text-lg leading-tight mb-1 uppercase text-white">{movie.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="border border-white/20 px-1.5 rounded text-[10px] uppercase font-bold">{movie.rating}</span>
               • {movie.duration}
            </div>
            <p className="text-xs text-gray-500 mt-1">{movie.genre.join(', ')}</p>
          </div>
        ))}
      </div>

      <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter mb-8 text-white mt-16">
        Coming <span className="text-[#E50914]">Soon</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { title: "Deadpool & Wolverine", desc: "Action, Comedy", cover: "https://picsum.photos/seed/dp3/400/600" },
           { title: "Gladiator 2", desc: "Action, Drama", cover: "https://picsum.photos/seed/glad2/400/600" },
           { title: "Joker: Folie à Deux", desc: "Crime, Drama", cover: "https://picsum.photos/seed/joker2/400/600" },
           { title: "Nosferatu", desc: "Horror, Mystery", cover: "https://picsum.photos/seed/nosf/400/600" }
         ].map((mock, idx) => (
           <div key={idx} className="group">
             <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1A1A1A] mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
               <Image src={mock.cover} alt={mock.title} fill className="object-cover" referrerPolicy="no-referrer" />
               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A0A0A] to-transparent p-4">
                 <span className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider rounded">Trailer</span>
               </div>
             </div>
             <h3 className="font-bold text-lg leading-tight mb-1 uppercase text-white">{mock.title}</h3>
             <p className="text-sm text-gray-500">{mock.desc}</p>
           </div>
         ))}
      </div>
    </motion.div>
  );
}

function ConcessionsView() {
  const menus = [
    {
      category: 'Combos',
      items: [
        { name: 'Couples Combo', desc: '1 Large Popcorn, 2 Medium Drinks', price: '$18.99' },
        { name: 'Family Pack', desc: '2 Large Popcorns, 4 Medium Drinks, 2 Candies', price: '$34.99' },
        { name: 'Solo Snack', desc: '1 Regular Popcorn, 1 Regular Drink', price: '$10.99' },
      ]
    },
    {
      category: 'Popcorn',
      items: [
         { name: 'Small Popcorn', desc: 'Classic buttered popcorn', price: '$6.50' },
         { name: 'Medium Popcorn', desc: 'Classic buttered popcorn', price: '$7.50' },
         { name: 'Large Popcorn', desc: 'Free refills!', price: '$8.50' },
         { name: 'Caramel Crunch', desc: 'Sweet caramel coated', price: '$9.00' },
      ]
    },
    {
       category: 'Drinks & Snacks',
       items: [
         { name: 'Fountain Drink', desc: 'Coca-Cola, Sprite, Diet Coke (Large)', price: '$5.50' },
         { name: 'Bottled Water', desc: 'Dasani 20oz', price: '$4.50' },
         { name: 'Nachos', desc: 'With jalapeños and cheese', price: '$7.00' },
         { name: 'Hot Dog', desc: 'All beef frank', price: '$6.00' },
       ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto px-4 md:px-8 py-12 w-full mb-16"
    >
      <div className="text-center mb-16 max-w-2xl mx-auto mt-8">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">
          Snacks & <span className="text-[#E50914]">Drinks</span>
        </h2>
        <p className="text-gray-400">Order your favorite cinema snacks directly from your seat or the lobby kiosk. Skip the queue and enjoy the show.</p>
      </div>

      <div className="space-y-16">
        {menus.map(menu => (
          <div key={menu.category}>
             <h3 className="text-2xl font-bold uppercase tracking-widest flex items-center gap-3 mb-8 text-white">
               <span className="w-1.5 h-6 bg-[#E50914]"></span>{menu.category}
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {menu.items.map(item => (
                 <div key={item.name} className="bg-[#141414] border border-white/5 p-6 rounded-xl flex justify-between items-center hover:border-white/20 transition-colors shadow-lg">
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-white uppercase">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <div className="text-xl font-black text-[#E50914] whitespace-nowrap pl-4">
                      {item.price}
                    </div>
                 </div>
               ))}
             </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
