
export async function getData(url){
    try{
        const res = await fetch(url,{
            cache:'no-store'
        } ) 
        return res.json();

    } catch(err){
        throw new Error ("Faild To Fetch Sizes") 
    }
}