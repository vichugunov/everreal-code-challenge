import axios from 'axios'

export const baseUrl = ApiBaseUrl

export const login = (payload: {username: string, password: string}): Promise<string> => {
  return axios.post(`${baseUrl}/login`, payload)
    .then((response) => {
      return response.data
    })
}