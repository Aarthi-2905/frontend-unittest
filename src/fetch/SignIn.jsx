export async function loginUser(username, password) {
    const response = await fetch('http://127.0.0.1:8000/token', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: JSON.stringify(`grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`)
    });
 
    const data = await response.json();
    if (!response.ok) {
        console.log('Network response not ok');
        return;
    }
    return data;
}