import { apiMedintt } from 'utils/axios.service'

export const sendMails = async (data: FormData): Promise<any> => {
  const response = await apiMedintt.post('/mailing', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}
