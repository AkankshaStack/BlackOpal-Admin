// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import faq from 'src/store/settings/faq'
import privacy from 'src/store/settings/privacy-policy'
import tnc from 'src/store/settings/tnc'
import verification from './verification'
import project from './project'
import property from 'src/store/apps/property'
import teammember from './teammember'
import leads from 'src/store/leads'
import buyingGuide from './buying-guide'
import transaction from './transaction'
import collections from './collections'
import customer from 'src/store/customer'
import rating from 'src/store/rating'


export const store = configureStore({
  reducer: {
    user,
    privacy,
    chat,
    email,
    project,
    invoice,
    calendar,
    faq,
    verification,
    permissions,
    tnc,
    property,
    leads,
    teammember,
    buyingGuide,
    collections,
    transaction,
    customer,
    rating
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
