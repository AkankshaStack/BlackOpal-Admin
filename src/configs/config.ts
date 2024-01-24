const config: any = {
  PER_PAGE:10,
rating:{
                0: `0 ${String.fromCharCode(9733)} and above`,
                1: `1 ${String.fromCharCode(9733)} and above`,
                2: `2 ${String.fromCharCode(9733)} and above`,
                3: `3 ${String.fromCharCode(9733)} and above`,
                4: `4 ${String.fromCharCode(9733)} and above`,
                5: `5 ${String.fromCharCode(9733)} ${String.fromCharCode(9733)} ${String.fromCharCode(
                  9733
                )} ${String.fromCharCode(9733)} ${String.fromCharCode(9733)}`      
},
notifications: {
  status: {
    created: 1,
    read: 2,
    deleted: 3,
  },
},
  verificationType: {
    email: 1,
    mobile: 2
  },

  orgType: {
    individual: 1,
    company: 2,
    freelancer: 3
  },
  leads:{
    verificationStatus:{
      Pending: 1,
      Applied: 2,
      Verified: 3,
      Rejected: 4,
      Correction: 5,
      'Re-requested': 6,
    },
    status:{
      'Active':1,
      'Sold':2,
      'Lost':3,
      Inactive:4
    }
  },
  preferences: {
    earnestMoneyStatus: {
      1:'Ready',
      2:'In progress',
      3:'Required',
    },
    homeLoanStatus: {
      1:'Prequalified',
      2:'Applied',
      3:'Need to apply',
      4:'Not required',
    },
    noOfBedrooms: {
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6+',
      7: 'Studio',
      8: 'Bachelor',
      9:'Serviced Apartment'
    },
    noOfBathrooms: {
      0:'Any',
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
    },
  },
  agents: {
    type: {
      individual: 1,
      company: 2,
      customer: 3
    },
    verificationStatus: {
      pending: 1,
      requested: 2,
      verified: 3,
      rejected: 4,
      correctionRequired: 5,
      reRequested: 6
    },
    entityType: {
      company: 1,
      business: 2
    }
  },
  company: {
    status: {
      publicLimited: 1,
      privateLimited: 2,
      llp: 3
    }
  },
  loginType: {
    email: 1,
    mobile: 2
  },
  ownerType: ['properties', 'user'],
  users: {
    status: {
      active: 1,
      inActive: 2
    }
  },
  certificates: {
    type: {
      rera: 1,
      pan: 2,
      gst: 3,
      aadhar: 4,
      cin: 5,
    },
    status: {
      rejected: 0,
      approved: 1
    }
  },
  comapnyType: ['', 'Public limited - Traded', 'Public limited - Non Traded', 'Private limited', 'LLP'],
  propertyStatus: {
    pending: 1,
    approved: 2,
    declined: 3
  },
  listingStatus: {
    listed: 2,
    unlisted: 1
  },
  agentlistingStatus: {
    listed: 1,
    unlisted: 2
  },
  propertyStatus1: {
    1: 'pending',
    2: 'approve',
    3: 'rejected',
    4: 'listed',
    5: 'unlisted'
  },
  properties: {
    employeesData: {
      1: '1-50',
      2: '50-100',
      3: '100-500',
      4: '500+'
    },
    availabilityStatus: {
      1: 'Under construction',
      2: 'Ready to move in'
    },
    securityTier: {
      1: 'Tier 1',
      2: 'Tier 2',
      3: 'Tier 3',
      4: 'Tier 4',
      5: 'Tier 5',
    },
    developerRating: {
           1:'AAA',
            2:'AA+', 
             3: 'AA',
              4:'AA-',
              5:'A+',
              6:'A',
              7:"A-",
              8:'BBB+',
              9:'BBB',
              10:'BBB-',
              11:"BB+",
              12:"BB",
              13:"BB-",
              14:"B+",
              15:"B",
              16:"B-",
              17:"C+",
              18:"C-",
              19:'D'
    },
    ratingProvidedBy: {
      1: 'CARE',
      2: 'CRISIL',
      3: 'ICRA',
      4:'India Ratings',
      5:'Others'
    },
    propertyType: {
      1: 'Highrise Apartment',
      2: 'Villa',
      3: 'Independent Floor',
      4: 'Residential Plot',
      5:'Studio Apartment',
      6:'Senior Living',
      7:'Student Housing',
      8:'Service Apartment',
      9:'Lowrise Apartment'
    },
    constructionType: {
      1:'Mivan construction',
      2:'Brickwork',
      3:'Steel Structure',
   },
   flooringType: {
    1:'Italian',
    2:'Verified Tile',
    3:'Vinyl',
    4:'Hard wood',
    5:'Granite',
    6:'Concrete',
    7:'Laminated',
    8:'Terrazzo',
 },
  configurations: {
      1: '1 bhk',
      2: '2 bhk',
      3: '3 bhk',
      4: '4 bhk',
      5: '5 bhk',
      6: '6+ bhk',
      7: 'Studio',
      8:'Penthouse',
      9:'Plot' 
      },
    
  developer: {
    companyStatus: {
      1:'Public limited - Traded',
      2:'Public limited - Non Traded',
      3:'Private limited',
      4:'LLP',
      5:'Partnership',
      6:'Sole Propertiership'
    }
    },
    nearby: {
      businessType: {
        1: 'School',
        2: 'Shopping Mall',
        3: 'Hospital',
        4: 'Department Store',
        5: 'Atm',
        6:'Airport',
        7:'Bus Station',
        8:'Metro',
        9:'Police Station',
        10:'Park',
      }
    }
  },
  collectionStatus: {
    1: 'Active',
    2: 'Inactive'
  },   
  transactions: {
      revtype: {
         1:'Debit',
         2:'Credit',
      },
      type: {
         debit:1,
         credit:2,
      },
      transactionFor: {
        1:'Order',
        2:'Lead',
        3:'Refund',
        4:'Recharge',
        5:'Project',
        6:'Team Member'
     },
      status: {
        pending: 1,
        success: 2,
        rejected: 3,
      },
      refund: {
        status: {
          pending: 1,
          approve: 2,
          decline: 3,
        },
      },
    },
    payment: {
      status: {
         1:'Pending',
         2:'Success',
         3:'Failed',
         4:'Refunded',
         5:'Partially refunded',
      },
      revStatus: {
         'Pending':1,
         'Success':2,
         'Failed':3,
         'Refunded':4,
         'Partially refunded':5,
      },
    },
  nameLengthCheck: 20,
  declinedReason :[
    'Certificate Provided was invalid',
    'Delay in the payment',
    'Conflict of Interest',
    'User is not valid',
    'Account to be Verified'
  ],
  projectRating:{
    high:'error',
    medium:'warning',
    severe:'success'
  },
}



export default config
