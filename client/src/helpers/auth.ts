const tokenPropertyName = 'token'
let token: string

const getToken = () => {
  if (token) {
    return token
  }

  const tokenData = localStorage.getItem(tokenPropertyName)
  return wrapTokenData(tokenData as string)
}

export const setToken = (tokenPayload: string): void => {
  localStorage.setItem(tokenPropertyName, tokenPayload)
  token = wrapTokenData(tokenPayload)
}

export const removeToken = (): void => {
  localStorage.removeItem(tokenPropertyName)
}

const wrapTokenData = (tokenPayload: string): string => {
  return `Bearer ${tokenPayload}`
}

export const getRequestHeaders = (token?: string) => {
  const authHeader = token ? wrapTokenData(token) : getToken()
  return { headers: { authorization: authHeader } }
}