import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/channels', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('fetchChannels: ответ сервера =', response.data);
      console.log('fetchChannels: тип данных =', typeof response.data);
      console.log('fetchChannels: массив? =', Array.isArray(response.data));
      return response.data;
    } catch (error) {
      console.error('fetchChannels: ошибка =', error);
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки каналов');
    }
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    items: [],
    currentChannelId: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        console.log('channelsSlice: начало загрузки');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        console.log('channelsSlice: загрузка успешна, payload =', action.payload);
        console.log('channelsSlice: тип payload =', typeof action.payload);
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        console.log('channelsSlice: ошибка загрузки =', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
