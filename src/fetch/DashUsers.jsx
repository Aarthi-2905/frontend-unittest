// Get token from localStorage
const getToken = () => localStorage.getItem('token');

export async function addUser(currentRowData){
    const token = getToken();
    console.log(currentRowData)
    const response = await fetch('http://localhost:8000/users/add',{
        method : 'POST',
        headers : {
            'content-type' : 'application/json',
            Authorization: "Bearer " + token,
        },
        body : JSON.stringify(currentRowData),
    });

    if(!response){
        console.log('Network response not ok');
        return;
    }

    const data = await response.json();
    return data;
}
export async function editUserDetails(currentRowData){
    const token = getToken();
    const response = await fetch('http://localhost:8000/users/edit',{
        method : 'PUT',
        headers : {
            'content-type' : 'application/json',
            Authorization: "Bearer " + token,
        },
        body : JSON.stringify(currentRowData),
    });

    if(!response){
        console.log('Network response not ok');
        return;
    }

    const data = await response.json();
    return data;
}

export async function fetchUsers() {
    const token = getToken();
    const response = await fetch('http://localhost:8000/users',{
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

export async function deleteUser(email){
    const token = getToken();
    console.log(email)
    const response = await fetch('http://localhost:8000/users/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
             Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
}