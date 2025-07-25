// Letterboxd Collection Interactive Infographic
// Inspired by mid-2000s data visualization aesthetics

// Sample movie data structure - replace with your actual Letterboxd data
Movie[] movies;
int numMovies = 50;
float[] movieX, movieY;
float[] movieSize;
String[] movieTitles;
int[] movieYears;
float[] movieRatings;
String[] movieGenres;

// Visual properties
color bgColor = color(0, 0, 0);
color primaryColor = color(0, 255, 0);
color secondaryColor = color(0, 100, 255);
color accentColor = color(255, 255, 0);

// Interaction
int selectedMovie = -1;
boolean showConnections = false;
float connectionAlpha = 0;

// Animation
float time = 0;
float pulseSpeed = 0.05;

void setup() {
  size(800, 600);
  colorMode(RGB, 255);
  
  // Initialize sample data
  initializeMovieData();
  
  // Set initial positions
  layoutMovies();
}

void draw() {
  background(bgColor);
  time += pulseSpeed;
  
  // Draw grid background (retro aesthetic)
  drawGrid();
  
  // Draw connections between similar movies
  if (showConnections) {
    drawConnections();
  }
  
  // Draw movies as interactive nodes
  drawMovies();
  
  // Draw UI and information
  drawUI();
  
  // Handle hover effects
  updateHover();
}

void initializeMovieData() {
  movieX = new float[numMovies];
  movieY = new float[numMovies];
  movieSize = new float[numMovies];
  movieTitles = new String[numMovies];
  movieYears = new int[numMovies];
  movieRatings = new float[numMovies];
  movieGenres = new String[numMovies];
  
  // Sample data - replace with your Letterboxd collection
  String[] sampleTitles = {
    "Blade Runner", "2001: A Space Odyssey", "The Matrix", "Pulp Fiction",
    "Goodfellas", "The Godfather", "Citizen Kane", "Vertigo", "Casablanca",
    "Singin' in the Rain", "Some Like It Hot", "The Apartment", "Sunset Blvd.",
    "Double Indemnity", "The Third Man", "Touch of Evil", "Psycho", "North by Northwest",
    "Rear Window", "The Birds", "Alien", "Aliens", "Terminator 2", "The Shining",
    "A Clockwork Orange", "Dr. Strangelove", "Full Metal Jacket", "Eyes Wide Shut",
    "Barry Lyndon", "The Departed", "Goodwill Hunting", "The Social Network",
    "Fight Club", "Se7en", "The Game", "Zodiac", "Gone Girl", "Fincher's Best",
    "Mulholland Drive", "Blue Velvet", "Lost Highway", "The Elephant Man",
    "Eraserhead", "Dune", "Twin Peaks", "Wild at Heart", "The Straight Story",
    "Inland Empire", "Akira", "Ghost in the Shell"
  };
  
  String[] sampleGenres = {
    "Sci-Fi", "Sci-Fi", "Sci-Fi", "Crime", "Crime", "Crime", "Drama", "Thriller",
    "Romance", "Musical", "Comedy", "Drama", "Noir", "Noir", "Noir", "Noir",
    "Horror", "Thriller", "Thriller", "Horror", "Horror", "Action", "Action",
    "Horror", "Sci-Fi", "Comedy", "War", "Drama", "Period", "Crime", "Drama",
    "Drama", "Thriller", "Thriller", "Thriller", "Thriller", "Thriller", "Drama",
    "Surreal", "Mystery", "Surreal", "Drama", "Surreal", "Sci-Fi", "Drama",
    "Comedy", "Drama", "Surreal", "Animation", "Animation"
  };
  
  for (int i = 0; i < numMovies; i++) {
    movieTitles[i] = sampleTitles[i % sampleTitles.length];
    movieYears[i] = (int)random(1940, 2020);
    movieRatings[i] = random(3.0, 5.0);
    movieGenres[i] = sampleGenres[i % sampleGenres.length];
    movieSize[i] = map(movieRatings[i], 3.0, 5.0, 8, 25);
  }
}

void layoutMovies() {
  // Scatter plot layout based on year vs rating
  for (int i = 0; i < numMovies; i++) {
    movieX[i] = map(movieYears[i], 1940, 2020, 100, width - 100);
    movieY[i] = map(movieRatings[i], 3.0, 5.0, height - 100, 100);
    
    // Add some organic scatter
    movieX[i] += random(-20, 20);
    movieY[i] += random(-15, 15);
  }
}

void drawGrid() {
  stroke(primaryColor, 30);
  strokeWeight(1);
  
  // Vertical lines
  for (int x = 0; x < width; x += 40) {
    line(x, 0, x, height);
  }
  
  // Horizontal lines
  for (int y = 0; y < height; y += 40) {
    line(0, y, width, y);
  }
  
  // Axis labels
  fill(primaryColor, 150);
  textAlign(CENTER);
  text("YEAR", width/2, height - 20);
  
  pushMatrix();
  translate(30, height/2);
  rotate(-PI/2);
  text("RATING", 0, 0);
  popMatrix();
}

void drawConnections() {
  connectionAlpha = lerp(connectionAlpha, 255, 0.1);
  
  for (int i = 0; i < numMovies; i++) {
    for (int j = i + 1; j < numMovies; j++) {
      if (movieGenres[i].equals(movieGenres[j])) {
        stroke(secondaryColor, connectionAlpha * 0.3);
        strokeWeight(1);
        line(movieX[i], movieY[i], movieX[j], movieY[j]);
      }
    }
  }
}

void drawMovies() {
  for (int i = 0; i < numMovies; i++) {
    boolean isHovered = dist(mouseX, mouseY, movieX[i], movieY[i]) < movieSize[i];
    boolean isSelected = (selectedMovie == i);
    
    // Pulsing effect
    float pulse = sin(time + i * 0.5) * 3;
    float currentSize = movieSize[i] + pulse;
    
    if (isHovered || isSelected) {
      currentSize += 8;
      
      // Glow effect
      for (int r = (int)currentSize + 20; r > 0; r--) {
        fill(primaryColor, 255 - r * 8);
        noStroke();
        ellipse(movieX[i], movieY[i], r, r);
      }
    }
    
    // Main movie node
    fill(getGenreColor(movieGenres[i]));
    stroke(primaryColor, 200);
    strokeWeight(2);
    ellipse(movieX[i], movieY[i], currentSize, currentSize);
    
    // Inner rating indicator
    fill(accentColor, 180);
    noStroke();
    float ratingSize = map(movieRatings[i], 3.0, 5.0, 3, currentSize * 0.6);
    ellipse(movieX[i], movieY[i], ratingSize, ratingSize);
    
    // Show title on hover
    if (isHovered || isSelected) {
      drawMovieInfo(i, movieX[i], movieY[i]);
    }
  }
}

color getGenreColor(String genre) {
  if (genre.equals("Sci-Fi")) return color(0, 200, 255);
  if (genre.equals("Horror")) return color(255, 50, 50);
  if (genre.equals("Crime")) return color(255, 150, 0);
  if (genre.equals("Drama")) return color(150, 255, 150);
  if (genre.equals("Comedy")) return color(255, 255, 100);
  if (genre.equals("Thriller")) return color(200, 100, 255);
  if (genre.equals("Action")) return color(255, 100, 100);
  return primaryColor;
}

void drawMovieInfo(int index, float x, float y) {
  String info = movieTitles[index] + " (" + movieYears[index] + ")";
  String rating = repeatString("★", (int)movieRatings[index]) + " " + nf(movieRatings[index], 1, 1);
  String genre = movieGenres[index];
  
  fill(bgColor, 200);
  stroke(primaryColor);
  strokeWeight(1);
  
  float boxWidth = max(textWidth(info), textWidth(rating)) + 20;
  float boxHeight = 60;
  
  rect(x - boxWidth/2, y - movieSize[index] - boxHeight - 10, boxWidth, boxHeight);
  
  fill(primaryColor);
  textAlign(CENTER);
  text(info, x, y - movieSize[index] - 40);
  text(rating, x, y - movieSize[index] - 25);
  text(genre, x, y - movieSize[index] - 10);
}

void drawUI() {
  // Legend
  fill(primaryColor, 200);
  textAlign(LEFT);
  text("GENRE LEGEND:", 20, 30);
  
  String[] genres = {"Sci-Fi", "Horror", "Crime", "Drama", "Comedy", "Thriller", "Action"};
  for (int i = 0; i < genres.length; i++) {
    fill(getGenreColor(genres[i]));
    ellipse(30, 50 + i * 20, 10, 10);
    fill(primaryColor, 150);
    text(genres[i], 45, 55 + i * 20);
  }
  
  // Mouse position debug
  fill(primaryColor, 100);
  text("Mouse: " + mouseX + ", " + mouseY, 20, height - 60);
  
  // Instructions
  fill(primaryColor, 100);
  textAlign(RIGHT);
  text("SPACEBAR: Toggle connections", width - 20, height - 40);
  text("CLICK: Select movie", width - 20, height - 25);
  text("HOVER: View details", width - 20, height - 10);
}

void updateHover() {
  // Update cursor style - simplified for Processing.js
  boolean overMovie = false;
  for (int i = 0; i < numMovies; i++) {
    if (dist(mouseX, mouseY, movieX[i], movieY[i]) < movieSize[i] + 5) {
      overMovie = true;
      break;
    }
  }
  
  // Processing.js may not support cursor changes, so we'll skip this
  // if (overMovie) {
  //   cursor(HAND);
  // } else {
  //   cursor(ARROW);
  // }
}

void mousePressed() {
  selectedMovie = -1;
  for (int i = 0; i < numMovies; i++) {
    if (dist(mouseX, mouseY, movieX[i], movieY[i]) < movieSize[i]) {
      selectedMovie = i;
      break;
    }
  }
}

void keyPressed() {
  if (key == ' ') {
    showConnections = !showConnections;
    if (!showConnections) {
      connectionAlpha = 0;
    }
  }
  
  // Randomize layout
  if (key == 'r' || key == 'R') {
    layoutMovies();
  }
  
  // Change color scheme
  if (key == 'c' || key == 'C') {
    primaryColor = color(random(100, 255), random(100, 255), random(100, 255));
  }
}

// Helper function for string repeat (Processing.js doesn't have this)
String repeatString(String str, int times) {
  String result = "";
  for (int i = 0; i < times; i++) {
    result += str;
  }
  return result;
}