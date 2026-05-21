export interface Movie {
  id: string;
  title: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  genre: string[];
  duration: string;
  rating: string;
  times: string[];
}

export const INITIAL_MOVIES: Movie[] = [
  {
    id: "m1",
    title: "Dune: Part Two",
    synopsis: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    posterUrl: "https://picsum.photos/seed/dune/400/600",
    backdropUrl: "https://picsum.photos/seed/dunebg/1200/600",
    genre: ["Sci-Fi", "Adventure"],
    duration: "2h 46m",
    rating: "PG-13",
    times: ["10:30 AM", "1:45 PM", "5:00 PM", "8:15 PM"]
  },
  {
    id: "m2",
    title: "Deadpool & Wolverine",
    synopsis: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again.",
    posterUrl: "https://picsum.photos/seed/deadpool/400/600",
    backdropUrl: "https://picsum.photos/seed/deadpoolbg/1200/600",
    genre: ["Action", "Comedy"],
    duration: "2h 07m",
    rating: "R",
    times: ["11:00 AM", "2:30 PM", "7:00 PM", "10:15 PM"]
  },
  {
    id: "m3",
    title: "Inside Out 2",
    synopsis: "Follows Riley, in her teenage years, encountering new emotions that disrupt the delicate balance of her mind headquarters.",
    posterUrl: "https://picsum.photos/seed/insideout/400/600",
    backdropUrl: "https://picsum.photos/seed/insideoutbg/1200/600",
    genre: ["Animation", "Family"],
    duration: "1h 36m",
    rating: "PG",
    times: ["9:00 AM", "12:15 PM", "3:30 PM", "6:45 PM"]
  },
  {
    id: "m4",
    title: "Gladiator II",
    synopsis: "Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after the powerful emperors of Rome conquer his home.",
    posterUrl: "https://picsum.photos/seed/gladiator/400/600",
    backdropUrl: "https://picsum.photos/seed/gladiatorbg/1200/600",
    genre: ["Action", "Drama"],
    duration: "2h 30m",
    rating: "R",
    times: ["1:00 PM", "4:30 PM", "8:00 PM", "11:15 PM"]
  }
];

export const getMovies = (): Movie[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('hogis_movies');
    if (stored) return JSON.parse(stored);
  }
  return INITIAL_MOVIES;
};

export const saveMovies = (movies: Movie[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hogis_movies', JSON.stringify(movies));
  }
};

export interface Order {
  id: string;
  movie: Movie;
  time: string;
  seats: string[];
  totalPrice: number;
  customerName: string;
  email: string;
  status: 'VALID' | 'USED' | 'REFUNDED';
  createdAt: string;
}

export const getOrders = (): Order[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('hogis_orders');
    if (stored) return JSON.parse(stored);
  }
  return [];
};

export const saveOrders = (orders: Order[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hogis_orders', JSON.stringify(orders));
  }
};

export const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const columns = 12;
  const seats = [];

  for (let i = 0; i < rows.length; i++) {
    for (let j = 1; j <= columns; j++) {
      seats.push({
        id: `${rows[i]}${j}`,
        row: rows[i],
        number: j,
        // Randomly assign some seats as occupied
        isOccupied: Math.random() < 0.25,
        price: rows[i] === 'G' || rows[i] === 'H' ? 25 : 15 // Premium rows
      });
    }
  }
  return seats;
};
