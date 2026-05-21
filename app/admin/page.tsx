'use client';

import { useState, useEffect, useMemo } from 'react';
import { Movie, getMovies, saveMovies, INITIAL_MOVIES } from '@/lib/data';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Settings, MonitorPlay, Ticket, Activity, Plus, Edit2, Save, X, Trash2, ShieldAlert, ScanLine, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type AdminTab = 'CONTENT' | 'BOX_OFFICE' | 'SCAN';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('CONTENT');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0F0F0F] border-r border-white/10 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#E50914] text-white flex items-center justify-center rounded-sm font-black italic tracking-tighter">
             H
            </div>
            <div>
              <p className="font-display text-sm font-black tracking-tighter uppercase leading-none">Hogis <span className="text-[#E50914]">Admin</span></p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('CONTENT')}
            className={cn(
               "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors",
               activeTab === 'CONTENT' ? "bg-[#1A1A1A] text-white border border-white/10" : "text-gray-500 hover:text-white"
            )}
          >
            <MonitorPlay size={18} /> Content
          </button>
          <button
            onClick={() => setActiveTab('BOX_OFFICE')}
            className={cn(
               "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors",
               activeTab === 'BOX_OFFICE' ? "bg-[#1A1A1A] text-white border border-white/10" : "text-gray-500 hover:text-white"
            )}
          >
            <Ticket size={18} /> Box Office
          </button>
          <button
            onClick={() => setActiveTab('SCAN')}
            className={cn(
               "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors",
               activeTab === 'SCAN' ? "bg-[#1A1A1A] text-white border border-white/10" : "text-gray-500 hover:text-white"
            )}
          >
            <ScanLine size={18} /> Scan Tickets
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500">
             <Settings size={18} /> Settings
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0">
         <header className="h-16 px-8 flex items-center justify-between border-b border-white/10 md:hidden bg-[#0F0F0F]">
            <p className="font-display text-sm font-black tracking-tighter uppercase leading-none">Hogis <span className="text-[#E50914]">Admin</span></p>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-wider overflow-x-auto">
               <button onClick={() => setActiveTab('CONTENT')} className={activeTab === 'CONTENT' ? 'text-[#E50914] shrink-0' : 'text-gray-500 shrink-0'}>Content</button>
               <button onClick={() => setActiveTab('BOX_OFFICE')} className={activeTab === 'BOX_OFFICE' ? 'text-[#E50914] shrink-0' : 'text-gray-500 shrink-0'}>Box Office</button>
               <button onClick={() => setActiveTab('SCAN')} className={activeTab === 'SCAN' ? 'text-[#E50914] shrink-0' : 'text-gray-500 shrink-0'}>Scan</button>
            </div>
         </header>

         <div className="flex-1 overflow-auto p-4 md:p-8">
            {activeTab === 'CONTENT' && <ContentManagement />}
            {activeTab === 'BOX_OFFICE' && <BoxOfficeManagement />}
            {activeTab === 'SCAN' && <ScanManagement />}
         </div>
      </main>
    </div>
  );
}

function ContentManagement() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Movie>>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMovies(getMovies());
  }, []);

  const handleEdit = (m: Movie) => {
    setEditingId(m.id);
    setEditForm({ ...m });
  };

  const handleSave = () => {
    if (!editingId) return;
    const updated = movies.map(m => m.id === editingId ? { ...m, ...editForm } as Movie : m);
    setMovies(updated);
    saveMovies(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updated = movies.filter(m => m.id !== id);
    setMovies(updated);
    saveMovies(updated);
  };

  const handleAdd = () => {
    const newMovie: Movie = {
      id: `m${Date.now()}`,
      title: "New Movie Title",
      synopsis: "Enter a synopsis...",
      posterUrl: "https://picsum.photos/seed/new/400/600",
      backdropUrl: "https://picsum.photos/seed/newbg/1200/600",
      genre: ["Action"],
      duration: "2h 00m",
      rating: "PG-13",
      times: ["12:00 PM"]
    };
    const updated = [newMovie, ...movies];
    setMovies(updated);
    saveMovies(updated);
    handleEdit(newMovie);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-widest">Content Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage movies, posters, synopses, and showtimes.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-[#E50914] text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:brightness-110"
        >
          <Plus size={16} /> Add Movie
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {movies.map(movie => (
          <div key={movie.id} className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden flex flex-col sm:flex-row shadow-lg">
            
            <div className="w-full sm:w-40 aspect-[2/3] sm:aspect-auto relative shrink-0">
               {editingId === movie.id ? (
                 <div className="absolute inset-0 bg-[#0F0F0F] p-4 flex flex-col justify-center">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Poster URL</label>
                    <input 
                      type="text" 
                      value={editForm.posterUrl || ''} 
                      onChange={e => setEditForm({...editForm, posterUrl: e.target.value})}
                      className="w-full text-xs p-2 bg-[#222] border border-white/10 rounded mb-2 text-white outline-none"
                    />
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Backdrop URL</label>
                    <input 
                      type="text" 
                      value={editForm.backdropUrl || ''} 
                      onChange={e => setEditForm({...editForm, backdropUrl: e.target.value})}
                      className="w-full text-xs p-2 bg-[#222] border border-white/10 rounded text-white outline-none"
                    />
                 </div>
               ) : (
                 <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" referrerPolicy="no-referrer" />
               )}
            </div>
            
            <div className="p-5 flex flex-col justify-between flex-1 relative">
              {editingId === movie.id ? (
                <div className="space-y-3 flex-1">
                   <div>
                     <label className="text-[10px] text-gray-400 uppercase tracking-wider">Title</label>
                     <input 
                       className="w-full font-bold bg-[#222] border border-white/10 rounded px-2 py-1 outline-none focus:border-[#E50914]"
                       value={editForm.title || ''}
                       onChange={e => setEditForm({...editForm, title: e.target.value})}
                     />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <label className="text-[10px] text-gray-400 uppercase tracking-wider">Duration</label>
                       <input 
                         className="w-full text-xs bg-[#222] border border-white/10 rounded px-2 py-1 outline-none focus:border-[#E50914]"
                         value={editForm.duration || ''}
                         onChange={e => setEditForm({...editForm, duration: e.target.value})}
                       />
                     </div>
                     <div>
                       <label className="text-[10px] text-gray-400 uppercase tracking-wider">Rating</label>
                       <input 
                         className="w-full text-xs bg-[#222] border border-white/10 rounded px-2 py-1 outline-none focus:border-[#E50914]"
                         value={editForm.rating || ''}
                         onChange={e => setEditForm({...editForm, rating: e.target.value})}
                       />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-2 mt-2">
                     <div>
                       <label className="text-[10px] text-gray-400 uppercase tracking-wider">Synopsis</label>
                       <textarea 
                         className="w-full text-xs bg-[#222] border border-white/10 rounded px-2 py-1 outline-none focus:border-[#E50914] h-16 resize-none"
                         value={editForm.synopsis || ''}
                         onChange={e => setEditForm({...editForm, synopsis: e.target.value})}
                       />
                     </div>
                     <div className="flex flex-col gap-2">
                       <div>
                         <label className="text-[10px] text-gray-400 uppercase tracking-wider">Genres (Comma Sep)</label>
                         <input 
                           className="w-full text-xs bg-[#222] border border-white/10 rounded px-2 py-1 outline-none focus:border-[#E50914]"
                           value={editForm.genre?.join(', ') || ''}
                           onChange={e => setEditForm({...editForm, genre: e.target.value.split(',').map(s => s.trim())})}
                         />
                       </div>
                       <div>
                         <label className="text-[10px] text-gray-400 uppercase tracking-wider">Showtimes (Comma Sep)</label>
                         <input 
                           className="w-full text-xs bg-[#222] border border-white/10 rounded px-2 py-1 outline-none focus:border-[#E50914]"
                           value={editForm.times?.join(', ') || ''}
                           onChange={e => setEditForm({...editForm, times: e.target.value.split(',').map(s => s.trim())})}
                         />
                       </div>
                     </div>
                   </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                    <div className="flex gap-2 text-xs text-gray-400 mb-3">
                      <span className="border border-white/10 px-1 rounded">{movie.rating}</span>
                      <span>{movie.duration}</span>
                      <span>{movie.genre.join(', ')}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-3 mb-4">{movie.synopsis}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {movie.times.map(t => (
                        <span key={t} className="bg-[#222] text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                {editingId === movie.id ? (
                  <>
                    <button onClick={() => setEditingId(null)} className="flex-1 py-1.5 text-xs font-bold uppercase tracking-wider bg-transparent border border-white/20 rounded-md hover:bg-white/5 text-gray-300 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="flex-1 py-1.5 text-xs font-bold uppercase tracking-wider bg-green-600 rounded-md hover:bg-green-500 text-white transition-colors flex items-center justify-center gap-1.5">
                      <Save size={14} /> Save
                    </button>
                  </>
                ) : (
                  <>
                     <button onClick={() => handleEdit(movie)} className="flex-1 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#222] border border-white/10 rounded-md hover:border-white/30 text-white transition-colors flex items-center justify-center gap-1.5">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(movie.id)} className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-transparent border border-white/10 rounded-md hover:bg-red-500/20 hover:border-red-500 hover:text-red-500 text-gray-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BoxOfficeManagement() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMovies(getMovies());
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-widest">Box Office Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage seat conditions, process refunds, and monitor occupancy.</p>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric Cards Mock */}
        <div className="bg-[#141414] border border-white/10 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-start mb-4">
             <div className="w-10 h-10 rounded-full bg-[#E50914]/20 flex items-center justify-center text-[#E50914]">
               <Ticket size={20} />
             </div>
             <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-full">+12% Today</span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Tickets Sold</p>
          <p className="text-3xl font-black">1,492</p>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-start mb-4">
             <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
               <Activity size={20} />
             </div>
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full">Avg</span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Occupancy Rate</p>
          <p className="text-3xl font-black">68%</p>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-start mb-4">
             <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
               <ShieldAlert size={20} />
             </div>
             <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded-full">Pending</span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Blocked Seats</p>
          <p className="text-3xl font-black">14</p>
        </div>
      </div>

      <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-white/10 bg-[#1A1A1A] flex justify-between items-center">
           <h3 className="text-sm font-bold uppercase tracking-widest">Upcoming Showings & Capacity</h3>
        </div>
        <div className="divide-y divide-white/5">
           {movies.slice(0, 3).map((movie, idx) => {
             // eslint-disable-next-line react-hooks/purity
             const capacity = Math.floor(Math.random() * 40) + 40; // 40-80% mock
             const isHigh = capacity > 75;
             return (
               <div key={idx} className="p-6 flex flex-col md:flex-row gap-6 items-center">
                 <div className="flex gap-4 items-center w-full md:w-1/3">
                    <div className="w-12 h-16 bg-gray-800 rounded shrink-0 relative overflow-hidden">
                      <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase mb-1">{movie.title}</p>
                      <p className="text-xs text-gray-500">{movie.times[0]} &bull; Theater {idx + 1}</p>
                    </div>
                 </div>

                 <div className="flex-1 w-full">
                    <div className="flex justify-between text-xs mb-2">
                       <span className="text-gray-400 font-bold uppercase tracking-wider">Capacity</span>
                       <span className={isHigh ? "text-orange-500 font-bold" : "text-gray-300 font-bold"}>{capacity}% Full</span>
                    </div>
                    <div className="h-2 w-full bg-[#222] rounded-full overflow-hidden">
                       <div 
                         className={cn("h-full rounded-full", isHigh ? "bg-orange-500" : "bg-[#E50914]")} 
                         style={{ width: `${capacity}%` }} 
                       />
                    </div>
                 </div>

                 <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0 justify-end">
                    <button className="px-4 py-2 bg-[#222] border border-white/10 rounded text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors">
                      Block Seats
                    </button>
                    <button className="px-4 py-2 bg-[#222] border border-white/10 rounded text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors">
                      Refunds
                    </button>
                 </div>
               </div>
             )
           })}
        </div>
      </div>
    </div>
  );
}

function ScanManagement() {
  const [scanResult, setScanResult] = useState<{ success: boolean; msg: string; order?: any } | null>(null);
  const [query, setQuery] = useState('');
  
  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    if (typeof window !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('hogis_orders') || '[]');
      const orderIndex = orders.findIndex((o: any) => o.id === query);
      
      if (orderIndex === -1) {
         setScanResult({ success: false, msg: 'Ticket not found or invalid QR code.' });
      } else {
         const order = orders[orderIndex];
         if (order.status === 'USED') {
            setScanResult({ success: false, msg: 'Ticket has already been used.', order });
         } else if (order.status === 'REFUNDED') {
            setScanResult({ success: false, msg: 'Ticket was refunded.', order });
         } else {
            // Update to USED
            orders[orderIndex].status = 'USED';
            localStorage.setItem('hogis_orders', JSON.stringify(orders));
            setScanResult({ success: true, msg: 'Valid ticket! Access granted.', order });
         }
      }
    }
    setQuery('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 mt-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#141414] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#E50914]">
          <ScanLine size={32} />
        </div>
        <h2 className="text-2xl font-bold uppercase tracking-widest">Scanner Mode</h2>
        <p className="text-sm text-gray-500 mt-2">Enter the Order ID or scan the customer&apos;s QR code.</p>
      </div>

      <div className="bg-[#141414] border border-white/10 rounded-xl p-6 shadow-lg">
        <form onSubmit={handleScan} className="flex gap-2">
           <input 
             type="text" 
             placeholder="Scan barcode or enter ID (e.g. HC-ABCDEFGH)..." 
             className="flex-1 bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#E50914]"
             value={query}
             onChange={e => setQuery(e.target.value.toUpperCase())}
           />
           <button type="submit" className="bg-[#E50914] text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider hover:brightness-110">
             Scan
           </button>
        </form>

        <AnimatePresence mode="wait">
          {scanResult && (
            <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="mt-6 overflow-hidden"
            >
               <div className={cn("p-4 rounded-xl border", scanResult.success ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20")}>
                  <div className="flex gap-4">
                     <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", scanResult.success ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500")}>
                        {scanResult.success ? <Check size={20} /> : <X size={20} />}
                     </div>
                     <div>
                        <h4 className={cn("font-bold text-lg", scanResult.success ? "text-green-500" : "text-red-500")}>{scanResult.msg}</h4>
                        {scanResult.order && (
                           <div className="mt-3 text-sm text-gray-300 space-y-1">
                              <p><span className="text-gray-500 uppercase tracking-wider text-xs font-bold mr-2">Movie</span> {scanResult.order.movie.title}</p>
                              <p><span className="text-gray-500 uppercase tracking-wider text-xs font-bold mr-2">Time</span> {scanResult.order.time}</p>
                              <p><span className="text-gray-500 uppercase tracking-wider text-xs font-bold mr-2">Seats</span> {scanResult.order.seats.join(', ')}</p>
                              <p><span className="text-gray-500 uppercase tracking-wider text-xs font-bold mr-2">Name</span> {scanResult.order.customerName}</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
