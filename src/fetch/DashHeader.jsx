// Get token from localStorage
const getToken = () => localStorage.getItem('token');

export async function allNotification(){
    const token = getToken();
    const response = await fetch('http://localhost:8000/notifications', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
                Authorization: "Bearer " + token,
        },
    });
    if (!response.ok) {
        throw new Error('Text submission failed');
    }
    const data = await response.json();
    return data;
}

export async function readOneNotification(notificationToRemove){
    const token = getToken();
    const response = await fetch('http://localhost:8000/notifications/read_one', {
        method : "PUT",
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token,
        },
        body : JSON.stringify({"file_name" : notificationToRemove.split(" from ")[0], "email" : notificationToRemove.split(" from ")[1]})
    });
    if (!response.ok) {
        throw new Error('Text submission failed');
    }
    const data = await response.json();
    return data;
}

export async function clearAllNotification(){
    const token = getToken();
    const response = await fetch('http://localhost:8000/notifications/read_all', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify({}) 
    });
    if (!response.ok) {
        throw new Error('Failed to clear notifications');
    }
    const data = await response.json();
    return data;
}