// Get token from localStorage
const getToken = () => localStorage.getItem('token');

export async function uploadFile(formData){
    const token = getToken();
    const response = await fetch('http://localhost:8000/files/upload', {
        method: 'POST',
        headers : {
            Authorization: "Bearer " + token,
        },
        body : formData
    });
    if (!response.ok) {
        throw new Error('File upload failed');
    }

    const data = await response.json();
    return data;
}

export async function userPrompt(inputText){
    const token = getToken();
    const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ "query": inputText }),
    });

    if (!response.ok) {
        throw new Error('Text submission failed');
    }

    const data = await response.json();
    return data;
}