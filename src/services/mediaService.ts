/* eslint-disable consistent-return */
import { axiosInstance } from 'src/utilities/configureAxios'
import BACKEND_ROUTE from 'src/common/constant'
import toast from 'react-hot-toast'
import axios from 'axios'


export const UploadImageService = async (payload: any) => {
  // file = await resizeFile(file, maxWidth, maxHeight, compressFormat, quality);
    const { file } = payload

    // const { name, type } = file

    // const data = {
    //   fileName: name.split('.')[0],
    //   mimeType: type,
    //   objType: 'images',
    //   sourceDisk: 'media',
    // }
    const formData = new FormData()
    formData.append('file', file)

    return axiosInstance
      .post(BACKEND_ROUTE.UPLOAD_IMAGE, {
        n: '1',
        path: payload.path
      })
      .then((res: any) => {
        if (res.data.success) {
          return axios
            .put(res.data.data[0].url, file, {
              headers: { 'Content-Type': file.type }
            })
            .then(async s3Response => {
              if (s3Response.status === 200) {
                toast.success(
                  'Successfully Uploaded',
                )
                const data1 = res.data.data[0]

                return [data1.signedUrl, data1.key]
              }
            })
            .catch(err => {
              toast.error('An error occurred while trying to upload file.')
              throw err
            })
        }
      })
      .catch(err => {
        throw err
      })
  }


export default UploadImageService
