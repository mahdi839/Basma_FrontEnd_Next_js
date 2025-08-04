export async function getData(endpoint) {
  const baseUrl = process.env.BACKEND_URL;
  try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
          cache: 'no-store', 
          headers: {
              'Content-Type': 'application/json',
          }
      });
      return await response.json();
  } catch (error) {
      console.error("Error fetching data:", error);
      return null;
  }
}