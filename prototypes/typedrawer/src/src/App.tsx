import React from 'react';
import { AppShell, Container } from '@mantine/core';
import './App.css';
import { FontBrowser } from './components/FontBrowser';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useFontStore, Font } from './store/fontStore';
import { googleFontsAPI } from './services/googleFontsAPI';

function App() {
  const { 
    showWelcomeScreen, 
    setShowWelcomeScreen, 
    setSearchQuery, 
    setInitialSearchQuery,
    selectedFonts,
    toggleFontSelection 
  } = useFontStore();

  const handleSearch = (query: string) => {
    setInitialSearchQuery(query);
    setSearchQuery(query);
    setShowWelcomeScreen(false);
  };

  const handleQuickStart = async (pairing: any) => {
    const { addToAllLoadedFonts } = useFontStore.getState();
    
    try {
      // Load the specific fonts for the pairing
      const result = await googleFontsAPI.getFonts({ pageSize: 100 });
      const headlineFont = result.fonts.find(f => f.family === pairing.headlineFont);
      const bodyFont = result.fonts.find(f => f.family === pairing.bodyFont);
      
      // Add fonts to cache first
      const fontsToAdd = [headlineFont, bodyFont].filter(Boolean) as Font[];
      if (fontsToAdd.length > 0) {
        addToAllLoadedFonts(fontsToAdd);
      }
      
      // Select both fonts
      if (headlineFont && !selectedFonts.has(headlineFont.family)) {
        toggleFontSelection(headlineFont.family);
      }
      if (bodyFont && !selectedFonts.has(bodyFont.family)) {
        toggleFontSelection(bodyFont.family);
      }
      
      // Set search query to the mood/description
      setInitialSearchQuery(pairing.mood);
      setSearchQuery(pairing.mood);
      setShowWelcomeScreen(false);
    } catch (error) {
      // Fallback: just search for the mood
      setInitialSearchQuery(pairing.mood);
      setSearchQuery(pairing.mood);
      setShowWelcomeScreen(false);
    }
  };

  if (showWelcomeScreen) {
    return <WelcomeScreen onSearch={handleSearch} onQuickStart={handleQuickStart} />;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      
      <AppShell.Main>
        <Container size="xl">
          <FontBrowser />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
