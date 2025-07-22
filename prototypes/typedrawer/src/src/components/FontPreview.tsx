import React, { useEffect, useState } from 'react';
import { Text, Skeleton } from '@mantine/core';
import { Font } from '../store/fontStore';
import { useFontLoader } from '../hooks/useFontLoader';

interface FontPreviewProps {
  font: Font;
  text?: string;
  size?: string;
  weight?: string;
  className?: string;
}

export const FontPreview: React.FC<FontPreviewProps> = ({
  font,
  text = "The quick brown fox",
  size = "18px",
  weight = "400",
  className
}) => {
  const { loadFont, isLoaded, isLoading, error } = useFontLoader();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadFont(font);
  }, [font, loadFont]);

  if (!mounted) {
    return <Skeleton height={24} />;
  }

  if (isLoading) {
    return <Skeleton height={24} />;
  }

  if (error) {
    return (
      <Text size="sm" c="red" fs="italic">
        Failed to load font
      </Text>
    );
  }

  const fontFamily = isLoaded 
    ? `"${font.family}", sans-serif`
    : 'system-ui, sans-serif';

  return (
    <Text
      style={{
        fontFamily,
        fontSize: size,
        fontWeight: weight,
        transition: 'font-family 0.3s ease',
        opacity: isLoaded ? 1 : 0.7,
        lineHeight: 1.4,
      }}
      className={className}
    >
      {text}
    </Text>
  );
};