import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// First, let's update the schema to include payment fields
async function updateSchema() {
  try {
    // Check if payment fields exist in schema
    const hasPaymentFields = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Order' 
      AND column_name = 'paymentMethod'
    `;

    if (Array.isArray(hasPaymentFields) && hasPaymentFields.length === 0) {
      console.log('Payment fields not found in schema. Please run:');
      console.log('1. Add payment fields to prisma/schema.prisma:');
      console.log(`
model Order {
  // existing fields...
  paymentMethod     String?
  paymentId         String?
  paymentStatus     String?
  paymentDate       DateTime?
}
      `);
      console.log('2. Then run: npx prisma migrate dev --name add_payment_fields');
      console.log('3. After migration, run this script again');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking schema:', error);
    return false;
  }
}

// Payment methods
const PAYMENT_METHODS = [
  'Credit Card',
  'PayPal',
  'Bank Transfer',
  'Cash on Delivery',
  'Digital Wallet',
];

// Generate payment ID
function generatePaymentId() {
  const prefix = 'PAY';
  const randomNumbers = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${prefix}${randomNumbers}`;
}

// Generate payment date (usually around order date)
function generatePaymentDate(orderDate) {
  const paymentDate = new Date(orderDate);
  // Payment usually happens at order time or slightly after (0-2 days)
  paymentDate.setHours(paymentDate.getHours() + Math.floor(Math.random() * 48));
  return paymentDate;
}

async function main() {
  try {
    console.log('Starting to update orders with payment details...');
    
    // Check if schema has payment fields
    const schemaReady = await updateSchema();
    if (!schemaReady) {
      return;
    }
    
    // Get all orders (for payment updates)
    const orders = await prisma.order.findMany();
    
    if (orders.length === 0) {
      console.log('No orders found');
      return;
    }
    
    console.log(`Found ${orders.length} orders to update with payment information`);
    
    // Update each order with payment details
    let updatedCount = 0;
    for (const order of orders) {
      // Get random payment method
      const paymentMethod = PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)];
      const paymentId = generatePaymentId();
      
      // Payment status based on order status
      let paymentStatus = 'completed';
      if (order.status === 'cancelled') {
        paymentStatus = 'refunded';
      } else if (order.status === 'pending') {
        // Some pending orders might have pending payments
        paymentStatus = Math.random() > 0.3 ? 'completed' : 'pending';
      }
      
      // Generate payment date
      const paymentDate = generatePaymentDate(order.createdAt);
      
      // Update the order
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentMethod,
          paymentId,
          paymentStatus,
          paymentDate,
        }
      });
      
      updatedCount++;
    }
    
    console.log(`Successfully updated ${updatedCount} orders with payment details`);
    
  } catch (error) {
    console.error('Error updating orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 