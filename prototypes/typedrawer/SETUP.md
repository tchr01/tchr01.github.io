# TypeDrawer Setup Guide

## Environment Setup

### 1. Install Dependencies
```bash
cd src
npm install
```

### 2. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your actual API keys:
```bash
# Required for basic functionality
REACT_APP_GOOGLE_FONTS_API_KEY=your_actual_google_fonts_api_key

# Optional - for advanced AI features
REACT_APP_OPENAI_API_KEY=your_actual_openai_api_key
REACT_APP_PINECONE_API_KEY=your_actual_pinecone_api_key
REACT_APP_PINECONE_ENVIRONMENT=your_pinecone_environment

# Environment setting
REACT_APP_ENVIRONMENT=development
```

### 3. Get API Keys

#### Google Fonts API Key (Required)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Web Fonts Developer API"
4. Go to Credentials → Create Credentials → API Key
5. Restrict the key to "Web Fonts Developer API" for security

#### OpenAI API Key (Optional)
1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Go to API Keys section
3. Create a new secret key

#### Pinecone API Key (Optional)
1. Sign up at [Pinecone](https://www.pinecone.io/)
2. Create a new project
3. Get your API key and environment from the dashboard

## Development

### Start Development Server
```bash
npm run start:dev
```
This starts the app on `http://localhost:3000` with development environment variables.

### Build for Production
```bash
npm run build:prod
```

## Security Notes

- **Never commit `.env.local`** - it's already in `.gitignore`
- **Use environment-specific configs** for different deployment targets
- **Restrict API keys** to specific domains in production
- **Monitor API usage** to avoid unexpected costs

## Project Structure

```
src/
├── src/
│   ├── config/
│   │   └── environment.ts    # Environment configuration
│   ├── components/           # React components
│   ├── services/            # API services
│   └── utils/               # Utility functions
├── .env.example             # Template for environment variables
├── .env.local              # Your actual environment variables (not committed)
└── package.json
```

## Next Steps

1. Set up your `.env.local` file with actual API keys
2. Run `npm run start:dev` to start development
3. Begin implementing the components from the README.md plan