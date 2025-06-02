import { createSlice } from "@reduxjs/toolkit";


const loadCartFromStorage = ()=>{
    if(typeof window !== 'undefined'){
       let storedCart = localStorage.getItem("cart");
        return storedCart?JSON.parse(storedCart) : []
    }
    return [];
}
const initialItems = loadCartFromStorage();
const cartSlice = createSlice({
    name: 'cart',
    initialState:{
        items: initialItems,
        count: initialItems.length || 0
    },
    reducers:{
        addToCart: (state,action)=>{
            const {id,title,size,price,image} = action.payload;
            const existingItem = state.items.find(item=> item.id === id)
            if(existingItem){
                existingItem.qty += 1;
                existingItem.price = existingItem.price * existingItem.qty
                
            }else{
                state.items.push({
                    id,
                    title,
                    size,
                    price,
                    image,
                    qty:1
                })
            }
            state.count = state.items.length
            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(state.items));
            }
        }
    }
})

export const  {addToCart} = cartSlice.actions
export default cartSlice.reducer;