import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"

let initialCart = [];
let initialTotal = 0;
let initialTotalItems = 0;

try {
  const c = localStorage.getItem("cart");
  if (c && c !== "undefined" && c !== "null") initialCart = JSON.parse(c);
  const t = localStorage.getItem("total");
  if (t && t !== "undefined" && t !== "null") initialTotal = JSON.parse(t);
  const ti = localStorage.getItem("totalItems");
  if (ti && ti !== "undefined" && ti !== "null") initialTotalItems = JSON.parse(ti);
} catch {
  initialCart = [];
  initialTotal = 0;
  initialTotalItems = 0;
}

const initialState = {
  cart: Array.isArray(initialCart) ? initialCart : [],
  total: typeof initialTotal === "number" ? initialTotal : 0,
  totalItems: typeof initialTotalItems === "number" ? initialTotalItems : 0,
};


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const course = action.payload
      const index = state.cart.findIndex((item) => item._id === course._id)

      if (index >= 0) {
        // If the course is already in the cart, do not modify the quantity
        toast.error("Course already in cart")
        return
      }
      // If the course is not in the cart, add it to the cart
      state.cart.push(course)
      // Update the total quantity and price
      state.totalItems++
      state.total += course.price
      // Update to localstorage
      localStorage.setItem("cart", JSON.stringify(state.cart))
      localStorage.setItem("total", JSON.stringify(state.total))
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
      // show toast
      toast.success("Course added to cart")
    },
    removeFromCart: (state, action) => {
      const courseId = action.payload
      const index = state.cart.findIndex((item) => item._id === courseId)

      if (index >= 0) {
        // If the course is found in the cart, remove it
        state.totalItems--
        state.total -= state.cart[index].price
        state.cart.splice(index, 1)
        // Update to localstorage
        localStorage.setItem("cart", JSON.stringify(state.cart))
        localStorage.setItem("total", JSON.stringify(state.total))
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
        // show toast
        toast.success("Course removed from cart")
      }
    },
    resetCart: (state) => {
      state.cart = []
      state.total = 0
      state.totalItems = 0
      // Update to localstorage
      localStorage.removeItem("cart")
      localStorage.removeItem("total")
      localStorage.removeItem("totalItems")
    },
  },
})

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions

export default cartSlice.reducer