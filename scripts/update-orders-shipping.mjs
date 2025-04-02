import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample shipping addresses
const SHIPPING_ADDRESSES = [
  {
    street: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    country: 'India',
  },
  {
    street: '456 Park Avenue',
    city: 'New Delhi',
    state: 'Delhi',
    zipCode: '110001',
    country: 'India',
  },
  {
    street: '789 Garden Road',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560001',
    country: 'India',
  },
  {
    street: '101 Beach Lane',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zipCode: '600001',
    country: 'India',
  },
  {
    street: '202 Hill View',
    city: 'Hyderabad',
    state: 'Telangana',
    zipCode: '500001',
    country: 'India',
  },
];

// Sample shipping methods
const SHIPPING_METHODS = [
  'Standard Shipping',
  'Express Shipping',
  'Premium Shipping',
  'Same-day Delivery',
];

// Sample shipping tracking numbers format
function generateTrackingNumber() {
  const prefix = 'AR';
  const randomNumbers = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  const suffix = 'IN';
  return `${prefix}${randomNumbers}${suffix}`;
}

// Sample shipping date generator
function generateShippingDate(orderDate) {
  const shippingDate = new Date(orderDate);
  // Add 1-3 days for processing
  shippingDate.setDate(shippingDate.getDate() + 1 + Math.floor(Math.random() * 3));
  return shippingDate;
}

// Sample expected delivery date generator
function generateExpectedDeliveryDate(shippingDate) {
  const deliveryDate = new Date(shippingDate);
  // Add 2-7 days for shipping
  deliveryDate.setDate(deliveryDate.getDate() + 2 + Math.floor(Math.random() * 6));
  return deliveryDate;
}

async function main() {
  try {
    console.log('Starting to update orders with shipping details...');
    
    // Get all orders that are in shipping or completed status
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['shipping', 'completed']
        }
      }
    });
    
    if (orders.length === 0) {
      console.log('No shipping or completed orders found');
      return;
    }
    
    console.log(`Found ${orders.length} orders to update with shipping information`);
    
    // Update each order with shipping details
    let updatedCount = 0;
    for (const order of orders) {
      // Get random shipping address, method
      const shippingAddress = SHIPPING_ADDRESSES[Math.floor(Math.random() * SHIPPING_ADDRESSES.length)];
      const shippingMethod = SHIPPING_METHODS[Math.floor(Math.random() * SHIPPING_METHODS.length)];
      const trackingNumber = generateTrackingNumber();
      
      // Generate dates
      const shippingDate = generateShippingDate(order.createdAt);
      const expectedDeliveryDate = generateExpectedDeliveryDate(shippingDate);
      
      // Update the order
      await prisma.order.update({
        where: { id: order.id },
        data: {
          shippingAddress: JSON.stringify(shippingAddress),
          shippingMethod,
          trackingNumber,
          shippingDate,
          expectedDeliveryDate,
          // For completed orders, set actual delivery date
          ...(order.status === 'completed' && { 
            deliveryDate: new Date(expectedDeliveryDate) 
          }),
        }
      });
      
      updatedCount++;
    }
    
    console.log(`Successfully updated ${updatedCount} orders with shipping details`);
    
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