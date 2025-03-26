/**
 * This is a mock database service that uses localStorage for persistence.
 * In a real application, this would be replaced with actual API calls to a backend server.
 */

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  graduationYear: string;
  passwordHash?: string;
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface UserProfile {
  id: number;
  name: string;
  graduationYear: number;
  program: string;
  company: string;
  position: string;
  location: string;
  image: string;
  email: string;
  bio: string;
  skills: string[];
  education: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  experiences: Experience[];
}

// In a real application, these would be API calls to your backend
export const DatabaseService = {
  // Database Management
  
  /**
   * Clears all data from localStorage
   */
  clearDatabase: (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.clear(); // Clear everything in localStorage
      
      // Simulate network delay
      setTimeout(() => {
        resolve();
      }, 200);
    });
  },

  // User Authentication
  
  /**
   * Simulates registering a user
   */
  registerUser: (userData: User): Promise<User> => {
    return new Promise((resolve, reject) => {
      // Get existing users or initialize empty array
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      const emailExists = existingUsers.some((user: User) => user.email === userData.email);
      
      if (emailExists) {
        reject(new Error('Email already registered'));
        return;
      }
      
      // Add user to users array
      existingUsers.push(userData);
      
      // Store updated users array
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      // Also store as current user
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Simulate network delay
      setTimeout(() => {
        resolve(userData);
      }, 500);
    });
  },
  
  /**
   * Simulates logging in a user
   * In a real application, these params would be used for authentication
   */
  loginUser: (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      // Get all registered users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user with matching email
      const user = users.find((u: User) => u.email === email);
      
      // Simulate network delay
      setTimeout(() => {
        if (user) {
          // Check password hash if available
          const passwordMatches = !user.passwordHash || 
            user.passwordHash === btoa(password); // Simple base64 check for demo
            
          if (passwordMatches) {
            // Store as current user
            const userWithoutPassword = { ...user };
            delete userWithoutPassword.passwordHash;
            
            // Update current user in localStorage
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            
            // Check if user already has a profile, if not create a basic one
            const userProfileData = localStorage.getItem('userProfile');
            if (!userProfileData) {
              // Create basic profile
              const basicProfile: UserProfile = {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                graduationYear: parseInt(user.graduationYear || '2020'),
                program: 'Alumni',
                company: 'Not specified',
                position: 'Not specified',
                location: 'Not specified',
                image: 'https://randomuser.me/api/portraits/lego/1.jpg', // Placeholder
                email: user.email,
                bio: 'No bio provided yet.',
                skills: [],
                education: `Graduated in ${user.graduationYear}`,
                experiences: []
              };
              
              // Save profile
              localStorage.setItem('userProfile', JSON.stringify(basicProfile));
              
              // Also add to all profiles
              const allProfiles = JSON.parse(localStorage.getItem('allUserProfiles') || '[]');
              allProfiles.push(basicProfile);
              localStorage.setItem('allUserProfiles', JSON.stringify(allProfiles));
            }
            
            resolve(userWithoutPassword);
          } else {
            reject(new Error('Invalid credentials'));
          }
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  },
  
  /**
   * Logs out the current user
   */
  logoutUser: (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem('user');
      
      // Simulate network delay
      setTimeout(() => {
        resolve();
      }, 200);
    });
  },
  
  // User Profiles
  
  /**
   * Gets a user profile by ID
   */
  getUserProfile: (id: number): Promise<UserProfile | null> => {
    return new Promise((resolve) => {
      // Try to get from user profiles first
      const allProfiles = JSON.parse(localStorage.getItem('allUserProfiles') || '[]');
      const userProfile = allProfiles.find((profile: UserProfile) => profile.id === id);
      
      // Simulate network delay
      setTimeout(() => {
        if (userProfile) {
          resolve(userProfile);
        } else {
          // If not in user profiles, check if it's the current user
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.id === id) {
              // Get user's profile if it exists
              const userProfileData = localStorage.getItem('userProfile');
              if (userProfileData) {
                resolve(JSON.parse(userProfileData));
              } else {
                resolve(null);
              }
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        }
      }, 500);
    });
  },
  
  /**
   * Gets the current user's profile
   */
  getCurrentUserProfile: (): Promise<UserProfile | null> => {
    return new Promise((resolve) => {
      // Get current user
      const storedUser = localStorage.getItem('user');
      
      // Simulate network delay
      setTimeout(() => {
        if (storedUser) {
          // No need to parse the user data since we only need the profile
          const userProfileData = localStorage.getItem('userProfile');
          if (userProfileData) {
            resolve(JSON.parse(userProfileData));
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      }, 500);
    });
  },
  
  /**
   * Updates a user's profile
   */
  updateUserProfile: (profileData: UserProfile): Promise<UserProfile> => {
    return new Promise((resolve) => {
      // Save the profile
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      // Also update in all profiles list
      const allProfiles = JSON.parse(localStorage.getItem('allUserProfiles') || '[]');
      const existingProfileIndex = allProfiles.findIndex((p: UserProfile) => p.id === profileData.id);
      
      if (existingProfileIndex >= 0) {
        // Update existing profile
        allProfiles[existingProfileIndex] = profileData;
      } else {
        // Add new profile
        allProfiles.push(profileData);
      }
      
      localStorage.setItem('allUserProfiles', JSON.stringify(allProfiles));
      
      // Simulate network delay
      setTimeout(() => {
        resolve(profileData);
      }, 500);
    });
  },
  
  /**
   * Gets all alumni profiles
   */
  getAllProfiles: (): Promise<UserProfile[]> => {
    return new Promise((resolve) => {
      // Get all profiles
      const allProfiles = JSON.parse(localStorage.getItem('allUserProfiles') || '[]');
      
      // Simulate network delay
      setTimeout(() => {
        resolve(allProfiles);
      }, 500);
    });
  }
}; 