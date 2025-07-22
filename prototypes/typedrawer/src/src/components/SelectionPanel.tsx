import React, { useState } from 'react';
import { Paper, Group, Text, Button, Badge, ActionIcon, Stack } from '@mantine/core';
import { IconX, IconEye } from '@tabler/icons-react';
import { useFontStore } from '../store/fontStore';
import { ExamplesModal } from './ExamplesModal';

export const SelectionPanel: React.FC = () => {
  const { selectedFonts, allLoadedFonts, toggleFontSelection } = useFontStore();
  const [examplesOpened, setExamplesOpened] = useState(false);


  const selectedFontObjects = allLoadedFonts.filter(font => selectedFonts.has(font.family));
  const canGenerateExamples = selectedFonts.size >= 2;

  if (selectedFonts.size === 0) {
    return null;
  }

  return (
    <Paper p="md" shadow="sm" withBorder style={{ position: 'sticky', top: 20, zIndex: 100 }}>
      <Stack gap="sm">
        <Group justify="space-between">
          <Group>
            <Text fw={600}>Selected Fonts</Text>
            <Badge variant="light" color="blue">
              {selectedFonts.size}
            </Badge>
          </Group>
          
          {canGenerateExamples && (
            <Button
              leftSection={<IconEye size={16} />}
              onClick={() => setExamplesOpened(true)}
            >
              Generate Examples
            </Button>
          )}
        </Group>

        <Group gap="xs">
          {selectedFontObjects.map(font => (
            <Badge
              key={font.family}
              variant="filled"
              color="blue"
              size="lg"
              rightSection={
                <ActionIcon
                  size="xs"
                  color="white"
                  radius="xl"
                  variant="transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFontSelection(font.family);
                  }}
                  style={{ color: 'white' }}
                >
                  <IconX size={12} stroke={2} />
                </ActionIcon>
              }
            >
              {font.family}
            </Badge>
          ))}
        </Group>

        {selectedFonts.size === 1 && (
          <Text size="sm" c="dimmed">
            Select one more font to generate examples
          </Text>
        )}
        
        {selectedFonts.size > 2 && (
          <Text size="sm" c="orange">
            Note: Examples will use the first two selected fonts
          </Text>
        )}
        
        {selectedFonts.size > 0 && (
          <Text size="xs" c="dimmed">
            Selected fonts persist across searches and filters
          </Text>
        )}

        <ExamplesModal
          opened={examplesOpened}
          onClose={() => setExamplesOpened(false)}
          fonts={selectedFontObjects.slice(0, 2)}
        />
      </Stack>
    </Paper>
  );
};