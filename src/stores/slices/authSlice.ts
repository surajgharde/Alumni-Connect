import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: null | {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'alumni';
  };
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
      state.status = 'authenticated';
    },
    setLoading: (state) => {
      state.status = 'loading';
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = 'unauthenticated';
    },
    logout: (state) => {
      state.user = null;
      state.status = 'unauthenticated';
    }
  }
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;