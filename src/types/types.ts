export interface UserProfileData {
    name: string;
    bio: string;
    skills: string[];
    interests: string[];
    position?: string;
    organization?: string;
  }
  
  export interface AlumniProfile {
    id: string;
    name: string;
    position: string;
    organization: string;
    skills: string[];
    matchScore: number;
    avatar: string;
  }
  
  export interface Badge {
    name: string;
    description: string;
    icon: string;
    achieved: boolean;
  }
  export interface CalendarEvent {
    title: string;
    start: Date | string;
    end?: Date | string;
    allDay?: boolean;
    color?: string;
  }
  // Extend your existing types
export interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: string;
    isSentByUser: boolean;
  }
  
  export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'alumni';
  }
  /* Core User Types */
export interface UserProfileData {
    id: string;
    name: string;
    email: string;
    bio: string;
    avatar: string;
    role: 'student' | 'alumni';
    skills: string[];
    interests: string[];
    position?: string;
    organization?: string;
  }
  
  export interface AlumniProfile extends UserProfileData {
    matchScore: number;
    experienceYears: number;
    availableForMentorship: boolean;
  }
  
  /* Chat System Types */
  export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: string;
    roomId: string;
    isSentByUser: boolean;
  }
  
  /* Events & Activities */
  export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    start: string;
    end: string;
    location: string;
    organizer: string;
  }
  
  /* Achievement System */
  export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    criteria: {
      type: 'mentorship' | 'connections' | 'events';
      threshold: number;
    };
  }
  
  /* Redux State Types */
  export interface AuthState {
    user: UserProfileData | null;
    status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
    error: string | null;
  }
  
  export interface ChatState {
    messages: Message[];
    currentRoom: string | null;
    isConnected: boolean;
  }
  
  /* API Response Format */
  export interface ApiResponse<T> {
    data?: T;
    error?: string;
    success: boolean;
  }