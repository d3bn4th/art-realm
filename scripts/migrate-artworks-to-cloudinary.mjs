/**
 * This script migrates existing artwork images from local storage to Cloudinary
 * 
 * Usage:
 * 1. Ensure your .env.local file has the correct Cloudinary credentials
 * 2. Run this script with: node scripts/migrate-artworks-to-cloudinary.mjs
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (equivalent to __dirname in CJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

async function uploadToCloudinary(imagePath) {
  try {
    // Check if the file exists
    const fullPath = path.join(projectRoot, 'public', imagePath);
    try {
      await fs.promises.access(fullPath, fs.constants.F_OK);
    } catch (err) {
      console.error(`File not found: ${imagePath}`, err.message);
      return null;
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      fullPath,
      { folder: 'art-realm' }
    );
    
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${imagePath}:`, error);
    return null;
  }
}

async function migrateArtworksToCloudinary() {
  try {
    console.log('Starting artwork migration to Cloudinary...');
    
    // Get all artworks
    const artworks = await prisma.artwork.findMany();
    console.log(`Found ${artworks.length} artworks to process`);
    
    // Track success and failures
    let success = 0;
    let failed = 0;
    
    // Process each artwork
    for (const artwork of artworks) {
      // Skip if the image URL is already a Cloudinary URL
      if (artwork.image && artwork.image.includes('cloudinary.com')) {
        console.log(`Artwork ${artwork.id} (${artwork.title}) already on Cloudinary, skipping`);
        success++;
        continue;
      }
      
      // Skip if no image
      if (!artwork.image) {
        console.log(`Artwork ${artwork.id} (${artwork.title}) has no image, skipping`);
        failed++;
        continue;
      }
      
      console.log(`Processing artwork ${artwork.id} (${artwork.title})`);
      
      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(artwork.image);
      
      if (cloudinaryUrl) {
        // Update artwork with new image URL
        await prisma.artwork.update({
          where: { id: artwork.id },
          data: { image: cloudinaryUrl }
        });
        console.log(`✅ Migrated artwork ${artwork.id} to Cloudinary`);
        success++;
      } else {
        console.error(`❌ Failed to migrate artwork ${artwork.id}`);
        failed++;
      }
    }
    
    console.log('\nMigration complete!');
    console.log(`Successfully migrated: ${success}`);
    console.log(`Failed to migrate: ${failed}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateArtworksToCloudinary(); 