importScripts('https://www.gstatic.com/firebasejs/9.7.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.7.0/firebase-messaging-compat.js')

const navigateUrl = type => {
  switch (type) {
    case 'collection':
      return `/collections`
    case 'buyingGuide':
      return `/buying-guide`
    case 'propertyAdd':
      return `/project/property-pending`
    case 'propertyApprove':
      return `/project/all-listing`
    case 'propertyReject':
      return `/project/declined`
    case 'propertyUnlist':
      return `/project/unlisted`
    case 'property':
      return `/project/all-listing`
    case 'agentAdd':
      return `/agent-approvals/pending-approvals`
    case 'refund':
      return `/refund-requests`
    case 'agentUpdate':
      return `/agent-approvals/pending-approvals`
    default:
      return '/home'
  }
}

self.addEventListener('notificationclick', async event => {
  event.notification.close()

  const data = event.notification.data.FCM_MSG.data
  var flag = false

  event.waitUntil(
    self.clients
      .claim()
      .then(() => {
        return self.clients.matchAll({ type: 'window' })
      })
      .then(clients => {
        if (clients?.length > 0) {
          let nav = clients.find(client => {
            if (client.url.includes(navigateUrl(data?.type)) && data?.type) {
              flag = true

              return client.focus()
            }
          })
          if (flag) {
            return nav
          } else {
            return clients.find(client => {
              if ('navigate' in client) {
                return client.focus().then(() => client.navigate(navigateUrl(data?.type)))
              }
            })
          }
        } else {
          return self.clients.openWindow(`https://admin.blackopal.squareboat.info${navigateUrl(data?.type)}`)
        }

        return nav
      })
  )
})

checkClientIsVisible = async () => {
  const windowClients = await clients.matchAll({
    type: 'window'
  })

  for (var i = 0; i < windowClients.length; i++) {
    if (windowClients[i].visibilityState === 'visible') {
      return true
    }
  }

  //

  return false
}

checkClientIsVisible()

const firebaseConfig = {
  apiKey: 'AIzaSyB8Ui6pAd81ahA4vWeZQ1f-YzjpvcrqVvI',
  authDomain: 'justhomz-dev.firebaseapp.com',
  projectId: 'justhomz-dev',
  storageBucket: 'justhomz-dev.appspot.com',
  messagingSenderId: '484810807844',
  appId: '1:484810807844:web:f3a09fa1a0018c7ebad6b1',
  measurementId: 'G-TCLN4DZ6F'
}

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
  notificationTitle = payload.data.title
  notificationOptions = {
    body: notificationTitle,
    data: { payload: payload?.data }
  }
})
