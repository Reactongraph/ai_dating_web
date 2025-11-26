import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ContentMode = 'sfw' | 'nsfw';

interface ContentModeState {
  mode: ContentMode;
  loading: boolean; // To prevent flashing on initial load
}

// Get initial mode from localStorage
const getInitialMode = (): ContentMode => {
  if (typeof window !== 'undefined') {
    const savedMode = localStorage.getItem('contentMode');
    if (savedMode === 'sfw' || savedMode === 'nsfw') {
      return savedMode;
    }
  }
  return 'sfw'; // Default to SFW
};

const initialState: ContentModeState = {
  mode: typeof window !== 'undefined' ? getInitialMode() : 'sfw',
  loading: typeof window === 'undefined', // Set loading to true on server
};

const contentModeSlice = createSlice({
  name: 'contentMode',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<ContentMode>) => {
      state.mode = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('contentMode', action.payload);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    initializeMode: state => {
      // Initialize mode from localStorage
      if (typeof window !== 'undefined') {
        const savedMode = localStorage.getItem('contentMode');
        if (savedMode === 'sfw' || savedMode === 'nsfw') {
          state.mode = savedMode;
        }
        state.loading = false;
      }
    },
  },
});

export const { setMode, setLoading, initializeMode } = contentModeSlice.actions;
export default contentModeSlice.reducer;

// Selector
export const selectContentMode = (state: { contentMode: ContentModeState }): ContentMode =>
  state.contentMode.mode;

export const selectContentModeLoading = (state: { contentMode: ContentModeState }): boolean =>
  state.contentMode.loading;
