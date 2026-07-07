# 🚀 GitHub Profile Explorer

A React-based web app for exploring GitHub profiles: search users, browse
their repositories with infinite scroll, save favorites, and compare two
profiles side by side.

---

## 📌 Features

- 🔍 Search for any GitHub user by username (press Enter or click the button)
- 🎲 Fetch a random batch of GitHub users
- 👤 View profile details (followers, following, repo count)
- 📂 Explore user repositories with infinite scroll
- ⭐ Save profiles to a **Favorites** list (persisted in `localStorage`)
- ⚖️ **Compare** up to two profiles side by side (repos, followers, following)
- ⚡ Works with or without a GitHub token (falls back to the public rate limit)
- 🌙 Dark theme, responsive layout

---

## 🛠️ Tech Stack

- **Frontend:** React 19 (Hooks) + custom hooks for data/state
- **Bundler:** Parcel
- **Styling:** Plain CSS3, responsive, dark theme
- **API:** GitHub REST API (`api.github.com`)

---

## 📁 Project Structure

```
src/
├── app.js                    # React root
├── style.css                 # All styling
├── Component/
│   ├── Header.js
│   ├── Body.js                # Top-level view orchestrator
│   ├── Controls.js            # Search inputs + favorites toggle
│   ├── ProfileCard.js         # One profile card (favorite/compare/repos actions)
│   ├── RepoList.js / RepoCard.js
│   ├── Favorites.js           # Saved-profiles view
│   └── CompareView.js         # Side-by-side comparison panel
└── hooks/
    ├── useProfiles.js         # Random/single profile fetching
    ├── useRepos.js            # Paginated repos + infinite scroll
    ├── useFavorites.js        # localStorage-backed favorites
    └── useCompare.js          # Selection state for the compare panel
```

---

## ⚙️ Installation & Setup

1. Clone the repository:
   ```bash
   git clone git@github.com:Akash2624-07/ProjectGitHub.git
   cd ProjectGitHub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🔐 Environment Variables (Optional)

The app works out of the box with **no token**, using GitHub's public rate
limit (60 requests/hour per IP). To raise that limit:

1. Generate a fine-grained personal access token at
   [github.com/settings/tokens](https://github.com/settings/tokens)
   (no scopes are needed — it's only used for read access to public data).
2. Copy `.env.example` to `.env` and paste your token in:
   ```bash
   cp .env.example .env
   ```

> ⚠️ **Do not deploy a build with a real token in `.env`.** Parcel inlines
> `process.env.GITHUB_TOKEN` directly into the shipped JS bundle at build
> time, so it would be readable by anyone viewing your deployed site's
> source. Keep the token for local development only.

---

## 🧠 Key Concepts Used

- React Hooks (`useState`, `useEffect`, `useRef`, `useCallback`) split into
  reusable custom hooks
- `IntersectionObserver`-based infinite scroll (no external library)
- `localStorage` persistence for favorites
- Conditional rendering across three views: explore grid, favorites, error
- Component composition instead of one large monolithic component

---

## 🚀 Future Improvements

- Backend proxy so a GitHub token never has to live in client code
- Repository filters (language, stars)
- Automated tests
- TypeScript

---

## 👨‍💻 Author

Akash Harshvardhan

---

⭐ If you like this project, give it a star
