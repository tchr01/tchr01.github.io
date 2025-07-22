import React, { useEffect, useState } from 'react';
import {
  Grid,
  TextInput,
  Select,
  LoadingOverlay,
  Alert,
  Stack,
  Group,
  Text,
  Button,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconRefresh } from '@tabler/icons-react';
import { useFontStore } from '../store/fontStore';
import { googleFontsAPI } from '../services/googleFontsAPI';
import { FontGrid } from './FontGrid';
import { SelectionPanel } from './SelectionPanel';

export const FontBrowser: React.FC = () => {
  const {
    fonts,
    searchQuery,
    filters,
    loading,
    error,
    currentPage,
    hasMoreFonts,
    totalFonts,
    selectedFonts,
    allLoadedFonts,
    setFonts,
    appendFonts,
    setSearchQuery,
    setFilters,
    setLoading,
    setError,
    clearError,
    setCurrentPage,
    setHasMoreFonts,
    setTotalFonts,
    resetPagination,
  } = useFontStore();

  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Initialize local search with the store's search query
  React.useEffect(() => {
    if (searchQuery && localSearchQuery !== searchQuery) {
      setLocalSearchQuery(searchQuery);
    }
  }, [searchQuery, localSearchQuery]);

  // Create combined font list: selected fonts first, then other fonts
  const combinedFonts = React.useMemo(() => {
    // Get selected fonts from allLoadedFonts
    const selectedFontObjects = allLoadedFonts.filter(font => selectedFonts.has(font.family));
    
    // Get non-selected fonts from current fonts array
    const nonSelectedFonts = fonts.filter(font => !selectedFonts.has(font.family));
    
    // Combine: selected fonts first, then non-selected
    return [...selectedFontObjects, ...nonSelectedFonts];
  }, [fonts, selectedFonts, allLoadedFonts]);

  const loadFonts = async (isLoadMore: boolean = false) => {
    try {
      setLoading(true);
      clearError();
      
      const pageToLoad = isLoadMore ? currentPage + 1 : 0;
      
      let result;
      if (debouncedSearchQuery.trim()) {
        result = await googleFontsAPI.searchFonts(debouncedSearchQuery, {
          page: pageToLoad,
          pageSize: 20
        });
      } else {
        result = await googleFontsAPI.getFonts({
          sort: 'popularity',
          subset: filters.subset !== 'all' ? filters.subset : undefined,
          page: pageToLoad,
          pageSize: 20
        });
      }
      
      // Apply category filter
      let filteredFonts = result.fonts;
      if (filters.category !== 'all') {
        filteredFonts = result.fonts.filter(font => font.category === filters.category);
      }
      
      if (isLoadMore) {
        appendFonts(filteredFonts);
        setCurrentPage(pageToLoad);
      } else {
        setFonts(filteredFonts);
        setCurrentPage(0);
      }
      
      setHasMoreFonts(result.hasMore && filteredFonts.length > 0);
      setTotalFonts(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load fonts');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreFonts = () => {
    if (!loading && hasMoreFonts) {
      loadFonts(true);
    }
  };

  useEffect(() => {
    resetPagination();
    loadFonts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, filters]);

  // Load fonts on component mount
  useEffect(() => {
    if (fonts.length === 0) {
      loadFonts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    setSearchQuery(value);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'serif', label: 'Serif' },
    { value: 'sans-serif', label: 'Sans Serif' },
    { value: 'display', label: 'Display' },
    { value: 'handwriting', label: 'Handwriting' },
    { value: 'monospace', label: 'Monospace' },
  ];

  const subsets = [
    { value: 'all', label: 'All Languages' },
    { value: 'latin', label: 'Latin' },
    { value: 'latin-ext', label: 'Latin Extended' },
    { value: 'cyrillic', label: 'Cyrillic' },
    { value: 'greek', label: 'Greek' },
    { value: 'vietnamese', label: 'Vietnamese' },
  ];

  return (
    <Stack gap="md">
      {/* Selection Panel */}
      <SelectionPanel />
      
      {/* Search and Filters */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            placeholder="Search fonts..."
            value={localSearchQuery}
            onChange={(e) => handleSearchChange(e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            rightSection={
              loading ? undefined : (
                <Button
                  variant="subtle"
                  size="compact-xs"
                  onClick={() => {
                    setLocalSearchQuery('');
                    setSearchQuery('');
                  }}
                  disabled={!localSearchQuery}
                >
                  Clear
                </Button>
              )
            }
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 6, md: 3 }}>
          <Select
            placeholder="Category"
            data={categories}
            value={filters.category}
            onChange={(value) => setFilters({ category: value || 'all' })}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 6, md: 3 }}>
          <Select
            placeholder="Language"
            data={subsets}
            value={filters.subset}
            onChange={(value) => setFilters({ subset: value || 'all' })}
          />
        </Grid.Col>
      </Grid>

      {/* Error Display */}
      {error && (
        <Alert color="red" onClose={clearError}>
          {error}
          <Button
            variant="subtle"
            size="compact-sm"
            leftSection={<IconRefresh size={16} />}
            onClick={() => loadFonts()}
            ml="md"
          >
            Retry
          </Button>
        </Alert>
      )}

      {/* Results Info */}
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          {combinedFonts.length} fonts ({selectedFonts.size} selected)
          {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
        </Text>
        
        {!loading && (
          <Button
            variant="subtle"
            size="compact-sm"
            leftSection={<IconRefresh size={16} />}
            onClick={() => loadFonts()}
          >
            Refresh
          </Button>
        )}
      </Group>

      {/* Font Grid */}
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading && currentPage === 0} />
        <FontGrid fonts={combinedFonts} />
        
        {/* Load More Button */}
        {hasMoreFonts && (
          <Group justify="center" mt="xl">
            <Button
              variant="outline"
              size="md"
              loading={loading}
              onClick={loadMoreFonts}
              disabled={loading}
            >
              Load More Fonts ({fonts.length} of {totalFonts})
            </Button>
          </Group>
        )}
        
        {!hasMoreFonts && fonts.length > 0 && (
          <Group justify="center" mt="xl">
            <Text size="sm" c="dimmed">
              All fonts loaded ({fonts.length} total)
            </Text>
          </Group>
        )}
      </div>
    </Stack>
  );
};