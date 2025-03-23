import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    name: string;
    id: string;
    friends: string[];
    requests: string[];
}

const initialState: UserState = {
    name: '',
    id: '',
    friends: [],
    requests: []
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ name: string; id: string, friends: string[], requests: string[] }>) => {
            state.name = action.payload.name;
            state.id = action.payload.id;
            state.friends = action.payload.friends;
            state.requests = action.payload.requests;

        },
        clearUser: (state) => {
            state.name = '';
            state.id = '';
            state.friends = [];
            state.requests = [];
        },
        appendFriend: (state, action: PayloadAction<string>) => {
            state.friends.push(action.payload);
        },
        appendRequests: (state, action: PayloadAction<string>) => {
            state.requests.push(action.payload);
        },
        removeRequest: (state, action: PayloadAction<string>) => {
            state.requests = state.requests.filter((request) => request !== action.payload);
        } 
    },
});

export const { setUser, clearUser, appendFriend, appendRequests, removeRequest } = userSlice.actions;
export default userSlice.reducer;