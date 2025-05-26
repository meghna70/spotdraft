import { configureStore } from '@reduxjs/toolkit';
import filesReducer from './fileSlice';
import sharedReducer from './sharedSlice';
import commentsReducer from './commentSlice';
import userReducer from './userSlice'
const store = configureStore({
  reducer: {
    user: userReducer,
    files: filesReducer,
    shared: sharedReducer,
    comments: commentsReducer,
  },
});

export default store;
