 // components/Auth/AuthGuard.tsx
'use client'; // Add this at the top

import { useSession } from 'next-auth/react';

const AuthGuard = ({ children }) => {
  const { data: session } = useSession();
  // ...rest of the logic
};

export default AuthGuard;