import Image from "next/image";
import Link from "next/link";
import yogaImage from "@/public/yoga-practice.svg";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-65px)] flex items-center justify-center p-6">
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Welcome to Just Holistics
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover community-powered healing protocols — crowd-sourced routines,
            reviews, and supportive conversations to help you on your wellness journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <Link href="/protocols" className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-md shadow hover:bg-teal-800 transition-colors">
              Explore Protocols
            </Link>
            <Link href="/signup" className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Create Account
            </Link>
          </div>

          <ul className="mt-8 text-left space-y-2 text-gray-600 hidden md:block">
            <li>• Community-reviewed protocols</li>
            <li>• Track progress and votes</li>
            <li>• Join discussions and threads</li>
          </ul>
        </div>

        <div className="flex items-center justify-center">
          <Image
            src={yogaImage}
            alt="Yoga and Wellness Illustration"
            width={560}
            height={360}
            className="w-full max-w-md"
            priority
          />
        </div>
      </section>
    </main>
  );
}
