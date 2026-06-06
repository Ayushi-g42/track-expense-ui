import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { dashboard } from '../../ENDPOINTS';

interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  savings: number;
}

interface DashboardState {
  summary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  summary: null,
  loading: false,
  error: null,
};

// Async thunk for fetching dashboard summary
export const getDashboardSummary = createAsyncThunk(
  'dashboard/getSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(dashboard.SUMMARY);
      return response.data.data; // Adapting to backend structure
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard summary.'
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Dashboard Summary
    builder
      .addCase(getDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(getDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
