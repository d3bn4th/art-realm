import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  console.log('Database URL:', process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs
  
  try {
    // Try to connect to the database
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Try a simple query
    try {
      const usersCount = await prisma.user.count();
      console.log(`✅ Query successful! Found ${usersCount} users in the database.`);
    } catch (queryError) {
      console.error('❌ Database connection successful but query failed:', queryError.message);
    }
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // Provide troubleshooting tips based on error message
    if (error.message.includes("Can't reach database server")) {
      console.log('\nTroubleshooting tips:');
      console.log('1. Check if your database server is running');
      console.log('2. Verify that the connection URL in .env is correct');
      console.log('3. Ensure your IP address is allowed in database settings');
      console.log('4. Check if your database password is correct');
      console.log('5. Try connecting to the database using another tool (e.g., pgAdmin)');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDatabaseConnection();