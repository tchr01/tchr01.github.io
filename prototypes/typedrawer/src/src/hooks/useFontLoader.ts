import { useState, useCallback, useRef } from 'react';
import { Font } from '../store/fontStore';
import { googleFontsAPI } from '../services/googleFontsAPI';

interface FontLoaderState {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

const fontCache = new Map<string, FontLoaderState>();
const loadingPromises = new Map<string, Promise<void>>();

export const useFontLoader = () => {
  const [state, setState] = useState<FontLoaderState>({
    isLoaded: false,
    isLoading: false,
    error: null,
  });
  
  const currentFontRef = useRef<string | null>(null);

  const loadFont = useCallback(async (font: Font) => {
    const fontId = font.family;
    currentFontRef.current = fontId;

    // Check cache first
    if (fontCache.has(fontId)) {
      const cachedState = fontCache.get(fontId)!;
      setState(cachedState);
      return;
    }

    // Check if already loading
    if (loadingPromises.has(fontId)) {
      setState({ isLoaded: false, isLoading: true, error: null });
      try {
        await loadingPromises.get(fontId);
        if (currentFontRef.current === fontId) {
          const finalState = fontCache.get(fontId) || { isLoaded: false, isLoading: false, error: 'Unknown error' };
          setState(finalState);
        }
      } catch (error) {
        // Error is already handled in the loading promise
      }
      return;
    }

    // Start loading
    setState({ isLoaded: false, isLoading: true, error: null });
    fontCache.set(fontId, { isLoaded: false, isLoading: true, error: null });

    const loadingPromise = loadFontInternal(font);
    loadingPromises.set(fontId, loadingPromise);

    try {
      await loadingPromise;
      const successState = { isLoaded: true, isLoading: false, error: null };
      fontCache.set(fontId, successState);
      
      if (currentFontRef.current === fontId) {
        setState(successState);
      }
    } catch (error) {
      const errorState = {
        isLoaded: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load font'
      };
      fontCache.set(fontId, errorState);
      
      if (currentFontRef.current === fontId) {
        setState(errorState);
      }
    } finally {
      loadingPromises.delete(fontId);
    }
  }, []);

  return {
    ...state,
    loadFont,
  };
};

async function loadFontInternal(font: Font): Promise<void> {
  try {
    // Check if font is already loaded in document.fonts
    const existingFont = Array.from(document.fonts).find(
      f => f.family === `"${font.family}"`
    );
    
    if (existingFont && existingFont.status === 'loaded') {
      return;
    }

    // Create font face
    const fontUrl = googleFontsAPI.generateFontUrl(font, ['400', '700']);
    
    // Load font using CSS
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = fontUrl;
    
    // Wait for font to load
    return new Promise((resolve, reject) => {
      linkElement.onload = () => {
        // Additional check using FontFace API if available
        if ('FontFace' in window && font.files?.regular) {
          const fontFace = new FontFace(
            font.family,
            `url(${font.files.regular})`,
            { display: 'swap' }
          );
          
          fontFace.load()
            .then(() => {
              document.fonts.add(fontFace);
              resolve();
            })
            .catch(() => {
              // Fallback to CSS loading
              resolve();
            });
        } else {
          // Fallback for browsers without FontFace API
          setTimeout(resolve, 100);
        }
      };
      
      linkElement.onerror = () => {
        reject(new Error(`Failed to load font: ${font.family}`));
      };
      
      // Add to document
      if (!document.head.querySelector(`link[href="${fontUrl}"]`)) {
        document.head.appendChild(linkElement);
      } else {
        // Font CSS already exists, just resolve
        setTimeout(resolve, 50);
      }
    });
  } catch (error) {
    throw new Error(`Font loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Utility function to preload fonts
export const preloadFonts = async (fonts: Font[]): Promise<void> => {
  const promises = fonts.map(font => loadFontInternal(font).catch(() => {}));
  await Promise.allSettled(promises);
};

// Utility function to clear font cache
export const clearFontCache = (): void => {
  fontCache.clear();
  loadingPromises.clear();
};