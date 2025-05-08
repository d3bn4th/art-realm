# Getting Started with Art Realm

This guide will help you set up the Art Realm project locally for development.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.0 or later
- npm or yarn package manager
- Git

## Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/d3bn4th/art-realm.git
   cd art-realm
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following variables:
   
   ```
   NEXT_PUBLIC_API_URL=your_api_url
   # Add other environment variables as needed
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**

   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure Overview

The project follows a standard Next.js 14 structure:

- `src/app/`: Main application code following Next.js App Router pattern
  - `components/`: Reusable UI components
  - `artwork/`: Artwork listing and detail pages
  - `artist/`: Artist profile pages
  - `cart/`: Shopping cart functionality
  - `checkout/`: Checkout process
  - `data/`: Mock data and constants
  - `utils/`: Utility functions
  - `types/`: TypeScript type definitions

## Development Workflow

1. Create a new branch for your feature or bug fix
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Troubleshooting

If you encounter any issues during setup:

1. Ensure you're using the correct Node.js version
2. Delete the `.next` folder and node_modules, then reinstall
3. Check for any error messages in the console
4. Verify your environment variables

For additional help, open an issue on GitHub. 
