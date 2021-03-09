const tokenPropertyName = 'token'

export const getToken = () => {
  localStorage.getItem(tokenPropertyName)
}

export const setToken = (token) => {
  localStorage.setItem(tokenPropertyName, token)
}

export const removeToken = () => {
  localStorage.removeItem(tokenPropertyName)
}