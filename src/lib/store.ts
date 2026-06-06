import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import expenseReducer from './features/expenses/expenseSlice';
import dashboardReducer from './features/dashboard/dashboardSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      expenses: expenseReducer,
      dashboard: dashboardReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
