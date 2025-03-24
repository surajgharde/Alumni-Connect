interface AlumniProfile {
    id: string;
    name: string;
    position: string;
    organization: string;
    skills: string[];
    matchScore: number;
    avatar: string;
  }
  
  interface AlumniCardProps {
    profile: AlumniProfile;
  }
  
  export default function AlumniCard({ profile }: AlumniCardProps) {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
        <div className="flex items-start gap-4">
          <img 
            src={profile.avatar} 
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-alama-primary"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">{profile.name}</h3>
            <p className="text-gray-600 text-sm mb-2">
              {profile.position} at {profile.organization}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skills.slice(0, 4).map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Compatibility:</span>
                <span className="text-alama-primary font-bold">
                  {profile.matchScore}%
                </span>
              </div>
              <button className="px-4 py-2 bg-alama-primary hover:bg-alama-secondary text-white rounded-lg text-sm transition-colors">
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }