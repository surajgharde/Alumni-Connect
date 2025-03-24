import { useState, useEffect } from 'react';
import axios from 'axios';
import AlumniCard from './AlumniCard';

export default function AlumniList() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('/api/recommendations');
        setAlumni(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-alama-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
      {alumni.map((alumniProfile) => (
        <AlumniCard 
          key={alumniProfile.id} 
          profile={alumniProfile} 
        />
      ))}
    </div>
  );
}