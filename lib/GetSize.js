export async function getSizes(){
    try{
        const res = await fetch("http://127.0.0.1:8000/api/sizes",{
            cache:'no-store'
        } ) 
        return res.json();

    } catch(err){
        throw new Error ("Faild To Fetch Sizes") 
    }
}