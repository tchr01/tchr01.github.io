import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { parse } from 'csv-parse/sync';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function parseLetterboxdCSV(csvContent) {
  // Find the header line for movies (line with "Position,Name,Year,URL,Description")
  const lines = csvContent.split('\n');
  let headerLineIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Position') && lines[i].includes('Name') && lines[i].includes('Year')) {
      headerLineIndex = i;
      break;
    }
  }

  if (headerLineIndex === -1) {
    throw new Error('Could not find movie data header in CSV. Expected "Position,Name,Year,URL,Description"');
  }

  // Extract the movie data lines (skip header)
  const movieDataLines = lines.slice(headerLineIndex + 1)
    .filter(line => line.trim()); // Remove empty lines

  // Parse CSV starting from the movie data
  const csvData = `Position,Name,Year,URL,Description\n${movieDataLines.join('\n')}`;

  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const movies = records.map(record => ({
    title: record.Name || '',
    year: record.Year ? parseInt(record.Year) : null,
    letterboxdUrl: record.URL || ''
  })).filter(movie => movie.title && movie.letterboxdUrl);

  return movies;
}

async function main() {
  try {
    const csvPath = await promptUser(
      'Enter path to your Letterboxd CSV export (e.g., /path/to/physical.csv): '
    );

    // Resolve the path (handle ~ for home directory)
    let resolvedPath = csvPath;
    if (csvPath.startsWith('~')) {
      resolvedPath = path.join(process.env.HOME, csvPath.slice(1));
    } else {
      resolvedPath = path.resolve(csvPath);
    }

    if (!fs.existsSync(resolvedPath)) {
      console.error(`❌ File not found: ${resolvedPath}`);
      process.exit(1);
    }

    if (!resolvedPath.toLowerCase().endsWith('.csv')) {
      console.error('❌ File must be a CSV file.');
      process.exit(1);
    }

    console.log(`\n🎬 Letterboxd CSV Importer`);
    console.log(`📁 Importing: ${resolvedPath}\n`);

    const csvContent = fs.readFileSync(resolvedPath, 'utf-8');
    const movies = parseLetterboxdCSV(csvContent);

    if (movies.length === 0) {
      throw new Error('No movies found in CSV file.');
    }

    // Save to JSON
    const outputFile = 'movies.json';
    fs.writeFileSync(outputFile, JSON.stringify(movies, null, 2));

    console.log(`✓ Imported ${movies.length} movies from CSV`);
    console.log(`\n✅ Successfully imported ${movies.length} movies!`);
    console.log(`📁 Saved to: ${outputFile}`);
    console.log(`\n📖 Next steps:`);
    console.log(`   1. Open index.html in your browser`);
    console.log(`   2. Enter your TMDb API key (get one at https://www.themoviedb.org/signup)`);
    console.log(`   3. Posters and genres will load automatically!\n`);

    rl.close();
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    rl.close();
    process.exit(1);
  }
}

main();
