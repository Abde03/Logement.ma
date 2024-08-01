import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    CurrentUser: null,
    loading: false,
    error: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSucces: (state, action) => {
            state.CurrentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        signOut: (state) => {
            state.CurrentUser = null;
            state.loading = false;
            state.error = false;
        }

    },
});

export const { signInSucces , signInStart ,signInFailure , signOut  } = userSlice.actions;
export default userSlice.reducer;