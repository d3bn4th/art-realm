'use client';

import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';

const deliveryMethods = [
  { id: 1, title: 'Standard', turnaround: '4–10 business days', price: 50 },
  { id: 2, title: 'Express', turnaround: '2–5 business days', price: 80 },
]

const paymentMethods = [
  { id: 'credit-card', title: 'Credit card' },
  { id: 'paypal', title: 'PayPal' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Checkout() {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0])

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-white-900 sm:text-3xl">Checkout</h2>

        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div className="lg:col-span-7">
            {/* Contact information */}
            <section aria-labelledby="contact-info-heading">
              <h2 id="contact-info-heading" className="text-lg font-medium text-gray-900">
                Contact information
              </h2>

              <div className="mt-6">
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </section>

            {/* Shipping address */}
            <section aria-labelledby="shipping-heading" className="mt-10">
              <h2 id="shipping-heading" className="text-lg font-medium text-gray-900">
                Shipping address
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="first-name"
                      name="first-name"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="last-name"
                      name="last-name"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      autoComplete="street-address"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                    Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="postal-code"
                      name="postal-code"
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery method */}
            <section aria-labelledby="delivery-heading" className="mt-10">
              <h2 id="delivery-heading" className="text-lg font-medium text-gray-900">
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
                          checked ? 'border-transparent' : 'border-gray-300',
                          active ? 'ring-2 ring-indigo-500' : '',
                          'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none'
                        )
                      }
                    >
                      {({ checked, active }) => (
                        <>
                          <span className="flex flex-1">
                            <span className="flex flex-col">
                              <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                                {deliveryMethod.title}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as="span"
                                className="mt-1 flex items-center text-sm text-gray-500"
                              >
                                {deliveryMethod.turnaround}
                              </RadioGroup.Description>
                              <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-gray-900">
                                ${deliveryMethod.price}
                              </RadioGroup.Description>
                            </span>
                          </span>
                          {checked ? (
                            <span
                              className={classNames(
                                active ? 'border' : 'border-2',
                                'pointer-events-none absolute -inset-px rounded-lg border-indigo-500'
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
              <h2 id="payment-heading" className="text-lg font-medium text-gray-900">
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
                          defaultChecked={paymentMethod.id === 'credit-card'}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <label htmlFor={paymentMethod.id} className="ml-3 block text-sm font-medium text-gray-700">
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
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              Order summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">$1,200.00</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-sm text-gray-600">Shipping</dt>
                <dd className="text-sm font-medium text-gray-900">${selectedDeliveryMethod.price}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-sm text-gray-600">Tax</dt>
                <dd className="text-sm font-medium text-gray-900">$120.00</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">$1,370.00</dd>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Confirm order
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
} 