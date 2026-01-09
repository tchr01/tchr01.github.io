# 🎬 Letterboxd List Viewer

A quick browse viewer for your Letterboxd list with beautiful movie posters and genres.

## Features

- 📽️ View all movies in your Letterboxd list (even 481+ movies!)
- 🖼️ High-quality movie posters from TMDb
- 🎭 Genre tags for quick filtering
- ⚡ Fast & responsive grid layout
- 💾 Smart caching for instant loading
- 🔍 Search movies by title
- 🌐 Works offline (after first load)
- 📱 Mobile-friendly responsive design

## Requirements

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Letterboxd account** with a list you want to view
- **TMDb API key** (free account) - [Sign up here](https://www.themoviedb.org/signup)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Your TMDb API Key

1. Go to [The Movie Database (TMDb)](https://www.themoviedb.org/signup)
2. Create a free account
3. Go to **Settings > API**
4. Click **Request an API Key**
5. Choose **Developer** option
6. Fill out the form (use "Personal" for all fields)
7. Copy your **API Key (v3 auth)**
8. Save it for the next step

### 3. Find Your Letterboxd List URL

1. Go to [Letterboxd](https://letterboxd.com/) and log in
2. Navigate to your profile > **Lists**
3. Click on the list you want to view
4. Copy the URL from your browser's address bar
5. It should look like: `https://letterboxd.com/username/list/list-name/`

**Available URLs:**
- Your films (watched): `https://letterboxd.com/username/films/`
- Your watchlist: `https://letterboxd.com/username/watchlist/`
- Custom list: `https://letterboxd.com/username/list/list-name/`

### 4. Run the Scraper

```bash
node scraper.js
```

When prompted, paste your Letterboxd list URL:
```
Enter your Letterboxd list URL (e.g., https://letterboxd.com/username/films/):
```

The scraper will:
- Fetch all pages of your list (handles pagination automatically)
- Extract movie titles, years, and Letterboxd URLs
- Save everything to `movies.json`
- Show progress: "✓ Page 1/5: 100 movies (total: 100)"

**Expected time:** 5-10 seconds for a typical list

### 5. Open the Viewer

Double-click `index.html` or drag it into your browser.

### 6. Add TMDb API Key

When the app opens for the first time:
1. You'll see a modal asking for your TMDb API key
2. Paste your API key (the one from step 2)
3. Click **Save & Continue**

### 7. Enjoy!

The app will:
- Load your `movies.json` instantly
- Fetch posters and genres from TMDb (~2-3 minutes for 481 movies)
- Cache everything for instant loading next time
- Show a search box to find movies by title

## Usage

### Browsing
- **Scroll** through the responsive grid of posters
- **Hover** over a poster to see the title and genres
- **Click** a poster to open the Letterboxd page in a new tab
- **Search** for movies using the search box

### Updating Your List
After adding or removing movies from Letterboxd:

1. Run the scraper again:
   ```bash
   node scraper.js
   ```

2. Open `index.html` in your browser (it will use cached data)

3. Click the **🔄 Refresh** button to re-fetch new posters and genres

### Settings
- Click the **⚙️** gear icon to change your TMDb API key
- Click **🔄 Refresh** to clear the poster cache and re-fetch data

## Troubleshooting

### "movies.json not found"
**Error:** The scraper hasn't been run yet.

**Solution:**
```bash
node scraper.js
```
Follow the prompts to scrape your Letterboxd list.

### "No movies found"
**Error:** The scraper ran but found no movies.

**Possible causes:**
- Invalid Letterboxd URL
- Private list and you're not logged in
- Letterboxd website structure changed

**Solution:**
- Make sure the URL is correct
- If it's a private list, ensure you're logged into Letterboxd in your browser
- Try the scraper again: `node scraper.js`

### Posters not loading
**Error:** Posters are missing or showing placeholders.

**Possible causes:**
- Invalid TMDb API key
- TMDb API temporarily down
- Movie not found in TMDb database

**Solution:**
- Check your API key in the settings (⚙️ icon)
- Click **Refresh** to retry
- Some lesser-known movies might not have posters in TMDb

### "API error" message
**Error:** TMDb API returned an error.

**Possible causes:**
- Invalid API key format
- API key hasn't been activated yet
- Rate limiting (too many requests)

**Solution:**
- Go to [TMDb API page](https://www.themoviedb.org/settings/api) and verify your key
- Wait a few minutes and try again
- Refresh the page

### Slow loading
**Error:** Posters are taking too long to load.

**Note:** This is normal! Loading 481+ movie posters from TMDb can take 2-3 minutes.

**Optimization:**
- Subsequent visits will load instantly from cache
- Cache expires after 7 days, then requires another API fetch

## How It Works

### Architecture

```
1. Scraper Phase (one-time)
   ↓
   node scraper.js
   ↓
   Fetches Letterboxd pages → Parses HTML → Saves movies.json

2. Viewer Phase (every time)
   ↓
   Open index.html
   ↓
   Load movies.json → Fetch TMDb data → Display in browser
   ↓
   Cache everything in localStorage
```

### Data Flow

1. **Scraper** (`scraper.js`):
   - Fetches your Letterboxd list pages with pagination
   - Extracts movie titles, years, and URLs
   - Saves to `movies.json`

2. **Viewer** (`index.html`):
   - Loads `movies.json` from disk
   - For each movie, searches TMDb API for posters and genres
   - Caches results in browser localStorage
   - Displays responsive grid of posters

3. **Caching**:
   - `movies.json`: Static file, only update when your list changes
   - TMDb data: Cached for 7 days in localStorage
   - Genre list: Cached indefinitely
   - Search index: Client-side only

## Privacy

- **Your data is local**: Everything runs on your computer
- **Letterboxd data**: Only your list is scraped (public HTML)
- **TMDb data**: Only fetched in your browser (not stored on any server)
- **No tracking**: No analytics, no data collection
- **Offline capable**: Works without internet after first load

## Limitations

- Private lists only work if you're logged into Letterboxd in your browser during scraping
- Some movies might not have posters in TMDb (will show placeholder)
- Requires re-running scraper when your Letterboxd list changes
- Large lists (500+ movies) take 2-3 minutes to enrich with TMDb data

## Advanced Usage

### Scrape Different Lists
You can create multiple `movies.json` files:

```bash
# Scrape your films list
node scraper.js
# Save as movies.json

# Create a copy for a different list
cp movies.json my-watchlist.json

# Update index.html to load a specific file:
# Change: fetch('./movies.json')
# To: fetch('./my-watchlist.json')

# Run scraper again for your films
node scraper.js
```

### Clear Cache
To clear cached poster data and re-fetch from TMDb:
- Click the **Refresh** button in the app (easiest)
- Or manually in DevTools: `Settings > API` and delete all `tmdb_*` entries

### Modify Grid Size
Edit the `min-width` in `index.html` CSS:

```css
/* Current: 150px wide posters */
grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));

/* For larger posters: */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

/* For smaller posters: */
grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
```

## File Structure

```
letterboxd/
├── index.html          # Main viewer app
├── scraper.js          # Letterboxd scraper script
├── movies.json         # Scraped movie data (generated)
├── package.json        # Node dependencies
├── .gitignore          # Git ignore file
├── README.md           # This file
└── node_modules/       # Dependencies (generated)
```

## License

MIT

## Support

Having issues? Check the [Troubleshooting](#troubleshooting) section above, or review:
- [Letterboxd](https://letterboxd.com/)
- [The Movie Database (TMDb)](https://www.themoviedb.org/)
- [Node.js Documentation](https://nodejs.org/docs/)

## Credits

Built with:
- [React](https://react.dev/) - UI framework
- [Cheerio](https://cheerio.js.org/) - HTML parsing
- [The Movie Database API](https://www.themoviedb.org/settings/api) - Movie data
- [Letterboxd](https://letterboxd.com/) - Movie data source

---

**Enjoy your movies! 🍿**
