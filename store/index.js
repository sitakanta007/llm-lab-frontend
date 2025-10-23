import { configureStore } from '@reduxjs/toolkit';
import experiment from './experimentSlice';
export const store = configureStore({ reducer: { experiment } });
