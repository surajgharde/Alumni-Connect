import { useState, useEffect } from 'react';
import axios from 'axios';

interface UserProfileData {
  name: string;
  bio: string;
  skills: string[];
  interests: string[];
  position?: string;
  organization?: string;
}

export default function UserProfile() {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState<UserProfileData>({
    name: '',
    bio: '',
    skills: [],
    interests: []
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put('/api/profile', profile);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        <button
          onClick={editMode ? handleSave : () => setEditMode(true)}
          className="px-4 py-2 bg-alama-primary hover:bg-alama-secondary text-white rounded-lg transition-colors"
        >
          {editMode ? 'Save Profile' : 'Edit Profile'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          {editMode ? (
            <input
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-alama-primary"
            />
          ) : (
            <p className="p-2 text-gray-900">{profile.name}</p>
          )}
        </div>

        {/* Bio Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          {editMode ? (
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-alama-primary"
            />
          ) : (
            <p className="p-2 text-gray-900 whitespace-pre-line">{profile.bio}</p>
          )}
        </div>

        {/* Skills Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
          {editMode ? (
            <input
              value={profile.skills.join(', ')}
              onChange={(e) => setProfile({...profile, skills: e.target.value.split(', ')})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-alama-primary"
              placeholder="React, Node.js, Python..."
            />
          ) : (
            <div className="flex flex-wrap gap-2 p-2">
              {profile.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}