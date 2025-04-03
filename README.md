# Art Realm 🎨

Art Realm is a modern, full-stack e-commerce platform for buying and selling artwork. Built with Next.js 14 and styled with Tailwind CSS, it provides a seamless experience for art enthusiasts to discover, purchase, and sell original artwork.

![Art Realm Screenshot](public/images/homepage.png)

## 🌟 Features

### For Art Enthusiasts

- **Browse Artwork**: Explore a curated collection of original artwork
- **Search & Filter**: Find artwork by category, price range, or artist
- **Detailed Product Pages**: View high-resolution images and detailed artwork information
- **Shopping Cart**: Easy-to-use cart system for purchasing multiple items
- **Responsive Design**: Seamless experience across all devices

### For Artists

- **Artist Profiles**: Dedicated pages for artists to showcase their work
- **Artwork Management**: Easy upload and management of artwork listings
- **Sales Dashboard**: Track sales and manage orders

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Headless UI for accessible components
  - Heroicons for icons
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Type Safety**: TypeScript
- **Deployment**: Vercel

## 📦 Project Structure

```
art-realm/
├── src/
│   ├── app/
│   │   ├── artwork/         # Artwork-related pages
│   │   ├── cart/           # Shopping cart
│   │   ├── search/         # Search functionality
│   │   ├── components/     # Reusable components
│   │   ├── data/          # Mock data and constants
│   │   └── utils/         # Utility functions
│   └── ...
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── package.json           
└── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm or yarn
<<<<<<< HEAD
- Git
=======
- PostgreSQL (local installation or remote)
>>>>>>> 0e7c655613cf813c8246e0acb0418c5cebaa5836

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/d3bn4th/art-realm.git
   ```

2. Navigate to the project directory:
   ```bash
   cd art-realm
   ```

<<<<<<< HEAD
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add the necessary environment variables (see Configuration section)

5. Set up the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

6. (Optional) Seed the database with sample data:
   ```bash
   npx prisma db seed
   ```

### Running the Application

1. Start the development server:
=======
3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/art_realm"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

4. Set up the database:
   ```bash
   # Push the Prisma schema to your database
   npx prisma db push
   
   # Seed the database with initial data
   npx prisma db seed
   ```

5. Run the development server:
>>>>>>> 0e7c655613cf813c8246e0acb0418c5cebaa5836
   ```bash
   npm run dev
   # or
   yarn dev
   ```

<<<<<<< HEAD
2. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application

### Building for Production

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm run start
   # or
   yarn start
   ```
=======
6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```
>>>>>>> 0e7c655613cf813c8246e0acb0418c5cebaa5836

## 📱 Key Features Explained

### 1. Homepage

- Hero section with featured artwork
- Grid layout of available artwork
- Quick access to categories

### 2. Artwork Pages

- Individual product pages for each artwork
- High-resolution image display
- Detailed artwork information
- Related artwork suggestions
- Add to cart functionality

### 3. Search & Filter

- Real-time search functionality
- Filter by category
- Sort by price, popularity, etc.

### 4. Shopping Cart

- Add/remove items
- Quantity adjustment
- Price calculations
- Checkout process

### 5. Artist Features

- Artist profile pages
- Artwork management
- Sales tracking

## 🔧 Configuration

### Database Management

You can use Prisma Studio to manage your database visually:

```bash
npx prisma studio
```

This will open a web interface at [http://localhost:5555](http://localhost:5555) where you can view and modify your data.

### Deployment

The project is configured for easy deployment on Vercel:
1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] User authentication
- [ ] Payment integration
- [ ] Artist dashboard
- [ ] Order management system
- [ ] Review and rating system
- [ ] Wishlist functionality
- [ ] Advanced search filters
- [ ] Social sharing features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👥 Team

- Arihant Debnath - [d3bn4th](https://github.com/d3bn4th)
- A Lalith Rahul - [A-L-RAHUL](https://github.com/A-L-RAHUL)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vercel for hosting and deployment
- All contributors who have helped shape this project

---

For more information or support, please open an issue or contact the maintainers.
