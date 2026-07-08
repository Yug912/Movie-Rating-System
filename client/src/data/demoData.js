export const demoMovies = [
  {
    _id: "m1",
    title: "Signal After Midnight",
    genre: ["Sci-Fi", "Mystery"],
    poster: "https://picsum.photos/seed/signal-after-midnight/640/960",
    backdrop: "https://picsum.photos/seed/signal-after-midnight-wide/1280/720",
    description: "A radio astronomer tracks a repeating signal that appears to know her future.",
    averageRating: 4.6,
    reviewCount: 342,
    views: 1480,
    releaseYear: 2024,
    runtime: 118,
    director: "Nora Vale",
    cast: ["Iris Moon", "Dev Arlen", "Kane Holt"]
  },
  {
    _id: "m2",
    title: "The Last Monsoon",
    genre: ["Drama", "Romance"],
    poster: "https://picsum.photos/seed/last-monsoon/640/960",
    backdrop: "https://picsum.photos/seed/last-monsoon-wide/1280/720",
    description: "Two former lovers cross paths during the final season of a fading coastal cinema.",
    averageRating: 4.8,
    reviewCount: 288,
    views: 990,
    releaseYear: 2023,
    runtime: 132,
    director: "Aarav Sen",
    cast: ["Leena Rao", "Kabir Mehta"]
  },
  {
    _id: "m3",
    title: "Copper City",
    genre: ["Action", "Crime"],
    poster: "https://picsum.photos/seed/copper-city/640/960",
    backdrop: "https://picsum.photos/seed/copper-city-wide/1280/720",
    description: "A courier and a detective collide while exposing a smuggling ring inside a vertical city.",
    averageRating: 4.2,
    reviewCount: 196,
    views: 1220,
    releaseYear: 2025,
    runtime: 109,
    director: "Mika Stone",
    cast: ["Jules Carter", "Ravi Knox", "Mina West"]
  },
  {
    _id: "m4",
    title: "Kitchen Table Galaxy",
    genre: ["Comedy", "Family"],
    poster: "https://picsum.photos/seed/kitchen-table-galaxy/640/960",
    backdrop: "https://picsum.photos/seed/kitchen-table-galaxy-wide/1280/720",
    description: "A chaotic family accidentally turns dinner night into a miniature space mission.",
    averageRating: 4.1,
    reviewCount: 154,
    views: 820,
    releaseYear: 2022,
    runtime: 96,
    director: "Tessa Bloom",
    cast: ["Owen Park", "Nia Bell"]
  },
  {
    _id: "m5",
    title: "Velvet Case",
    genre: ["Thriller", "Mystery"],
    poster: "https://picsum.photos/seed/velvet-case/640/960",
    backdrop: "https://picsum.photos/seed/velvet-case-wide/1280/720",
    description: "A retired investigator reopens the one case that made her famous and ruined her life.",
    averageRating: 4.4,
    reviewCount: 231,
    views: 1035,
    releaseYear: 2024,
    runtime: 124,
    director: "Marin Cole",
    cast: ["Ada Pierce", "Theo Grant"]
  },
  {
    _id: "m6",
    title: "North Star Arcade",
    genre: ["Adventure", "Comedy"],
    poster: "https://picsum.photos/seed/north-star-arcade/640/960",
    backdrop: "https://picsum.photos/seed/north-star-arcade-wide/1280/720",
    description: "Teen rivals discover an old arcade machine that maps hidden doors across their city.",
    averageRating: 4.3,
    reviewCount: 174,
    views: 960,
    releaseYear: 2025,
    runtime: 101,
    director: "Kenji Hall",
    cast: ["Sam Rivers", "Maya Lin", "Ari Fox"]
  }
];

export const demoReviews = [
  {
    _id: "r1",
    user: { name: "Maya Chen" },
    movie: "m1",
    rating: 5,
    comment: "Smart, moving, and beautifully paced. The final act is great.",
    likedBy: ["u2"],
    sentiment: { label: "positive" },
    createdAt: "2026-01-12T10:00:00.000Z"
  },
  {
    _id: "r2",
    user: { name: "Admin User" },
    movie: "m1",
    rating: 4,
    comment: "Excellent atmosphere with a few slow stretches in the middle.",
    likedBy: [],
    sentiment: { label: "positive" },
    createdAt: "2026-01-14T10:00:00.000Z"
  }
];
