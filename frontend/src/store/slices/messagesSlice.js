import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (channelId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/v1/messages?channelId=${channelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Фильтруем сообщения ТОЛЬКО для запрошенного канала
      const messagesForChannel = response.data.filter(msg => {
        const msgChannelId = typeof msg.channelId === 'number' ? msg.channelId : parseInt(msg.channelId, 10);
        const requestedChannelId = typeof channelId === 'number' ? channelId : parseInt(channelId, 10);
        return msgChannelId === requestedChannelId;
      });
      
      console.log(`Загружено ${messagesForChannel.length} сообщений для канала ${channelId}`);
      
      return { 
        channelId: String(channelId), 
        messages: messagesForChannel 
      };
    } catch (error) {
      console.error('fetchMessages: ошибка =', error);
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки сообщений');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    byChannelId: {},
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      const { channelId, message } = action.payload;
      const normalizedChannelId = String(channelId);
      
      if (!state.byChannelId[normalizedChannelId]) {
        state.byChannelId[normalizedChannelId] = [];
      }
      
      // Проверяем, нет ли уже такого сообщения
      const messageExists = state.byChannelId[normalizedChannelId].some(
        msg => msg.id === message.id
      );
      
      if (!messageExists) {
        state.byChannelId[normalizedChannelId].push(message);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { channelId, messages } = action.payload;
        state.byChannelId[channelId] = messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
