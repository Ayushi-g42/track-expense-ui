import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { incomes } from '../../ENDPOINTS';

interface Income {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  source: string;
  description?: string;
  incomeDate?: string;
}

interface IncomeState {
  incomesList: Income[];
  loading: boolean;
  error: string | null;
}

const initialState: IncomeState = {
  incomesList: [],
  loading: false,
  error: null,
};

// Async thunk for creating an income
export const createIncome = createAsyncThunk(
  'incomes/createIncome',
  async (incomeData: any, { rejectWithValue }) => {
    try {
      const response = await api.post(incomes.CREATE, incomeData);
      return response.data.data; // The created income from backend
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create income. Please try again.'
      );
    }
  }
);

// Async thunk for fetching all incomes
export const getIncomes = createAsyncThunk(
  'incomes/getIncomes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(incomes.GET_ALL);
      return response.data.data.incomes || response.data.data; // Adapting to backend structure
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch incomes.'
      );
    }
  }
);

// Async thunk for updating an income
export const updateIncome = createAsyncThunk(
  'incomes/updateIncome',
  async ({ id, incomeData }: { id: string, incomeData: any }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${incomes.UPDATE}/${id}`, incomeData);
      return response.data.data; // The updated income from backend
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update income. Please try again.'
      );
    }
  }
);

// Async thunk for deleting an income
export const deleteIncome = createAsyncThunk(
  'incomes/deleteIncome',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${incomes.DELETE}/${id}`);
      return response.data.data; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete income. Please try again.'
      );
    }
  }
);


const incomeSlice = createSlice({
  name: 'incomes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create Income
    builder
      .addCase(createIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIncome.fulfilled, (state, action) => {
        state.loading = false;
        state.incomesList.push(action.payload);
      })
      .addCase(createIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Incomes
    builder
      .addCase(getIncomes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.incomesList = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Income
    builder
      .addCase(updateIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIncome.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Income
    builder
      .addCase(deleteIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIncome.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteIncome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export default incomeSlice.reducer;
