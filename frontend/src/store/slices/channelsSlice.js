import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
  notifyChannelCreated, 
  notifyChannelRenamed, 
  notifyChannelRemoved,
  notifyCreateChannelError,
  notifyRenameChannelError,
  notifyRemoveChannelError,
  notifyLoadChannelsError
} from '../../utils/notifications';

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
      return response.data;
    } catch (error) {
      notifyLoadChannelsError();
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки каналов');
    }
  }
);

export const addChannel = createAsyncThunk(
  'channels/addChannel',
  async (name, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/v1/channels', {
        name,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notifyChannelCreated();
      return response.data;
    } catch (error) {
      notifyCreateChannelError();
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания канала');
    }
  }
);

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (channelId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/v1/channels/${channelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notifyChannelRemoved();
      return channelId;
    } catch (error) {
      notifyRemoveChannelError();
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления канала');
    }
  }
);

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ channelId, name }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`/api/v1/channels/${channelId}`, {
        name,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notifyChannelRenamed();
      return response.data;
    } catch (error) {
      notifyRenameChannelError();
      return rejectWithValue(error.response?.data?.message || 'Ошибка переименования канала');
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
      state.currentChannelId = String(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        if (state.items.length > 0 && !state.currentChannelId) {
          state.currentChannelId = String(state.items[0].id);
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        state.items.push(action.payload);
        // Автоматически переключаемся на новый канал
        state.currentChannelId = String(action.payload.id);
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        const removedChannelId = String(action.payload);
        // Удаляем канал из списка
        state.items = state.items.filter(ch => String(ch.id) !== removedChannelId);
        // Если удалили текущий канал, переключаемся на General (ID: 1)
        if (state.currentChannelId === removedChannelId) {
          state.currentChannelId = '1';
        }
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        const updatedChannel = action.payload;
        const index = state.items.findIndex(ch => ch.id === updatedChannel.id);
        if (index !== -1) {
          state.items[index] = updatedChannel;
        }
      });
  },
});

export const { setCurrentChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
