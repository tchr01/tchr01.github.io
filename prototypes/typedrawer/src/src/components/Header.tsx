import React from 'react';
import { Group, Text, Button } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import { config } from '../config/environment';
import { useFontStore } from '../store/fontStore';

export const Header: React.FC = () => {
  const { setShowWelcomeScreen, resetPagination, setSearchQuery } = useFontStore();

  const handleBackToWelcome = () => {
    resetPagination();
    setSearchQuery('');
    setShowWelcomeScreen(true);
  };

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Button
          variant="subtle"
          leftSection={<IconHome size={16} />}
          onClick={handleBackToWelcome}
        >
          TypeDrawer
        </Button>
        <Text size="sm" c="dimmed">
          Google Fonts Design Tool
        </Text>
      </Group>
      
      {config.isDevelopment && (
        <Text size="xs" c="orange">
          Development Mode
        </Text>
      )}
    </Group>
  );
};