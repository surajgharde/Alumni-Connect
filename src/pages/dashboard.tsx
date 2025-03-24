import { useSession } from 'next-auth/react';
import AlumniList from '../components/Recommendation/AlumniList';
import CalendarWidget from '../components/Events/CalendarWidget';
import Loader from '../components/Common/Loader';
import { Suspense, useState } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isRequestPending, setRequestPending] = useState(false);

  if (status === "loading") return <Loader />;
  if (!session) return <div className="text-center py-8">Please sign in to access the dashboard</div>;

  const handleMentorshipRequest = async () => {
    setRequestPending(true);
    try {
      // API call logic
    } catch (error) {
      console.error('Request failed:', error);
    } finally {
      setRequestPending(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome back, {session.user?.name?.split(' ')[0] || 'there'}
        </h1>
        <div className="flex gap-4 flex-wrap justify-center">
          <button 
            className="btn-primary"
            onClick={handleMentorshipRequest}
            disabled={isRequestPending}
          >
            {isRequestPending ? 'Processing...' : 'Request Mentorship'}
          </button>
          <button 
            className="btn-secondary"
            onClick={() => {/* Add profile update logic */}}
          >
            Update Profile
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold mb-4 px-2">Recommended Alumni</h2>
          <Suspense fallback={<Loader />}>
            <AlumniList />
          </Suspense>
        </div>
        
        <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 px-2">Upcoming Events</h2>
          <CalendarWidget />
        </div>
      </div>
    </main>
  );
}