const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const isServiceWorkerRegister = await navigator.serviceWorker.getRegistrations()

      Notification.requestPermission(async (result: any) => {
        if (result === 'granted') {
          let serviceWorker
          if (isServiceWorkerRegister.length === 0) {
            const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
              scope: '/'
            })
            if (registration.installing) {
              serviceWorker = registration.installing
            } else if (registration.waiting) {
              serviceWorker = registration.waiting
            } else if (registration.active) {
              serviceWorker = registration.active
            }
            if (serviceWorker) {
              serviceWorker.addEventListener('statechange', (e: any) => {
                return e
              })
            }
          }
        }
      })

      // if (isServiceWorkerRegister.length === 0) {
      //   const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      //     scope: '/'
      //   })
      //   console.log('here')
      //   console.log({ registration })
      //   console.log({ navigator })
      //   if (registration.installing) {
      //     console.log('Service worker installing')
      //     serviceWorker = registration.installing
      //   } else if (registration.waiting) {
      //     console.log('Service worker installed')
      //     serviceWorker = registration.waiting
      //   } else if (registration.active) {
      //     console.log('Service worker active')
      //     serviceWorker = registration.active
      //   }
      //   if (serviceWorker) {
      //     console.log({ currentWorkerState: serviceWorker.state })
      //     serviceWorker.addEventListener('statechange', (e: any) => {
      //       console.log({ currentWorkerState: e.target.state })
      //     })
      //   }
      // }
    } catch (error) {
      console.error(`Registration failed with ${error}`)
    }
  }
}

export { registerServiceWorker }
