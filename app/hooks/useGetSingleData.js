import { useEffect, useState } from 'react';
import axios from 'axios';

const useGetSingleData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


    const fetchSingleData = async (url) => {
        const token = localStorage.getItem("token");
      try {
        const response = await axios.get(url,{
            headers:{
               Authorization: `Bearer ${token}`
            }
          });
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };


  return {fetchSingleData, data, loading, error };
};

export default useGetSingleData;
