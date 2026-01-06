export async function getSizes(){
    try{
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/sizes',{
            next: { revalidate: 60 }
        } ) 
        return res.json();

    } catch(err){
        throw new Error ("Faild To Fetch Sizes") 
    }
}