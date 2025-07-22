import React, { useMemo } from 'react';
import { Grid, Paper, Text, Group, ActionIcon, Badge, Stack } from '@mantine/core';
import { IconHeart, IconHeartFilled, IconDownload } from '@tabler/icons-react';
import { Font } from '../store/fontStore';
import { useFontStore } from '../store/fontStore';
import { FontPreview } from './FontPreview';

interface FontGridProps {
  fonts: Font[];
}

export const FontGrid: React.FC<FontGridProps> = ({ fonts }) => {
  const { selectedFonts, toggleFontSelection } = useFontStore();

  const selectedFontObjects = fonts.filter(font => selectedFonts.has(font.family));
  const nonSelectedFonts = fonts.filter(font => !selectedFonts.has(font.family));

  const selectedFontItems = useMemo(() => {
    return selectedFontObjects.map((font) => (
      <Grid.Col key={font.family} span={{ base: 12, sm: 6, lg: 4 }}>
        <FontCard
          font={font}
          isSelected={true}
          onToggleSelection={() => toggleFontSelection(font.family)}
        />
      </Grid.Col>
    ));
  }, [selectedFontObjects, toggleFontSelection]);

  const nonSelectedFontItems = useMemo(() => {
    return nonSelectedFonts.map((font) => (
      <Grid.Col key={font.family} span={{ base: 12, sm: 6, lg: 4 }}>
        <FontCard
          font={font}
          isSelected={false}
          onToggleSelection={() => toggleFontSelection(font.family)}
        />
      </Grid.Col>
    ));
  }, [nonSelectedFonts, toggleFontSelection]);

  if (fonts.length === 0) {
    return (
      <Paper p="xl" ta="center" c="dimmed">
        <Text>No fonts found. Try adjusting your search or filters.</Text>
      </Paper>
    );
  }

  return (
    <Stack gap="lg">
      {selectedFontObjects.length > 0 && (
        <>
          <Group gap="xs">
            <Text fw={600} size="sm" c="blue">
              Selected Fonts
            </Text>
            <Badge variant="light" color="blue" size="sm">
              {selectedFontObjects.length}
            </Badge>
          </Group>
          <Grid>
            {selectedFontItems}
          </Grid>
        </>
      )}
      
      {nonSelectedFonts.length > 0 && (
        <>
          {selectedFontObjects.length > 0 && (
            <Group gap="xs">
              <Text fw={600} size="sm" c="dimmed">
                Available Fonts
              </Text>
            </Group>
          )}
          <Grid>
            {nonSelectedFontItems}
          </Grid>
        </>
      )}
    </Stack>
  );
};

interface FontCardProps {
  font: Font;
  isSelected: boolean;
  onToggleSelection: () => void;
}

const FontCard: React.FC<FontCardProps> = ({ font, isSelected, onToggleSelection }) => {
  return (
    <Paper
      p="md"
      shadow="sm"
      withBorder
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        borderColor: isSelected ? 'var(--mantine-color-blue-5)' : undefined,
      }}
      onClick={onToggleSelection}
    >
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="sm" truncate>
          {font.family}
        </Text>
        
        <Group gap="xs">
          <Badge size="xs" variant="light" color={getCategoryColor(font.category)}>
            {font.category}
          </Badge>
          
          <ActionIcon
            variant={isSelected ? 'filled' : 'light'}
            color="red"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelection();
            }}
          >
            {isSelected ? <IconHeartFilled size={14} /> : <IconHeart size={14} />}
          </ActionIcon>
        </Group>
      </Group>

      <FontPreview 
        font={font} 
        text="The quick brown fox jumps over the lazy dog"
        size="16px"
      />

      <Group justify="space-between" mt="sm">
        <Text size="xs" c="dimmed">
          {font.variants.length} variant{font.variants.length !== 1 ? 's' : ''}
        </Text>
        
        <ActionIcon
          variant="subtle"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement font download
            console.log('Download font:', font.family);
          }}
        >
          <IconDownload size={14} />
        </ActionIcon>
      </Group>
    </Paper>
  );
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'serif': 'blue',
    'sans-serif': 'green',
    'display': 'purple',
    'handwriting': 'pink',
    'monospace': 'gray',
  };
  return colors[category] || 'gray';
};