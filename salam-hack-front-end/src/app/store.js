import { configureStore } from '@reduxjs/toolkit';
import currentUserReducer from '../global/reducers/currentUserReducer';

export const store = configureStore({
  reducer: {
    currentUser: currentUserReducer
  }
})