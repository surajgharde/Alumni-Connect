import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  isSentByUser: boolean;
}

interface ChatState {
  messages: Message[];
  currentRoom: string | null;
  isConnected: boolean;
}

const initialState: ChatState = {
  messages: [],
  currentRoom: null,
  isConnected: false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setRoom: (state, action: PayloadAction<string>) => {
      state.currentRoom = action.payload;
    },
    setConnection: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
      state.currentRoom = null;
    }
  }
});

export const { addMessage, setRoom, setConnection, clearChat } = chatSlice.actions;
export default chatSlice.reducer;