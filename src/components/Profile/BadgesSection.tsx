interface Badge {
    name: string;
    description: string;
    icon: string;
    achieved: boolean;
  }
  
  export default function BadgesSection() {
    const badges: Badge[] = [
      {
        name: 'Mentor Pro',
        description: 'Completed 10+ mentorship sessions',
        icon: '🎓',
        achieved: true
      },
      {
        name: 'Network Builder',
        description: 'Connected with 50+ alumni',
        icon: '🤝',
        achieved: false
      },
      // Add more badges...
    ];
  
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Achievements & Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${
                badge.achieved 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200 opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <h4 className="font-semibold text-gray-800">{badge.name}</h4>
              <p className="text-sm text-gray-600">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }