export async function getSizes(){
    try{
        const res = await fetch("http://127.0.0.1:8000/api/sizes",{
            next: { revalidate: 60 }
        } ) 
        return res.json();

    } catch(err){
        throw new Error ("Faild To Fetch Sizes") 
    }
}