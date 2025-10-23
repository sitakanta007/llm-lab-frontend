import { createSlice } from '@reduxjs/toolkit';

const initialState = { 
  results: [], 
  prompt: '', 
  lastRunAt: null, 
  selectedIds: [] 
};

const slice = createSlice({
  name: 'experiment',
  initialState,
  reducers: {
    setResults: (s, a) => { s.results = a.payload },
    setPrompt: (s, a) => { s.prompt = a.payload },
    setLastRunAt: (s, a) => { s.lastRunAt = a.payload },
    reset: (s) => { s.results = []; s.prompt=''; s.lastRunAt=null; },
    toggleSelect: (s, a) => {
      const id = a.payload;
      if (s.selectedIds.includes(id)) {
        s.selectedIds = s.selectedIds.filter(x => x !== id);
      } else {
        s.selectedIds.push(id);
      }
    },
    clearSelection: (s) => { s.selectedIds = [] },
    setSelection: (s, a) => { s.selectedIds = Array.isArray(a.payload) ? a.payload : [] }
  }
});

export const { setResults, setPrompt, setLastRunAt, reset, toggleSelect, clearSelection, setSelection } = slice.actions;
export default slice.reducer;
