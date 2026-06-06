import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { expenses } from '../../ENDPOINTS';

interface Expense {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  description?: string;
  paymentMethod?: string;
  expenseDate?: string;
  receiptUrl?: string;
}

interface ExpenseState {
  expensesList: Expense[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expensesList: [],
  loading: false,
  error: null,
};

// Async thunk for creating an expense
export const createExpense = createAsyncThunk(
  'expenses/createExpense',
  async (expenseData: any, { rejectWithValue }) => {
    try {
      const response = await api.post(expenses.CREATE, expenseData);
      return response.data.data; // The created expense from backend
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create expense. Please try again.'
      );
    }
  }
);

// Async thunk for fetching all expenses
export const getExpenses = createAsyncThunk(
  'expenses/getExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(expenses.GET_ALL);
      return response.data.data.expenses || response.data.data; // Adapting to backend structure
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch expenses.'
      );
    }
  }
);

// Async thunk for updating an expense
export const updateExpenses = createAsyncThunk(
  'expenses/updateExpenses',
  async ({ id, expenseData }: { id: string, expenseData: any }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${expenses.UPDATE}/${id}`, expenseData);
      return response.data.data; // The created expense from backend
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create expense. Please try again.'
      );
    }
  }
);

// Async thunk for delete an expense
export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${expenses.DELETE}/${id}`);
      return response.data.data; // The created expense from backend
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create expense. Please try again.'
      );
    }
  }
);


const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create Expense
    builder
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new expense to the list if we have it loaded
        state.expensesList.push(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Expenses
    builder
      .addCase(getExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expensesList = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpenses.fulfilled, (state, action) => {
        state.loading = false;
        // state.expensesList = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(updateExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        // state.expensesList = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export default expenseSlice.reducer;
