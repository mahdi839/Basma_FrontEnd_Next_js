import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Fetch categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const cached = typeof window !== "undefined"
      ? sessionStorage.getItem("categories")
      : null;

    // Use cache if exists
    if (cached) {
      return JSON.parse(cached);
    }

    const res = await axios.get(baseUrl + "api/frontend/categories");

    const normalize = (cats) =>
      cats.map((c) => ({
        ...c,
        children: c.all_children ? normalize(c.all_children) : [],
      }));

    const normalized = normalize(res.data);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("categories", JSON.stringify(normalized));
    }

    return normalized;
  },
   {
    condition: (_, { getState }) => {
      const status = getState().categories.status
      return status === "idle" 
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    status: "idle",
  },
  reducers: {
    clearCategoryCache: (state) => {
      state.list = [];
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("categories");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "success";
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearCategoryCache } = categorySlice.actions;
export default categorySlice.reducer;