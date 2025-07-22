import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Font {
  family: string;
  category: string;
  variants: string[];
  subsets: string[];
  files: Record<string, string>;
  version: string;
  lastModified: string;
}

export interface FontPairing {
  headline: Font;
  body: Font;
  score: number;
}

interface FontStore {
  // State
  fonts: Font[];
  selectedFonts: Set<string>;
  searchQuery: string;
  pairings: FontPairing[];
  filters: {
    category: string;
    subset: string;
  };
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasMoreFonts: boolean;
  totalFonts: number;
  showWelcomeScreen: boolean;
  initialSearchQuery: string;
  allLoadedFonts: Font[]; // Cache of all fonts ever loaded

  // Actions
  setFonts: (fonts: Font[]) => void;
  appendFonts: (fonts: Font[]) => void;
  setSearchQuery: (query: string) => void;
  toggleFontSelection: (fontFamily: string) => void;
  setFilters: (filters: Partial<FontStore['filters']>) => void;
  setPairings: (pairings: FontPairing[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setCurrentPage: (page: number) => void;
  setHasMoreFonts: (hasMore: boolean) => void;
  setTotalFonts: (total: number) => void;
  resetPagination: () => void;
  setShowWelcomeScreen: (show: boolean) => void;
  setInitialSearchQuery: (query: string) => void;
  addToAllLoadedFonts: (fonts: Font[]) => void;
}

export const useFontStore = create<FontStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        fonts: [],
        selectedFonts: new Set(),
        searchQuery: '',
        pairings: [],
        filters: {
          category: 'all',
          subset: 'all',
        },
        loading: false,
        error: null,
        currentPage: 0,
        hasMoreFonts: true,
        totalFonts: 0,
        showWelcomeScreen: true,
        initialSearchQuery: '',
        allLoadedFonts: [],

        // Actions
        setFonts: (fonts) => {
          const state = get();
          // Add to all loaded fonts cache
          const uniqueNewFonts = fonts.filter(
            newFont => !state.allLoadedFonts.some(existing => existing.family === newFont.family)
          );
          set({ 
            fonts, 
            currentPage: 0,
            allLoadedFonts: [...state.allLoadedFonts, ...uniqueNewFonts]
          });
        },
        
        appendFonts: (newFonts) => {
          const state = get();
          const uniqueNewFonts = newFonts.filter(
            newFont => !state.fonts.some(existing => existing.family === newFont.family)
          );
          const uniqueToAllLoaded = newFonts.filter(
            newFont => !state.allLoadedFonts.some(existing => existing.family === newFont.family)
          );
          set({ 
            fonts: [...state.fonts, ...uniqueNewFonts],
            allLoadedFonts: [...state.allLoadedFonts, ...uniqueToAllLoaded]
          });
        },
        
        setSearchQuery: (searchQuery) => set({ searchQuery }),
        
        toggleFontSelection: (fontFamily) => {
          const selectedFonts = new Set(get().selectedFonts);
          if (selectedFonts.has(fontFamily)) {
            selectedFonts.delete(fontFamily);
          } else {
            selectedFonts.add(fontFamily);
          }
          set({ selectedFonts });
        },
        
        setFilters: (newFilters) => {
          const filters = { ...get().filters, ...newFilters };
          set({ filters });
        },
        
        setPairings: (pairings) => set({ pairings }),
        
        setLoading: (loading) => set({ loading }),
        
        setError: (error) => set({ error }),
        
        clearError: () => set({ error: null }),
        
        setCurrentPage: (currentPage) => set({ currentPage }),
        
        setHasMoreFonts: (hasMoreFonts) => set({ hasMoreFonts }),
        
        setTotalFonts: (totalFonts) => set({ totalFonts }),
        
        resetPagination: () => set({ 
          currentPage: 0, 
          hasMoreFonts: true, 
          fonts: [],
          totalFonts: 0
        }),
        
        setShowWelcomeScreen: (showWelcomeScreen) => set({ showWelcomeScreen }),
        
        setInitialSearchQuery: (initialSearchQuery) => set({ initialSearchQuery }),
        
        addToAllLoadedFonts: (fonts) => {
          const state = get();
          const uniqueNewFonts = fonts.filter(
            newFont => !state.allLoadedFonts.some(existing => existing.family === newFont.family)
          );
          set({ allLoadedFonts: [...state.allLoadedFonts, ...uniqueNewFonts] });
        },
      }),
      {
        name: 'font-store',
        partialize: (state) => ({
          selectedFonts: Array.from(state.selectedFonts),
          filters: state.filters,
          allLoadedFonts: state.allLoadedFonts,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.selectedFonts = new Set(state.selectedFonts as any);
            state.allLoadedFonts = state.allLoadedFonts || [];
          }
        },
      }
    )
  )
);