// Get token from localStorage
const getToken = () => localStorage.getItem('token');

export async function fetchFiles() {
    const token = getToken();
    const response = await fetch('http://localhost:8000/files/request_all',{
        method : 'GET',
        headers : {
            'content-type' : 'application/json',
            Authorization: "Bearer " + token,
        },
    }); 
    if (!response) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
}

export async function approveFile(filename) {
    console.log(filename)
    const token = getToken();
    const response = await fetch('http://localhost:8000/files/accept',{
        method : 'POST',
        headers : {
            'content-type' : 'application/json',
            Authorization: "Bearer " + token,
        },
        body : JSON.stringify({filename})
    }); 
    if (!response) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
}

export async function rejectFile(filename) {
    const token = getToken();
    const response = await fetch('http://localhost:8000/files/reject',{
        method : 'POST',
        headers : {
            'content-type' : 'application/json',
            Authorization: "Bearer " + token,
        },
        body : JSON.stringify({filename})
    }); 
    if (!response) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
}