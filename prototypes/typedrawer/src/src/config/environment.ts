export const config = {
  googleFontsApiKey: process.env.REACT_APP_GOOGLE_FONTS_API_KEY,
  openaiApiKey: process.env.REACT_APP_OPENAI_API_KEY,
  pineconeApiKey: process.env.REACT_APP_PINECONE_API_KEY,
  pineconeEnvironment: process.env.REACT_APP_PINECONE_ENVIRONMENT,
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  isDevelopment: process.env.REACT_APP_ENVIRONMENT === 'development',
  isProduction: process.env.REACT_APP_ENVIRONMENT === 'production',
};

// Validate required environment variables
export const validateEnvironment = () => {
  const required = {
    googleFontsApiKey: config.googleFontsApiKey,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return missing.length === 0;
};