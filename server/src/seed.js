import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Movie from "./models/Movie.js";
import Review from "./models/Review.js";
import User from "./models/User.js";
import Watchlist from "./models/Watchlist.js";
import { recalculateMovieRating } from "./utils/reviews.js";

dotenv.config();

const poster = (seed) => `https://picsum.photos/seed/${seed}/640/960`;
const backdrop = (seed) => `https://picsum.photos/seed/${seed}-wide/1280/720`;

const movies = [
  {
    title: "Signal After Midnight",
    genre: ["Sci-Fi", "Mystery"],
    poster: poster("signal-after-midnight"),
    backdrop: backdrop("signal-after-midnight"),
    releaseYear: 2024,
    runtime: 118,
    director: "Nora Vale",
    cast: ["Iris Moon", "Dev Arlen", "Kane Holt"],
    description: "A radio astronomer tracks a repeating signal that appears to know her future."
  },
  {
    title: "The Last Monsoon",
    genre: ["Drama", "Romance"],
    poster: poster("last-monsoon"),
    backdrop: backdrop("last-monsoon"),
    releaseYear: 2023,
    runtime: 132,
    director: "Aarav Sen",
    cast: ["Leena Rao", "Kabir Mehta"],
    description: "Two former lovers cross paths during the final season of a fading coastal cinema."
  },
  {
    title: "Copper City",
    genre: ["Action", "Crime"],
    poster: poster("copper-city"),
    backdrop: backdrop("copper-city"),
    releaseYear: 2025,
    runtime: 109,
    director: "Mika Stone",
    cast: ["Jules Carter", "Ravi Knox", "Mina West"],
    description: "A courier and a detective collide while exposing a smuggling ring inside a vertical city."
  },
  {
    title: "Kitchen Table Galaxy",
    genre: ["Comedy", "Family"],
    poster: poster("kitchen-table-galaxy"),
    backdrop: backdrop("kitchen-table-galaxy"),
    releaseYear: 2022,
    runtime: 96,
    director: "Tessa Bloom",
    cast: ["Owen Park", "Nia Bell"],
    description: "A chaotic family accidentally turns dinner night into a miniature space mission."
  },
  {
    title: "Velvet Case",
    genre: ["Thriller", "Mystery"],
    poster: poster("velvet-case"),
    backdrop: backdrop("velvet-case"),
    releaseYear: 2024,
    runtime: 124,
    director: "Marin Cole",
    cast: ["Ada Pierce", "Theo Grant"],
    description: "A retired investigator reopens the one case that made her famous and ruined her life."
  },
  {
    title: "North Star Arcade",
    genre: ["Adventure", "Comedy"],
    poster: poster("north-star-arcade"),
    backdrop: backdrop("north-star-arcade"),
    releaseYear: 2025,
    runtime: 101,
    director: "Kenji Hall",
    cast: ["Sam Rivers", "Maya Lin", "Ari Fox"],
    description: "Teen rivals discover an old arcade machine that maps hidden doors across their city."
  }
];

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany(), Movie.deleteMany(), Review.deleteMany(), Watchlist.deleteMany()]);

  const [admin, maya] = await User.create([
    {
      name: "Admin User",
      email: "admin@moviebox.test",
      password: "Password123!",
      role: "admin",
      preferences: { favoriteGenres: ["Sci-Fi", "Mystery"] }
    },
    {
      name: "Maya Chen",
      email: "maya@moviebox.test",
      password: "Password123!",
      role: "user",
      preferences: { favoriteGenres: ["Drama", "Comedy", "Sci-Fi"] }
    }
  ]);

  const createdMovies = await Movie.insertMany(movies.map((movie, index) => ({ ...movie, views: 40 - index * 4 })));

  await Review.insertMany([
    {
      user: maya._id,
      movie: createdMovies[0]._id,
      rating: 5,
      comment: "Smart, moving, and beautifully paced. The final act is great.",
      likedBy: [admin._id],
      sentiment: { label: "positive", score: 3 }
    },
    {
      user: admin._id,
      movie: createdMovies[0]._id,
      rating: 4,
      comment: "Excellent atmosphere with a few slow stretches in the middle.",
      sentiment: { label: "positive", score: 0 }
    },
    {
      user: maya._id,
      movie: createdMovies[1]._id,
      rating: 5,
      comment: "A beautiful drama with grounded performances and a memorable ending.",
      sentiment: { label: "positive", score: 2 }
    },
    {
      user: admin._id,
      movie: createdMovies[2]._id,
      rating: 4,
      comment: "Fun action, sharp production design, and a confident lead performance.",
      sentiment: { label: "positive", score: 2 }
    },
    {
      user: maya._id,
      movie: createdMovies[3]._id,
      rating: 4,
      comment: "Warm and funny without losing the family stakes.",
      sentiment: { label: "positive", score: 2 }
    }
  ]);

  await Watchlist.insertMany([
    { user: maya._id, movie: createdMovies[0]._id, status: "watched", watchedAt: new Date() },
    { user: maya._id, movie: createdMovies[4]._id, status: "planned" },
    { user: admin._id, movie: createdMovies[2]._id, status: "watched", watchedAt: new Date() }
  ]);

  await Promise.all(createdMovies.map((movie) => recalculateMovieRating(movie._id)));
  await mongoose.disconnect();
  console.log("Seed complete");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
