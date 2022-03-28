    let inMemory = null
    
export const getToken = () => inMemory

export const setToken = (token) => {
    inMemory = token
    return true
}

export const deleteToken = () => {
    inMemory = null
    return true
}

 