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
      // Сервер возвращает массив напрямую
      console.log('fetchMessages: ответ для канала', channelId, '=', response.data);
      return { channelId, messages: response.data };
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
      if (!state.byChannelId[channelId]) {
        state.byChannelId[channelId] = [];
      }
      state.byChannelId[channelId].push(message);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        console.log('messagesSlice: начало загрузки');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        console.log('messagesSlice: загрузка успешна, payload =', action.payload);
        state.loading = false;
        const { channelId, messages } = action.payload;
        state.byChannelId[channelId] = messages || [];
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        console.log('messagesSlice: ошибка загрузки =', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
