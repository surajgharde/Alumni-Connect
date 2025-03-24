import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import UserProfile from '@/components/Profile/UserProfile';
import BadgesSection from '@/components/Profile/BadgesSection';
import Loader from '@/components/Common/Loader';

const ProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  const { data: user, error } = useSWR(
    id ? `/api/users/${id}` : null
  );

  if (error) return <div>Failed to load profile</div>;
  if (!user) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <BadgesSection />
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <UserProfile />
          
          {session?.user?.id === id && (
            <div className="mt-8 bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Profile Settings</h3>
              {/* Add settings components */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;