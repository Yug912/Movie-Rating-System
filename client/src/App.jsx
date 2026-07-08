import {
  BarChart3,
  Bookmark,
  Clapperboard,
  GitCompare,
  Heart,
  LayoutDashboard,
  LogOut,
  Search,
  Shield,
  Sparkles,
  Star,
  ThumbsUp,
  TrendingUp
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import api from "./api";
import { demoMovies, demoReviews } from "./data/demoData";
import { useAuth } from "./state/AuthContext";

const genres = ["All", "Action", "Adventure", "Comedy", "Crime", "Drama", "Family", "Mystery", "Romance", "Sci-Fi", "Thriller"];

function useMovies() {
  const [movies, setMovies] = useState(demoMovies);
  const [source, setSource] = useState("demo");

  useEffect(() => {
    api.get("/movies")
      .then(({ data }) => {
        setMovies(data);
        setSource("api");
      })
      .catch(() => setSource("demo"));
  }, []);

  return { movies, setMovies, source };
}

function Stars({ value = 0, size = 18, onChange }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={onChange ? "icon-button compact" : "cursor-default"}
          disabled={!onChange}
          title={`${star} star`}
        >
          <Star
            size={size}
            className={star <= Math.round(value) ? "fill-gold text-gold" : "text-slate-300"}
          />
        </button>
      ))}
    </div>
  );
}

function Shell({ children }) {
  const { user, logout } = useAuth();
  const nav = [
    ["Browse", "/", Clapperboard],
    ["Watchlist", "/watchlist", Bookmark],
    ["Analytics", "/analytics", BarChart3],
    ["Compare", "/compare", GitCompare]
  ];

  if (user?.role === "admin") nav.push(["Admin", "/admin", Shield]);

  return (
    <div className="min-h-screen bg-slate-50 text-ink">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-black">
            <span className="grid h-10 w-10 place-items-center rounded bg-reef text-white">
              <Clapperboard size={22} />
            </span>
            <span className="text-xl">MovieBox</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map(([label, href, Icon]) => (
              <NavLink key={href} to={href} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden text-sm font-semibold text-slate-600 sm:inline">{user.name}</span>
                <button className="icon-button" onClick={logout} title="Log out">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn primary">Login</Link>
            )}
          </div>
        </div>
        <nav className="scrollbar-hide flex gap-1 overflow-x-auto px-4 pb-3 md:hidden">
          {nav.map(([label, href, Icon]) => (
            <NavLink key={href} to={href} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}

function MovieCard({ movie, onWatchlist }) {
  return (
    <article className="movie-card">
      <Link to={`/movies/${movie._id}`} className="block">
        <img src={movie.poster} alt={movie.title} className="poster" />
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <Link to={`/movies/${movie._id}`} className="text-lg font-black leading-tight hover:text-reef">
              {movie.title}
            </Link>
            <span className="rating-pill"><Star size={14} className="fill-gold text-gold" />{movie.averageRating || "New"}</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{movie.releaseYear} • {movie.genre.join(", ")}</p>
        </div>
        <p className="line-clamp-2 min-h-10 text-sm text-slate-600">{movie.description}</p>
        <div className="flex items-center justify-between">
          <Stars value={movie.averageRating} size={15} />
          <button className="icon-button" title="Add to watchlist" onClick={() => onWatchlist(movie)}>
            <Bookmark size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

function BrowsePage({ movies, source }) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("rating");
  const [watchlist, setWatchlist] = useState(() => JSON.parse(localStorage.getItem("moviebox-watchlist") ?? "[]"));

  const filtered = useMemo(() => {
    const bySearch = movies.filter((movie) => `${movie.title} ${movie.description} ${movie.genre.join(" ")}`.toLowerCase().includes(search.toLowerCase()));
    const byGenre = genre === "All" ? bySearch : bySearch.filter((movie) => movie.genre.includes(genre));
    return [...byGenre].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "trending") return b.views - a.views;
      if (sort === "newest") return b.releaseYear - a.releaseYear;
      return b.averageRating - a.averageRating;
    });
  }, [genre, movies, search, sort]);

  function addToWatchlist(movie) {
    const next = watchlist.some((item) => item.movie._id === movie._id)
      ? watchlist
      : [{ movie, status: "planned" }, ...watchlist];
    setWatchlist(next);
    localStorage.setItem("moviebox-watchlist", JSON.stringify(next));
  }

  const trending = [...movies].sort((a, b) => b.views - a.views).slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="hero">
        <img src={trending[0]?.backdrop ?? trending[0]?.poster} alt="" />
        <div className="hero-content">
          <span className="eyebrow"><TrendingUp size={15} /> Trending now</span>
          <h1>{trending[0]?.title ?? "MovieBox Ratings"}</h1>
          <p>{trending[0]?.description ?? "Browse movies, rate favorites, and discover your next watch."}</p>
          <div className="flex flex-wrap gap-2">
            <Link to={`/movies/${trending[0]?._id ?? "m1"}`} className="btn primary">View Details</Link>
            <Link to="/analytics" className="btn light">Open Analytics</Link>
          </div>
        </div>
      </section>

      <section className="toolbar">
        <label className="search-field">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search movies, genres, cast" />
        </label>
        <select value={genre} onChange={(event) => setGenre(event.target.value)}>
          {genres.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="rating">Top rated</option>
          <option value="trending">Trending</option>
          <option value="newest">Newest</option>
          <option value="title">Title</option>
        </select>
      </section>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="section-title">Browse Movies</h2>
          <p className="text-sm text-slate-500">{filtered.length} movies • {source === "api" ? "Live API" : "Demo data"}</p>
        </div>
        <Link to="/compare" className="btn subtle"><GitCompare size={17} />Compare</Link>
      </div>

      <section className="movie-grid">
        {filtered.map((movie) => <MovieCard key={movie._id} movie={movie} onWatchlist={addToWatchlist} />)}
      </section>
    </div>
  );
}

function DetailsPage({ movies }) {
  const { id } = useParams();
  const { user } = useAuth();
  const movie = movies.find((item) => item._id === id) ?? demoMovies[0];
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState(demoReviews.filter((review) => review.movie === movie._id));

  useEffect(() => {
    api.get(`/movies/${id}`)
      .then(({ data }) => setReviews(data.reviews))
      .catch(() => setReviews(demoReviews.filter((review) => review.movie === movie._id)));
  }, [id, movie._id]);

  async function submitReview(event) {
    event.preventDefault();
    const optimistic = {
      _id: crypto.randomUUID(),
      user: { name: user?.name ?? "Demo User" },
      movie: movie._id,
      rating,
      comment,
      likedBy: [],
      sentiment: { label: rating >= 4 ? "positive" : rating <= 2 ? "negative" : "neutral" },
      createdAt: new Date().toISOString()
    };
    setReviews([optimistic, ...reviews]);
    setComment("");
    api.post("/reviews", { movie: movie._id, rating, comment }).catch(() => {});
  }

  function deleteReview(reviewId) {
    setReviews(reviews.filter((review) => review._id !== reviewId));
    api.delete(`/reviews/${reviewId}`).catch(() => {});
  }

  function likeReview(reviewId) {
    setReviews(reviews.map((review) => review._id === reviewId ? { ...review, likedBy: [...(review.likedBy ?? []), user?._id ?? "demo"] } : review));
    api.post(`/reviews/${reviewId}/like`).catch(() => {});
  }

  return (
    <div className="space-y-8">
      <section className="details-hero">
        <img src={movie.backdrop ?? movie.poster} alt="" />
        <div className="details-overlay">
          <img src={movie.poster} alt={movie.title} className="details-poster" />
          <div className="max-w-3xl">
            <p className="eyebrow"><Sparkles size={15} /> {movie.genre.join(" / ")}</p>
            <h1>{movie.title}</h1>
            <p>{movie.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="rating-pill large"><Star size={17} className="fill-gold text-gold" />{movie.averageRating}</span>
              <span>{movie.releaseYear}</span>
              <span>{movie.runtime} min</span>
              <span>{movie.reviewCount} reviews</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="panel">
          <h2 className="section-title">Reviews</h2>
          <div className="mt-4 space-y-4">
            {reviews.map((review) => (
              <article key={review._id} className="review">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <strong>{review.user?.name ?? "Movie fan"}</strong>
                    <Stars value={review.rating} size={14} />
                  </div>
                  <span className="sentiment">{review.sentiment?.label ?? "neutral"}</span>
                </div>
                <p className="mt-3 text-slate-650">{review.comment}</p>
                <div className="mt-3 flex gap-2">
                  <button className="btn subtle" onClick={() => likeReview(review._id)}>
                    <ThumbsUp size={16} /> Helpful {(review.likedBy?.length ?? 0)}
                  </button>
                  {user && <button className="btn danger" onClick={() => deleteReview(review._id)}>Delete</button>}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="panel">
          <h2 className="section-title">Rate This Movie</h2>
          <form className="mt-4 space-y-4" onSubmit={submitReview}>
            <Stars value={rating} onChange={setRating} size={24} />
            <textarea required value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write your review" />
            <button className="btn primary w-full" type="submit">Submit Review</button>
          </form>
          <div className="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-600">
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Cast:</strong> {movie.cast?.join(", ")}</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function WatchlistPage() {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("moviebox-watchlist") ?? "[]"));

  function updateStatus(movieId, status) {
    const next = items.map((item) => item.movie._id === movieId ? { ...item, status } : item);
    setItems(next);
    localStorage.setItem("moviebox-watchlist", JSON.stringify(next));
    api.patch(`/watchlist/${movieId}`, { status }).catch(() => {});
  }

  function remove(movieId) {
    const next = items.filter((item) => item.movie._id !== movieId);
    setItems(next);
    localStorage.setItem("moviebox-watchlist", JSON.stringify(next));
    api.delete(`/watchlist/${movieId}`).catch(() => {});
  }

  return (
    <section className="space-y-5">
      <h1 className="page-title">Watchlist</h1>
      <div className="panel divide-y divide-slate-200">
        {items.length === 0 && <p className="py-8 text-center text-slate-500">Add movies from the browse page to build your watchlist.</p>}
        {items.map(({ movie, status }) => (
          <div key={movie._id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
            <img src={movie.poster} alt={movie.title} className="h-28 w-20 rounded object-cover" />
            <div className="flex-1">
              <h2 className="text-lg font-black">{movie.title}</h2>
              <p className="text-sm text-slate-500">{movie.genre.join(", ")}</p>
              <Stars value={movie.averageRating} size={15} />
            </div>
            <select value={status} onChange={(event) => updateStatus(movie._id, event.target.value)}>
              <option value="planned">Planned</option>
              <option value="watching">Watching</option>
              <option value="watched">Watched</option>
            </select>
            <button className="btn danger" onClick={() => remove(movie._id)}>Remove</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function AnalyticsPage({ movies }) {
  const distribution = [1, 2, 3, 4, 5].map((rating) => ({
    rating: `${rating} star`,
    count: Math.round(movies.reduce((sum, movie) => sum + (Math.round(movie.averageRating) === rating ? movie.reviewCount : 0), 0) / 12)
  }));
  const topRated = [...movies].sort((a, b) => b.averageRating - a.averageRating).slice(0, 5);
  const mostReviewed = [...movies].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="page-title">Analytics Dashboard</h1>
      <section className="stats-grid">
        <Stat icon={Clapperboard} label="Movies" value={movies.length} />
        <Stat icon={Heart} label="Reviews" value={movies.reduce((sum, movie) => sum + movie.reviewCount, 0)} />
        <Stat icon={Star} label="Average Rating" value={(movies.reduce((sum, movie) => sum + movie.averageRating, 0) / movies.length).toFixed(1)} />
        <Stat icon={TrendingUp} label="Trending Views" value={movies.reduce((sum, movie) => sum + movie.views, 0)} />
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <ChartPanel title="Top Rated">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topRated}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="averageRating" fill="#1c7c74" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel title="Rating Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={distribution} dataKey="count" nameKey="rating" outerRadius={95} label>
                {distribution.map((_, index) => <Cell key={index} fill={["#e65f3c", "#f2b84b", "#6b7280", "#1c7c74", "#17202f"][index]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>
      <section className="panel">
        <h2 className="section-title">Most Reviewed</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {mostReviewed.map((movie) => (
            <div key={movie._id} className="rounded border border-slate-200 p-3">
              <strong>{movie.title}</strong>
              <p className="text-sm text-slate-500">{movie.reviewCount} reviews</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <article className="stat">
      <Icon size={22} />
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function ChartPanel({ title, children }) {
  return (
    <section className="panel">
      <h2 className="section-title">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ComparePage({ movies }) {
  const [left, setLeft] = useState(movies[0]?._id);
  const [right, setRight] = useState(movies[1]?._id);
  const selected = [movies.find((movie) => movie._id === left), movies.find((movie) => movie._id === right)].filter(Boolean);

  return (
    <div className="space-y-6">
      <h1 className="page-title">Movie Comparison</h1>
      <section className="toolbar">
        <select value={left} onChange={(event) => setLeft(event.target.value)}>
          {movies.map((movie) => <option key={movie._id} value={movie._id}>{movie.title}</option>)}
        </select>
        <select value={right} onChange={(event) => setRight(event.target.value)}>
          {movies.map((movie) => <option key={movie._id} value={movie._id}>{movie.title}</option>)}
        </select>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        {selected.map((movie) => (
          <article key={movie._id} className="panel">
            <img src={movie.backdrop ?? movie.poster} alt="" className="mb-4 aspect-video w-full rounded object-cover" />
            <h2 className="section-title">{movie.title}</h2>
            <p className="mt-2 text-slate-600">{movie.description}</p>
            <dl className="compare-list">
              <div><dt>Rating</dt><dd>{movie.averageRating}</dd></div>
              <div><dt>Reviews</dt><dd>{movie.reviewCount}</dd></div>
              <div><dt>Runtime</dt><dd>{movie.runtime} min</dd></div>
              <div><dt>Genre</dt><dd>{movie.genre.join(", ")}</dd></div>
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}

function AdminPage({ movies, setMovies }) {
  const blank = { title: "", genre: "Drama", poster: "", description: "", releaseYear: 2026, runtime: 100, director: "" };
  const [form, setForm] = useState(blank);

  function submit(event) {
    event.preventDefault();
    const movie = {
      ...form,
      _id: crypto.randomUUID(),
      genre: form.genre.split(",").map((item) => item.trim()).filter(Boolean),
      averageRating: 0,
      reviewCount: 0,
      views: 0,
      backdrop: form.poster
    };
    setMovies([movie, ...movies]);
    setForm(blank);
    api.post("/movies", movie).catch(() => {});
  }

  function remove(movieId) {
    setMovies(movies.filter((movie) => movie._id !== movieId));
    api.delete(`/movies/${movieId}`).catch(() => {});
  }

  return (
    <div className="space-y-6">
      <h1 className="page-title">Admin Panel</h1>
      <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form className="panel space-y-3" onSubmit={submit}>
          <h2 className="section-title">Add Movie</h2>
          <input required placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          <input required placeholder="Genres, comma separated" value={form.genre} onChange={(event) => setForm({ ...form, genre: event.target.value })} />
          <input required placeholder="Poster URL" value={form.poster} onChange={(event) => setForm({ ...form, poster: event.target.value })} />
          <textarea required placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={form.releaseYear} onChange={(event) => setForm({ ...form, releaseYear: Number(event.target.value) })} />
            <input type="number" value={form.runtime} onChange={(event) => setForm({ ...form, runtime: Number(event.target.value) })} />
          </div>
          <input placeholder="Director" value={form.director} onChange={(event) => setForm({ ...form, director: event.target.value })} />
          <button className="btn primary w-full" type="submit">Save Movie</button>
        </form>
        <div className="panel overflow-x-auto">
          <h2 className="section-title">Manage Movies</h2>
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Genre</th><th>Rating</th><th></th></tr></thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id}>
                  <td>{movie.title}</td>
                  <td>{movie.genre.join(", ")}</td>
                  <td>{movie.averageRating}</td>
                  <td><button className="btn danger" onClick={() => remove(movie._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function LoginPage() {
  const { login, signup, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "admin@moviebox.test", password: "Password123!" });

  async function submit(event) {
    event.preventDefault();
    try {
      if (mode === "login") await login(form.email, form.password);
      else await signup(form);
      navigate("/");
    } catch {
      demoLogin("admin");
      navigate("/");
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <form className="panel space-y-4" onSubmit={submit}>
        <LayoutDashboard className="text-reef" size={32} />
        <h1 className="page-title">{mode === "login" ? "Login" : "Sign Up"}</h1>
        {mode === "signup" && <input required placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />}
        <input required type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input required type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <button className="btn primary w-full" type="submit">{mode === "login" ? "Login" : "Create Account"}</button>
        <button type="button" className="btn subtle w-full" onClick={() => { demoLogin("admin"); navigate("/"); }}>Use Demo Admin</button>
        <button type="button" className="text-sm font-semibold text-reef" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Need an account?" : "Already have an account?"}
        </button>
      </form>
    </div>
  );
}

export default function App() {
  const { movies, setMovies, source } = useMovies();

  return (
    <Shell>
      <Routes>
        <Route path="/" element={<BrowsePage movies={movies} source={source} />} />
        <Route path="/movies/:id" element={<DetailsPage movies={movies} />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/analytics" element={<AnalyticsPage movies={movies} />} />
        <Route path="/compare" element={<ComparePage movies={movies} />} />
        <Route path="/admin" element={<AdminPage movies={movies} setMovies={setMovies} />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Shell>
  );
}
