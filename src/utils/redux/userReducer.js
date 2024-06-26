import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    email: null,
    id: null
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        changeEmail: (state, action) => {
            state.email = action.payload;
        },
        changeId: (state, action) => {
            state.id = action.payload;
        },
    }
})

export const { changeEmail, changeId} = userSlice.actions;

export default userSlice.reducer;