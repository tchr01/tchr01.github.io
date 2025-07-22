import React, { useState } from 'react';
import {
  Container,
  Stack,
  Title,
  Text,
  TextInput,
  Button,
  Paper,
  Group,
  SimpleGrid,
  Badge,
  Center,
  Box,
} from '@mantine/core';
import { IconSearch, IconSparkles, IconArrowRight } from '@tabler/icons-react';

interface WelcomeScreenProps {
  onSearch: (query: string) => void;
  onQuickStart: (pairing: PredefinedPairing) => void;
}

interface PredefinedPairing {
  id: string;
  name: string;
  description: string;
  headlineFont: string;
  bodyFont: string;
  mood: string;
  useCase: string;
}

const predefinedPairings: PredefinedPairing[] = [
  {
    id: 'modern-clean',
    name: 'Modern & Clean',
    description: 'Perfect for tech startups and SaaS platforms',
    headlineFont: 'Inter',
    bodyFont: 'Source Sans Pro',
    mood: 'professional, minimalist, trustworthy',
    useCase: 'Landing pages, dashboards, apps'
  },
  {
    id: 'elegant-editorial',
    name: 'Elegant Editorial',
    description: 'Sophisticated pairing for luxury brands',
    headlineFont: 'Playfair Display',
    bodyFont: 'Source Serif Pro',
    mood: 'elegant, sophisticated, premium',
    useCase: 'Magazines, blogs, portfolios'
  },
  {
    id: 'friendly-approachable',
    name: 'Friendly & Approachable',
    description: 'Warm and inviting for community brands',
    headlineFont: 'Nunito',
    bodyFont: 'Open Sans',
    mood: 'friendly, warm, accessible',
    useCase: 'Non-profits, education, healthcare'
  },
  {
    id: 'bold-impactful',
    name: 'Bold & Impactful',
    description: 'Strong presence for creative agencies',
    headlineFont: 'Oswald',
    bodyFont: 'Lato',
    mood: 'bold, confident, creative',
    useCase: 'Agencies, portfolios, events'
  },
  {
    id: 'classic-timeless',
    name: 'Classic & Timeless',
    description: 'Traditional elegance for established brands',
    headlineFont: 'Merriweather',
    bodyFont: 'PT Sans',
    mood: 'classic, trustworthy, established',
    useCase: 'Corporate, finance, law'
  }
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSearch, onQuickStart }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl" align="center">
        {/* Hero Section */}
        <Box ta="center">
          <Title order={1} size="3rem" fw={800} mb="md">
            TypeDrawer
          </Title>
          <Text size="xl" c="dimmed" mb="xl">
            Discover perfect font pairings for your project
          </Text>
        </Box>

        {/* Main Search */}
        <Paper p="xl" shadow="md" radius="lg" w="100%" maw={600}>
          <Stack gap="lg">
            <Group gap="sm">
              <IconSparkles size={20} color="var(--mantine-color-blue-5)" />
              <Text fw={600} size="lg">
                Describe the feel of your project
              </Text>
            </Group>
            
            <Text size="sm" c="dimmed">
              Tell us about your project's personality, target audience, or the mood you want to create. 
              We'll help you find typeface pairings that bring your vision to life.
            </Text>

            <TextInput
              placeholder="e.g., modern tech startup, elegant wedding invitation, playful children's book..."
              size="lg"
              leftSection={<IconSearch size={20} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              onKeyPress={handleKeyPress}
              rightSection={
                <Button
                  variant="filled"
                  size="sm"
                  onClick={handleSearch}
                  disabled={!searchQuery.trim()}
                  rightSection={<IconArrowRight size={16} />}
                >
                  Find Fonts
                </Button>
              }
              styles={{
                input: {
                  paddingRight: searchQuery.trim() ? '120px' : '40px',
                },
              }}
            />
          </Stack>
        </Paper>

        {/* Divider */}
        <Group w="100%" maw={600}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--mantine-color-gray-3)' }} />
          <Text size="sm" c="dimmed" px="md">or choose a starting point</Text>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--mantine-color-gray-3)' }} />
        </Group>

        {/* Predefined Pairings */}
        <Stack w="100%" maw={800}>
          <Center>
            <Text fw={600} size="lg">
              Popular Font Pairings
            </Text>
          </Center>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {predefinedPairings.map((pairing) => (
              <Paper
                key={pairing.id}
                p="md"
                withBorder
                radius="md"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => onQuickStart(pairing)}
              >
                <Stack gap="sm">
                  <Text fw={600} size="sm">
                    {pairing.name}
                  </Text>
                  
                  <Text size="xs" c="dimmed" lineClamp={2}>
                    {pairing.description}
                  </Text>
                  
                  <Stack gap="xs">
                    <Group gap="xs">
                      <Text size="xs" c="dimmed">Headline:</Text>
                      <Badge variant="light" size="xs">{pairing.headlineFont}</Badge>
                    </Group>
                    <Group gap="xs">
                      <Text size="xs" c="dimmed">Body:</Text>
                      <Badge variant="light" size="xs">{pairing.bodyFont}</Badge>
                    </Group>
                  </Stack>
                  
                  <Text size="xs" c="blue" fw={500}>
                    {pairing.useCase}
                  </Text>
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>

        {/* Footer */}
        <Text size="xs" c="dimmed" ta="center" mt="xl">
          AI-powered recommendations coming soon. Currently showing curated pairings.
        </Text>
      </Stack>
    </Container>
  );
};