import Link from 'next/link';
import SocialLoginButtons from '@/components/Auth/SocialLoginButtons';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-alama-primary to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-8">
          Connect with Alumni, Shape Your Future
        </h1>
        
        <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
          Join our platform to access mentorship, career guidance, and networking opportunities 
          from experienced alumni in your field.
        </p>

        <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
          <SocialLoginButtons />
          
          <p className="mt-6 text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-alama-primary hover:underline">
              Terms of Service
            </Link>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16 text-white">
          <div className="p-6 bg-white/10 rounded-xl">
            <h3 className="text-xl font-semibold mb-3">Personalized Matching</h3>
            <p>AI-powered alumni recommendations based on your profile</p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl">
            <h3 className="text-xl font-semibold mb-3">Expert Mentorship</h3>
            <p>1:1 sessions with industry professionals</p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl">
            <h3 className="text-xl font-semibold mb-3">Career Growth</h3>
            <p>Exclusive job opportunities and resources</p>
          </div>
        </div>
      </div>
    </div>
  );
}