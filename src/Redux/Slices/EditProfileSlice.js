import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  image: null,
  showModal: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    setShowModal: (state, action) => {
      state.showModal = action.payload;
    },
  },
});

export const { setName, setEmail, setImage, setShowModal } = profileSlice.actions;
export default profileSlice.reducer;
