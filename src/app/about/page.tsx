import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <Image
          src="/images/about-hero.jpeg"
          alt="Art gallery interior"
          fill
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
        />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">About Art Realm</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Connecting artists and art lovers in a vibrant online marketplace.
            </p>
          </div>
        </div>
      </div>

      {/* Mission section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Our Mission</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Empowering Artists, Inspiring Collectors
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Art Realm is dedicated to creating a thriving ecosystem where artists can showcase their work
              and connect with art enthusiasts worldwide. We believe in making art accessible while ensuring
              artists receive fair compensation for their creativity.
            </p>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We&apos;re guided by our commitment to authenticity, creativity, and community.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-16">
            <div className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <svg className="absolute left-1 top-1 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.302-.592l3.449-2.41a.75.75 0 00-.515-1.392h-4.72a.75.75 0 00-.515 1.392l3.449 2.41c.186.13.302.348.302.592v.282c-.78-.43-1.615-.83-2.49-1.19a.75.75 0 01-.254-1.285 41.059 41.059 0 018.198-5.424zM6.664 15.889A39.81 39.81 0 0110 15.445c1.21 0 2.428.143 3.636.444v1.216a.75.75 0 01-.75.75h-5.5a.75.75 0 01-.75-.75v-1.216z" clipRule="evenodd" />
                </svg>
                Quality and Authenticity.
              </dt>
              <dd className="inline"> We ensure every artwork on our platform meets high standards of quality and authenticity.</dd>
            </div>
            <div className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <svg className="absolute left-1 top-1 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                  <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Transparency.
              </dt>
              <dd className="inline"> We maintain clear communication and fair pricing practices throughout our platform.</dd>
            </div>
            <div className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <svg className="absolute left-1 top-1 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                </svg>
                Community.
              </dt>
              <dd className="inline"> We foster a supportive community where artists and collectors can connect and grow together.</dd>
            </div>
            <div className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <svg className="absolute left-1 top-1 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
                </svg>
                Innovation.
              </dt>
              <dd className="inline"> We continuously evolve our platform to better serve our community&aposcs needs.</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Team section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We&apos;re a passionate team of art enthusiasts, technologists, and industry experts working
              together to revolutionize the art market.
            </p>
          </div>
          <ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4">
            {[
              {
                name: 'Lalith (Ampavathina) Rahul',
                role: 'Founder & CEO',
                imageUrl: '/images/team/rahul.jpeg'
              },
              {
                name: 'Arihant Debnath',
                role: 'Founder & CTO',
                imageUrl: '/images/team/arihant.jpeg'
              },
              // Add more team members as needed
            ].map((person) => (
              <li key={person.name}>
                <div className="relative h-40 w-40 rounded-full overflow-hidden">
                  <Image
                    src={person.imageUrl}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">{person.name}</h3>
                <p className="text-base leading-7 text-gray-600">{person.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 