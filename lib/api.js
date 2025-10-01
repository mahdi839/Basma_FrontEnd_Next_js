export async function getData(endpoint) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            next: { revalidate: 0 } ,
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