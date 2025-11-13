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
            const {id,title,size,price,image,preQty} = action.payload;
            const existingItem = state.items.find(item=> item.id === id)
            if(existingItem){
                existingItem.qty += 1;
                
            }else{
                state.items.push({
                    id,
                    title,
                    size,
                    unitPrice:price,
                    totalPrice:preQty?price*preQty:price,
                    image,
                    qty:preQty??1
                })
            }
            state.count = state.items.length
            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(state.items));
            }
        },
        increament: (state,action)=>{
            const {id} = action.payload;
            const item = state.items.find(i => i.id === id)
            if(item){
                item.qty +=1
                item.totalPrice = item.unitPrice * item.qty
                if (typeof window !== 'undefined') {
                localStorage.setItem('cart',JSON.stringify(state.items))
               }
            }
        },
        decreament: (state,action)=>{
            const {id} = action.payload;
            const item = state.items.find(i => i.id === id)
            if(item && item.qty>1){
                item.qty -=1
                item.totalPrice = item.unitPrice * item.qty
                if (typeof window !== 'undefined') {
                localStorage.setItem('cart',JSON.stringify(state.items))
                }
            }
        },
        removeCart:(state,action)=>{
            const {id} = action.payload;
            state.items = state.items.filter((item)=> item.id !== id)
            state.count = state.items.length
            if (typeof window !== 'undefined') {
            localStorage.setItem('cart',JSON.stringify(state.items))
            }
        },
        clearCart:(state)=>{
            state.items = [];
            state.count = 0;
            if(typeof window !== 'undifined'){
                localStorage.removeItem('cart')
            }
        }
    }
})

export const  {addToCart,increament,decreament,removeCart,clearCart} = cartSlice.actions
export default cartSlice.reducer;