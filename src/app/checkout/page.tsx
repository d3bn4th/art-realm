'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { RadioGroup } from '@headlessui/react';
import { useCart } from '@/app/context/CartContext';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { CheckIcon } from '@heroicons/react/24/outline';
import { formatToRupees } from '@/utils/currency';

// Define a class for input fields to ensure consistency
const inputClassName = "block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 h-12";

const deliveryMethods = [
  { id: 1, title: 'Standard', turnaround: '4–10 business days', price: 50 },
  { id: 2, title: 'Express', turnaround: '2–5 business days', price: 80 },
]

const paymentMethods = [
  { id: 'credit-card', title: 'Credit card' },
  { id: 'paypal', title: 'PayPal' },
  { id: 'upi', title: 'UPI' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Checkout() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0].id);
  const [formData, setFormData] = useState({
    email: '',
    company: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Redirect to cart if cart is empty
  if (cart.items.length === 0 && !orderComplete) {
    router.push('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, you would send this data to your backend
      // For demo purposes, we'll simulate a successful order after a delay
      setTimeout(() => {
        // Generate a random order ID
        const randomOrderId = `ORDER-${Math.floor(Math.random() * 10000)}`;
        setOrderId(randomOrderId);
        
        // Clear the cart
        clearCart();
        
        // Show order complete state
        setOrderComplete(true);
        setIsSubmitting(false);
        
        // Save order details to localStorage for demo purposes
        const orderDetails = {
          id: randomOrderId,
          items: cart.items,
          total: cart.total,
          shipping: selectedDeliveryMethod.price,
          customerInfo: formData,
          paymentMethod: selectedPaymentMethod,
          date: new Date().toISOString(),
        };
        
        if (typeof window !== 'undefined') {
          const orders = JSON.parse(localStorage.getItem('orders') || '[]');
          localStorage.setItem('orders', JSON.stringify([...orders, orderDetails]));
        }
        
      }, 2000);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('There was a problem processing your order');
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="bg-green-100 rounded-full p-3">
              <CheckIcon className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Thank You for Your Order!</h1>
          <p className="text-gray-300 mb-8">Your order has been placed successfully</p>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
            <p className="text-gray-300 mb-2">Order ID: <span className="font-medium text-white">{orderId}</span></p>
            <p className="text-gray-300">We&apos;ve sent a confirmation email to your email address.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/artwork')}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              View Order History
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-12 px-4">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent sm:text-4xl mb-8">Checkout</h2>

        <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div className="lg:col-span-7">
            {/* Contact information */}
            <section aria-labelledby="contact-info-heading">
              <h2 id="contact-info-heading" className="text-lg font-medium text-white">
                Contact information
              </h2>

              <div className="mt-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    required
                    className={inputClassName}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                  Phone number
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    autoComplete="tel"
                    className={inputClassName}
                  />
                </div>
              </div>
            </section>

            {/* Shipping address */}
            <section aria-labelledby="shipping-heading" className="mt-10">
              <h2 id="shipping-heading" className="text-lg font-medium text-white">
                Shipping address
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300">
                    Company
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      autoComplete="given-name"
                      required
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      autoComplete="family-name"
                      required
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-300">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      autoComplete="street-address"
                      required
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-300">
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      autoComplete="address-level2"
                      required
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300">
                    Postal code <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      autoComplete="postal-code"
                      required
                      className={inputClassName}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery method */}
            <section aria-labelledby="delivery-heading" className="mt-10">
              <h2 id="delivery-heading" className="text-lg font-medium text-white">
                Delivery method
              </h2>

              <RadioGroup value={selectedDeliveryMethod} onChange={setSelectedDeliveryMethod} className="mt-4">
                <RadioGroup.Label className="sr-only">Delivery method</RadioGroup.Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {deliveryMethods.map((deliveryMethod) => (
                    <RadioGroup.Option
                      key={deliveryMethod.id}
                      value={deliveryMethod}
                      className={({ checked, active }) =>
                        classNames(
                          checked ? 'border-transparent' : 'border-gray-700',
                          active ? 'ring-2 ring-blue-500' : '',
                          'relative flex cursor-pointer rounded-lg border bg-gray-800 p-5 shadow-sm focus:outline-none'
                        )
                      }
                    >
                      {({ checked, active }) => (
                        <>
                          <span className="flex flex-1">
                            <span className="flex flex-col">
                              <RadioGroup.Label as="span" className="block text-sm font-medium text-white">
                                {deliveryMethod.title}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as="span"
                                className="mt-1 flex items-center text-sm text-gray-400"
                              >
                                {deliveryMethod.turnaround}
                              </RadioGroup.Description>
                              <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-white">
                                {formatToRupees(deliveryMethod.price)}
                              </RadioGroup.Description>
                            </span>
                          </span>
                          {checked ? (
                            <span
                              className={classNames(
                                active ? 'border' : 'border-2',
                                'pointer-events-none absolute -inset-px rounded-lg border-blue-500'
                              )}
                              aria-hidden="true"
                            />
                          ) : null}
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </section>

            {/* Payment method */}
            <section aria-labelledby="payment-heading" className="mt-10">
              <h2 id="payment-heading" className="text-lg font-medium text-white">
                Payment method
              </h2>

              <div className="mt-6">
                <div className="space-y-4">
                  {paymentMethods.map((paymentMethod) => (
                    <div key={paymentMethod.id} className="relative flex items-center">
                      <div className="flex h-5 items-center">
                        <input
                          id={paymentMethod.id}
                          name="payment-method"
                          type="radio"
                          checked={selectedPaymentMethod === paymentMethod.id}
                          onChange={() => setSelectedPaymentMethod(paymentMethod.id)}
                          className="h-4 w-4 border-gray-700 bg-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <label htmlFor={paymentMethod.id} className="ml-3 block text-sm font-medium text-gray-300">
                        {paymentMethod.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-800 border border-gray-700 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-white mb-6">
              Order summary
            </h2>

            <div className="flow-root">
              <ul className="-my-4 divide-y divide-gray-700">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex py-4 space-x-4">
                    <div className="relative h-20 w-20 flex-none rounded-md bg-gray-700 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm text-white">
                            {item.title}
                          </h3>
                          <p className="ml-4 text-sm font-medium text-white">{formatToRupees(item.price * item.quantity)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">Qty {item.quantity}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-400">Subtotal</dt>
                <dd className="text-sm font-medium text-white">{formatToRupees(cart.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-400">Shipping</dt>
                <dd className="text-sm font-medium text-white">{formatToRupees(selectedDeliveryMethod.price)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-400">Taxes</dt>
                <dd className="text-sm font-medium text-white">{formatToRupees(cart.tax)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                <dt className="text-base font-medium text-white">Total</dt>
                <dd className="text-base font-medium text-white">{formatToRupees(cart.subtotal + selectedDeliveryMethod.price + cart.tax)}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md border border-transparent bg-gradient-to-r from-green-600 to-blue-600 py-3 h-14 px-4 text-base font-medium text-white shadow-sm hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Complete Order'}
              </Button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
} 