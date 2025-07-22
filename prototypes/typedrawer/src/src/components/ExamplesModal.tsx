import React from 'react';
import { Modal, Stack, Title, SimpleGrid, Paper, Text, Group, Button, Badge } from '@mantine/core';
import { IconDownload, IconCopy } from '@tabler/icons-react';
import { Font } from '../store/fontStore';

interface ExamplesModalProps {
  opened: boolean;
  onClose: () => void;
  fonts: Font[];
}

interface TemplateExample {
  id: string;
  name: string;
  description: string;
  headlineText: string;
  bodyText: string;
  styles: {
    headline: React.CSSProperties;
    body: React.CSSProperties;
  };
  colorScheme: {
    background: string;
    headlineColor: string;
    bodyColor: string;
    accent?: string;
  };
}

const templates: TemplateExample[] = [
  {
    id: 'landing-hero',
    name: 'Landing Page Hero',
    description: 'Bold, conversion-focused headline with compelling copy',
    headlineText: 'Launch Your Dream Business in 30 Days',
    bodyText: 'Join 50,000+ entrepreneurs who transformed their ideas into profitable ventures. Get the step-by-step blueprint, expert mentorship, and tools you need to succeed.',
    styles: {
      headline: { fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '1.5rem', fontWeight: '800' },
      body: { fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '2rem', fontWeight: '400' }
    },
    colorScheme: {
      background: '#1a1b3e',
      headlineColor: '#ffffff',
      bodyColor: '#e2e8f0',
      accent: '#3b82f6'
    }
  },
  {
    id: 'landing-feature',
    name: 'Feature Section',
    description: 'Product benefits with clear value proposition',
    headlineText: 'Everything You Need, Nothing You Don\'t',
    bodyText: 'Smart automation handles the boring stuff so you can focus on growth. Real-time analytics, seamless integrations, and 24/7 support included.',
    styles: {
      headline: { fontSize: '2.75rem', lineHeight: '1.2', marginBottom: '1.5rem', fontWeight: '700' },
      body: { fontSize: '1.125rem', lineHeight: '1.7', marginBottom: '1.5rem', fontWeight: '400' }
    },
    colorScheme: {
      background: '#0f172a',
      headlineColor: '#f1f5f9',
      bodyColor: '#cbd5e1',
      accent: '#06b6d4'
    }
  },
  {
    id: 'card-product',
    name: 'Product Card',
    description: 'E-commerce style with price and features',
    headlineText: 'Pro Plan',
    bodyText: 'Perfect for growing teams. Unlimited projects, advanced analytics, priority support, and custom integrations.',
    styles: {
      headline: { fontSize: '1.75rem', lineHeight: '1.3', marginBottom: '0.75rem', fontWeight: '700' },
      body: { fontSize: '1rem', lineHeight: '1.5', marginBottom: '1rem', fontWeight: '400' }
    },
    colorScheme: {
      background: '#064e3b',
      headlineColor: '#ecfdf5',
      bodyColor: '#a7f3d0',
      accent: '#10b981'
    }
  },
  {
    id: 'card-testimonial',
    name: 'Testimonial Card',
    description: 'Social proof with personal touch',
    headlineText: '"Game-changing platform"',
    bodyText: 'This tool completely transformed how we work. Our productivity increased by 300% and client satisfaction is through the roof. Couldn\'t imagine working without it.',
    styles: {
      headline: { fontSize: '1.5rem', lineHeight: '1.4', marginBottom: '1rem', fontWeight: '600', fontStyle: 'italic' as const },
      body: { fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem', fontWeight: '400' }
    },
    colorScheme: {
      background: '#4c1d95',
      headlineColor: '#f3e8ff',
      bodyColor: '#ddd6fe',
      accent: '#8b5cf6'
    }
  },
  {
    id: 'card-blog',
    name: 'Blog Preview Card',
    description: 'Article preview with engaging headline',
    headlineText: '10 Design Mistakes That Kill Conversions',
    bodyText: 'Learn the subtle design flaws that are costing you customers and discover the simple fixes that can double your conversion rates overnight.',
    styles: {
      headline: { fontSize: '1.4rem', lineHeight: '1.3', marginBottom: '0.75rem', fontWeight: '600' },
      body: { fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem', fontWeight: '400' }
    },
    colorScheme: {
      background: '#7c2d12',
      headlineColor: '#fed7aa',
      bodyColor: '#fdba74',
      accent: '#fb923c'
    }
  },
  {
    id: 'landing-cta',
    name: 'Call-to-Action Section',
    description: 'Urgency-driven final push for conversions',
    headlineText: 'Ready to 10x Your Results?',
    bodyText: 'Join the exclusive beta program starting January 2025. Limited to 100 founding members who will get lifetime access at 50% off.',
    styles: {
      headline: { fontSize: '3rem', lineHeight: '1.1', marginBottom: '1.5rem', fontWeight: '800' },
      body: { fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2rem', fontWeight: '500' }
    },
    colorScheme: {
      background: '#0c4a6e',
      headlineColor: '#e0f2fe',
      bodyColor: '#bae6fd',
      accent: '#0ea5e9'
    }
  }
];

export const ExamplesModal: React.FC<ExamplesModalProps> = ({ opened, onClose, fonts }) => {
  const headlineFont = fonts[0];
  const bodyFont = fonts[1] || fonts[0];

  const copyToClipboard = (template: TemplateExample) => {
    const cssCode = `
/* ${template.name} Typography & Colors */
.container {
  background-color: ${template.colorScheme.background};
  padding: 1.5rem;
  border-radius: 12px;
  ${template.colorScheme.accent ? `border-left: 4px solid ${template.colorScheme.accent};` : ''}
}

.headline {
  font-family: "${headlineFont.family}", ${headlineFont.category === 'serif' ? 'serif' : 'sans-serif'};
  font-size: ${template.styles.headline.fontSize};
  line-height: ${template.styles.headline.lineHeight};
  font-weight: ${template.styles.headline.fontWeight};
  margin-bottom: ${template.styles.headline.marginBottom};
  color: ${template.colorScheme.headlineColor};
  ${template.styles.headline.fontStyle ? `font-style: ${template.styles.headline.fontStyle};` : ''}
  ${template.styles.headline.textTransform ? `text-transform: ${template.styles.headline.textTransform};` : ''}
}

.body {
  font-family: "${bodyFont.family}", ${bodyFont.category === 'serif' ? 'serif' : 'sans-serif'};
  font-size: ${template.styles.body.fontSize};
  line-height: ${template.styles.body.lineHeight};
  font-weight: ${template.styles.body.fontWeight};
  margin-bottom: ${template.styles.body.marginBottom};
  color: ${template.colorScheme.bodyColor};
}

/* WCAG AA Compliant Colors:
   Background: ${template.colorScheme.background}
   Headline: ${template.colorScheme.headlineColor} (contrast ratio > 4.5:1)
   Body: ${template.colorScheme.bodyColor} (contrast ratio > 4.5:1)
   ${template.colorScheme.accent ? `Accent: ${template.colorScheme.accent}` : ''}
*/`;
    
    navigator.clipboard.writeText(cssCode);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group>
          <Title order={3}>Font Pairing Examples</Title>
          <Badge variant="light">
            {headlineFont?.family} + {bodyFont?.family}
          </Badge>
        </Group>
      }
      size="xl"
    >
      <Stack gap="lg">
        <Text c="dimmed">
          Here are different ways to use your selected font pairing across various design contexts.
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {templates.map((template) => (
            <Paper key={template.id} p="lg" withBorder>
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Text fw={600} size="sm">{template.name}</Text>
                    <Text size="xs" c="dimmed">{template.description}</Text>
                  </div>
                  
                  <Group gap="xs">
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      leftSection={<IconCopy size={12} />}
                      onClick={() => copyToClipboard(template)}
                    >
                      CSS
                    </Button>
                  </Group>
                </Group>

                <div style={{ 
                  padding: '1.5rem', 
                  backgroundColor: template.colorScheme.background, 
                  borderRadius: '12px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {template.colorScheme.accent && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      backgroundColor: template.colorScheme.accent
                    }} />
                  )}
                  
                  <div style={{ 
                    color: template.colorScheme.headlineColor,
                    fontFamily: headlineFont?.family || 'sans-serif',
                    fontSize: template.styles.headline.fontSize,
                    fontWeight: template.styles.headline.fontWeight,
                    lineHeight: template.styles.headline.lineHeight,
                    marginBottom: template.styles.headline.marginBottom,
                    fontStyle: template.styles.headline.fontStyle
                  }}>
                    {template.headlineText}
                  </div>
                  
                  <div style={{ 
                    color: template.colorScheme.bodyColor,
                    fontFamily: bodyFont?.family || 'serif',
                    fontSize: template.styles.body.fontSize,
                    fontWeight: template.styles.body.fontWeight,
                    lineHeight: template.styles.body.lineHeight,
                    marginBottom: template.styles.body.marginBottom
                  }}>
                    {template.bodyText}
                  </div>
                </div>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>

        <Paper p="md" bg="blue.0">
          <Group justify="space-between">
            <div>
              <Text fw={600} size="sm">Export Options</Text>
              <Text size="xs" c="dimmed">Download or copy your font pairing for use in design tools</Text>
            </div>
            <Button leftSection={<IconDownload size={16} />} variant="light">
              Export All CSS
            </Button>
          </Group>
        </Paper>
      </Stack>
    </Modal>
  );
};