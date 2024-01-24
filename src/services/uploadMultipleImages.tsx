/* eslint-disable consistent-return */
import { axiosInstance } from 'src/utilities/configureAxios'
import BACKEND_ROUTE from 'src/common/constant'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Helpers } from 'src/utilities/helpers'

export const UploadMultipleImageService = async (payload: any, setLoader?: any) => {
  // file = await resizeFile(file, maxWidth, maxHeight, compressFormat, quality);

  const { files } = payload

  // const { name, type } = file

  // const data = {
  //   fileName: name.split('.')[0],
  //   mimeType: type,
  //   objType: 'images',
  //   sourceDisk: 'media',
  // }
  const formData = new FormData()
  formData.append('files', files)
  const extensions: string[] = []
  for (let i = 0; i < files.length; i++) {
    extensions.push(Helpers.getFileExtension(files[i].name))
  }
  const name: string[] = files.map((data: any) => data.name)

  return axiosInstance
    .post(BACKEND_ROUTE.UPLOAD_IMAGE, {
      disk: 'properties',
      n: `${payload?.files?.length}`,
      path: payload.path,
      extensions: extensions,
      fileNames: name
    })
    .then(async (res: any) => {
      if (res.data.success) {
        const keys: any[] = []

        for (let i = 0; i < res.data?.data?.length; i++) {
          await axios
            .put(res.data.data[i].url, files[i], {
              headers: { 'Content-Type': files[i].type }
            })
            .then(async s3Response => {
              if (s3Response.status === 200) {
                if (payload.url && payload.single) {
                  keys.push(res.data.data[i].signedUrl)
                  keys.push(res.data.data[i].key)
                } else {
                  keys.push(res.data.data[i].key)
                }
              }
            })
            .catch(err => {
              toast.error('An error occurred while trying to upload file.')
              throw err
            })
        }

        // toast.success('All images uploaded.')

        return keys
      }
    })
    .catch(err => {
      setLoader(false)
      throw err
    })
}

export default UploadMultipleImageService
