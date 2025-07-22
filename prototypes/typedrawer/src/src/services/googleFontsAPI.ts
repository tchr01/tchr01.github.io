import { config, validateEnvironment } from '../config/environment';
import { Font } from '../store/fontStore';

export interface GoogleFontsResponse {
  kind: string;
  items: Font[];
}

class GoogleFontsAPIManager {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/webfonts/v1/webfonts';
  private cache = new Map<string, any>();
  private requests: number[] = [];
  private rateLimit = 100; // requests per minute

  constructor() {
    if (!config.googleFontsApiKey) {
      throw new Error('Google Fonts API key is required');
    }
    this.apiKey = config.googleFontsApiKey;
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    // Remove requests older than 1 minute
    this.requests = this.requests.filter(time => now - time < 60000);
    
    if (this.requests.length >= this.rateLimit) {
      const waitTime = 60000 - (now - this.requests[0]);
      console.warn(`Rate limit exceeded. Waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  async getFonts(options: {
    sort?: 'alpha' | 'date' | 'popularity' | 'style' | 'trending';
    subset?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<{ fonts: Font[]; total: number; hasMore: boolean }> {
    if (!validateEnvironment()) {
      throw new Error('Invalid environment configuration');
    }

    const { page = 0, pageSize = 20, ...restOptions } = options;
    const cacheKey = `fonts_${JSON.stringify({ page, pageSize, ...restOptions })}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    await this.checkRateLimit();

    const url = new URL(this.baseUrl);
    url.searchParams.append('key', this.apiKey);
    
    // Set default sort to popularity
    url.searchParams.append('sort', restOptions.sort || 'popularity');
    
    if (restOptions.subset) {
      url.searchParams.append('subset', restOptions.subset);
    }

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GoogleFontsResponse = await response.json();
      
      // Implement client-side pagination since Google Fonts API doesn't support it
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedFonts = data.items.slice(startIndex, endIndex);
      const hasMore = endIndex < data.items.length;
      
      const result = {
        fonts: paginatedFonts,
        total: data.items.length,
        hasMore
      };
      
      this.requests.push(Date.now());
      this.cache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Failed to fetch fonts:', error);
      throw new Error('Failed to fetch fonts from Google Fonts API');
    }
  }

  async searchFonts(query: string, options: {
    page?: number;
    pageSize?: number;
  } = {}): Promise<{ fonts: Font[]; total: number; hasMore: boolean }> {
    const { page = 0, pageSize = 20 } = options;
    
    // For search, we need to get all fonts first, then filter and paginate
    const allFontsResult = await this.getFonts({ page: 0, pageSize: 1000 }); // Get more fonts for search
    
    const searchTerm = query.toLowerCase().trim();
    let filteredFonts = allFontsResult.fonts;
    
    if (searchTerm) {
      filteredFonts = allFontsResult.fonts.filter(font => 
        font.family.toLowerCase().includes(searchTerm) ||
        font.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply pagination to filtered results
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedFonts = filteredFonts.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredFonts.length;
    
    return {
      fonts: paginatedFonts,
      total: filteredFonts.length,
      hasMore
    };
  }

  generateFontUrl(font: Font, variants: string[] = ['400']): string {
    const baseUrl = 'https://fonts.googleapis.com/css2';
    const family = `${font.family}:wght@${variants.join(';')}`;
    return `${baseUrl}?family=${encodeURIComponent(family)}&display=swap`;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const googleFontsAPI = new GoogleFontsAPIManager();