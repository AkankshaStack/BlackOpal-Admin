import moment from "moment"
import { ERoutes } from "src/common/routes"
import config from "src/configs/config"

export const PER_PAGE = 10
export const verificationStatusConversion = (id: number) => {
  switch (id) {
    case 1:
      return 'Pending'
    case 2:
      return 'Requested'
    case 3:
      return 'Verified'
    case 4:
      return 'Rejected'
    case 5:
      return 'Correction'
    case 6:
      return 'Re-Requested'
    default:
      return ''
  }
}
export const paymentConversion= (id: number) => {
  switch (id) {
    case 1:
      return 'warning'
    case 2:
      return 'success'
    case 3:
      return 'error'
    case 4:
      return 'success'
    case 5:
      return 'info'
    default:
      return 'default'
  }
}

export const ruppeeCommaConversation = (rupee: number,fixedDecimal: number | undefined =undefined) => {
  if (rupee) {
    const num = new Intl.NumberFormat('en-IN').format(fixedDecimal ? 1 * parseFloat((rupee / 100).toFixed(fixedDecimal)) : 1 * parseFloat((rupee / 100).toFixed(0)))

         return num;
  } else {
    return rupee
  }
}

export const ruppeeConversation = (rupee: number,fixedDecimal=2) => {
  if (rupee) {
    const num: number =   rupee / 100

    if (num >= 100000000) {
      return String(1 * parseFloat((num / 10000000).toFixed(fixedDecimal))).replace(/\.0$/, '') + 'Cr'
    }
    if (num >= 10000000) {
      return String(1 * parseFloat((num / 10000000).toFixed(fixedDecimal))).replace(/\.0$/, '') + 'Cr'
    }
    if (num >= 100000) {
      return String( 1*  parseFloat((num / 100000).toFixed(fixedDecimal))   ).replace(/\.0$/, '') + 'lakh'
    }
    if (num >= 10000) {
      return String( 1 * parseFloat((num / 1000).toFixed(fixedDecimal) )).replace(/\.0$/, '') + 'K'
    }

    return 1 * parseFloat(num.toFixed(0))
  } else {
    return rupee
  }
}

export const developerConversation = (num:number) =>{
  if(num){
    if (num >= 1000000000) {
      return String(1 * parseFloat((num / 1000000000).toFixed(2))).replace(/\.0$/, '') + '';
   }
    if (num >= 1000000) {
      return String(1 * parseFloat((num / 1000000).toFixed(2))).replace(/\.0$/, '') + ' Mn. sq.ft';
   }
   if (num >= 100000) {
      return String(1* parseFloat((num / 100000).toFixed(2))).replace(/\.0$/, '') + ' lakh sq.ft.';
   }
   if (num >= 10000) {
      return String(1* parseFloat((num / 1000).toFixed(2))).replace(/\.0$/, '') + 'K sq.ft';
   }

   return 1 * parseFloat(num.toFixed(0));
  }else{
    return num
  }
}


export const verificationStatusColor = (id: number) => {
  switch (id) {
    case 1:
      return 'warning'
    case 2:
      return 'primary'
    case 3:
      return 'success'
    case 4:
      return 'error'
    case 5:
      return 'secondary'
    case 6:
      return 'info'
    default:
      return 'default'
  }
}

export const incomeSegmentConversion = (id: number) => {
  switch (id) {
    case 1:
      return 'Affordable (Less than INR 50 Lacs)'
    case 2:
      return 'Premium (INR 50 Lacs to INR 2 Cr)'
    case 3:
      return 'Luxury (INR 2 Cr to INR 5 Cr)'
    case 4:
      return 'Super Luxury -  (INR 5 Cr & Up)'
    default:
      return null
  }
}

export const dealingTypeConversion = (id: number) => {
  switch (id) {
    case 1:
      return 'Residential'
    case 2:
      return 'Office'
    case 3:
      return 'Retail'
  }
}
export const homeLoanPartnerColorConversion = (id: number) => {
  switch (id) {
    case 1:
      return 'warning'
    case 2:
      return 'success'
    case 3:
      return 'info'
    case 4:
      return 'error'
    default:
      return 'default'
  }
}

export const homeLoanPartnerStatusConversion = (id: number) => {
  switch (id) {
    case 1:
      return 'Prequalified'
    case 2:
      return 'Applied'
    case 3:
      return 'Need to apply'
    case 4:
      return 'Not required'
    default:
      return ''
  }
}
export const leadVerificationStatusConversion = (id: number) => {
  switch (id) {
    case 1:
      return 'Pending'
    case 2:
      return 'Applied'
    case 3:
      return 'Verified'
    case 4:
      return 'Rejected'
    case 5:
      return 'Correction'
    case 6:
      return 'Re-requested'
    default:
      return ''
  }
}

export const leadVerificationStatusColor = (id: number) => {
  switch (id) {
    case 1:
      return 'warning'
    case 2:
      return 'info'
    case 3:
      return 'success'
    case 4:
      return 'error'
    case 5:
      return 'secondary'
    case 6:
      return 'info'
    default:
      return 'default'
  }
}

export const leadStatusConversion = (id: number) => {
  switch (id) {
    case 1:
      return 'Active'
    case 2:
      return 'Sold'
    case 3:
      return 'Lost'
    case 4:
      return 'Inactive'
    default:
      return ''
  }
}

export const customerConversion = (id: number) => {
  switch (id) {
    case 1:
      return 'success'
    case 2:
      return 'error'
    default:
      return 'default'
  }
}
export const leadStatusColor = (id: number) => {
  switch (id) {
    case 1:
      return 'success'
    case 2:
      return 'success'
    case 3:
      return 'error'
    case 4:
      return 'error'
    default:
      return 'default'
  }
}

export const documentType = (id: number) => {
  switch (id) {
    case 1:
      return 'RERA Document'
    case 2:
      return 'PAN Document'
    case 3:
      return 'GST Document'
    case 4:
      return 'AADHAR Document'
    case 5:
      return 'CIN Document'
    default:
      return ''
  }
}
export function toDataURL(url: string, callback: any) {
  const xhr = new XMLHttpRequest()
  xhr.onload = () => {
    const reader = new FileReader()
    reader.onloadend = () => {
      callback(reader.result)
    }
    reader.readAsDataURL(xhr.response)
  }
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.send()
}
export async function download(source: string, fileName: string) {
  await toDataURL(source, (dataUrl: any) => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
  })
}
export const transactionStatusConversion = (id: number,type:number) => {
  switch (id) {
    case config?.transactions?.status?.pending:
      return { text: type=== 3 ? 'Requested' : 'Pending', color: type=== 3 ? 'info':'warning' }
    case config?.transactions?.status?.success:
      return { text: 'Success', color: 'success' }
    case config?.transactions?.status?.rejected:
      return { text:  type=== 3 ? 'Declined' : 'Failed', color: 'error' }
    default:
      return { text: 'Default', color: 'default' }
  }
}


export const refundStatusConversion = (id: number) => {
  switch (id) {
    case config?.transactions?.refund?.status?.pending:
      return {text:"Pending",color:'warning'}
    case config?.transactions?.refund?.status?.approve:
      return {text:"Approved",color:"success"}
    case config?.transactions?.refund?.status?.decline:
      return {text:"Declined",color:"error"}

    default:
      return {text:"Default",color:"default"}
  }
}

export const browserSignature = () => {
  const windowObj = window || global;

  // Count Browser window object keys
  const windowObjCount = () => {
    const keys = [];
    for (const i in windowObj) {
      keys.push(i);
    }

    return keys.length.toString(36);
  }

  // window obj and navigator aggregate
  const pad = (str: any, size: any) => {
    return (new Array(size + 1).join('0') + str).slice(-size)
  }

  // Browser mimiTypes and User Agent count
  const navi = (
    navigator.mimeTypes.length + navigator.userAgent.length
  ).toString(36);
  const padString = pad(navi + windowObjCount(), 4);

  // Browser screen specific properties
  const width = windowObj.screen.width.toString(36);
  const height = windowObj.screen.height.toString(36);
  const availWidth = windowObj.screen.availWidth.toString(36);
  const availHeight = windowObj.screen.availHeight.toString(36);
  const colorDepth = windowObj.screen.colorDepth.toString(36);
  const pixelDepth = windowObj.screen.pixelDepth.toString(36);
  
  // Base64 encode
  return btoa(
    padString +
      width +
      height +
      availWidth +
      availHeight +
      colorDepth +
      pixelDepth
  );
}

export function getDateDiff(firstDate: Date, secondDate: Date, unit: moment.unitOfTime.DurationConstructor) {
  return moment(firstDate).diff(moment(secondDate), unit);
}



  export const propertyConversion = (id: number) => {

    switch (id) {
      case 1:
        return "warning"
      case 2:
        return "success"
      case 3:
        return "error"
      default:
        return "default"
    }
  }


export const navigateUrl = (type:string) => {
    switch (type) {
      case 'collection':
        return ERoutes.COLLECTION
      case 'buyingGuide':
        return ERoutes.BUYING_GUIDE
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
      case ' refund':
        return ERoutes.REFUND_REQUESTS
      case 'agentUpdate':
        return `/agent-approvals/pending-approvals`
      default:
        return '/home'
    }
  }
  
  
