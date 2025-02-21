import { getData } from "@/lib/api";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";


export default async function page() {
  
  let sizes = [];
  try{
    sizes = await getData("http://127.0.0.1:8000/api/sizes")
    
  }catch(err){
    return <p className="text-center text-danger">Error loading sizes.</p>;
  }

  return (
    <div className="container-fluid my-5">
      <Link href="/dashboard/sizes/add">
        <button className="btn size_btn mb-3">Add Size</button>
      </Link>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th className="text-center">Id</th>
            <th className="text-center">Sizes</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
         {
         
            sizes.map((size)=>{
               return (
                <tr key={size.id}>
                <td className="text-center">{size.id}</td>
                <td className="text-center">{size.size}</td>
                <td className="text-center "> <span className="d-flex gap-3 justify-content-center ">
                <Link href={`/dashboard/sizes/edit/${size.id}`}><FaEdit  /></Link> <FaTrash className="text-danger"/></span> </td>
              </tr>
               )
            })
          
         }
        </tbody>
      </table>
    </div>
  );
}
