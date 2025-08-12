Create a web-based music recognition application with the following requirements:

### Core Functionality
- Single HTML file with embedded CSS and JavaScript
- Uses Web Audio API to capture microphone audio
- Integrates with AcrCloud API for music recognition
- Modern, minimal design with large album artwork display
- Responsive layout that works on desktop and tablet

### Technical Stack
- Pure HTML/CSS/JavaScript (no frameworks)
- Web Audio API for microphone access
- Fetch API for music recognition calls
- CSS Grid/Flexbox for responsive layout
- Modern CSS with custom properties for theming

### UI/UX Requirements
- **Default State**: Elegant message encouraging users to play music
- **Recognition State**: Shows "Listening..." with subtle animation
- **Display State**: Large album art, artist name, song title, album name, genre, year
- **Error State**: Graceful error messages for mic access or recognition failures
- **Color Scheme**: Dark theme with white text, accent colors for interactive elements
- **Typography**: Clean, modern font stack with proper hierarchy
- **Layout**: Centered content, generous whitespace, mobile-responsive

### Audio Processing
- Request microphone permission on load
- Continuously sample audio in chunks (10-15 second intervals)
- Process audio to WAV or appropriate format for recognition API
- Implement basic noise detection to avoid unnecessary API calls when silent

### API Integration
- Use AcrCloud API (free tier) for music recognition
- Handle API responses and extract: artist, title, album, genre, year, album art URL
- Implement error handling for API failures, rate limits, network issues
- Cache recent results to avoid duplicate API calls for same song

### Visual Design
- Album artwork: Large (400x400px), rounded corners, drop shadow
- Artist name: Large, bold typography
- Song/Album: Medium typography with subtle styling
- Genre/Year: Small, muted text
- Smooth transitions between states
- Loading animations for recognition state
- Subtle hover effects where appropriate

### Configuration
- Easy way to add/change AcrCloud API credentials
- Adjustable recognition interval
- Volume threshold settings for noise detection

### Error Handling
- Microphone permission denied
- No music recognized
- API rate limit exceeded
- Network connectivity issues
- Invalid API responses

### Performance
- Efficient audio processing to minimize CPU usage
- Proper cleanup of audio contexts and streams
- Reasonable memory usage for long-running sessions
- Fast UI updates and smooth animations

Create this as a single, self-contained HTML file that I can open in a browser to test immediately.