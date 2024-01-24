import { GoogleService } from './src/services/googleService'

declare global {
  interface Window {
    initMap: () => void
  }
}

if (window) window.initMap = () => new GoogleService()
