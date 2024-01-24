import {
  HomeOutline,
  HomeRemoveOutline,
  HomePlusOutline,
  AccountCheck,
  AccountClock,
  AccountRemove,
  BadgeAccount,
  FrequentlyAskedQuestions,
  HomeCityOutline,
  Menu,
  ShieldAccount,
  ProgressClock,
  FormatListBulleted,
  RhombusSplit,
  TelevisionGuide,
  BankTransfer,
  AccountLock,
  Equalizer
} from 'mdi-material-ui'

import { ERoutes } from 'src/common/routes'

// ** Icon imports

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

// import Image from 'next/image'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      icon: HomeOutline,
      path: '/home',
      role: null
    },
    {
      title: 'Agent approvals',
      icon: Menu,
      role: 'jh-agent-admin',

      // badgeContent: 'new',
      badgeColor: 'error',
      children: [
        {
          icon: AccountClock,
          title: 'Pending Approvals',
          path: '/agent-approvals/pending-approvals'
        },
        {
          icon: AccountCheck,
          title: 'Approved Requests',
          path: '/agent-approvals/approved-list'
        },
        {
          icon: AccountRemove,
          title: 'Unlisted Agents',
          path: '/agent-approvals/unlisted'
        }
      ]
    },
    {
      title: 'Manage Champion',
      icon: Menu,

      // <Image src={/images/quotation.svg} alt="Menu", height={30}, width={30} />,

      role: 'jh-agent-admin',

      // badgeContent: 'new',
      badgeColor: 'error',
      children: [
        {
          icon: AccountClock,
          title: 'Champion List ',
          path: '/customer-champion/customer-list'
        },
        {
          icon: AccountCheck,
          title: 'Pending Approvals',
          path: '/customer-champion/pending-Approval'
        },
        {
          icon: AccountCheck,
          title: 'Champion Transactions',
          path: '/customer-champion/champion-transaction'
        }
      ]
    },
    {
      title: 'Properties',
      icon: HomeCityOutline,
      role: 'jh-agent-admin',

      // badgeContent: 'new',
      badgeColor: 'error',
      children: [
        {
          icon: HomePlusOutline,
          title: 'Approved Properties',
          path: '/project/approved-project'
        },
        {
          icon: HomeRemoveOutline,
          title: 'Pending Properties',
          path: '/project/pending'
        },
        {
          icon: HomeRemoveOutline,
          title: 'Declined Properties',
          path: '/project/declined'
        }
      ]
    },
    {
      icon: FormatListBulleted,
      title: 'Bulk Listing',
      path: ERoutes.BULK_UPLOAD,
      role: 'jh-project-admin'
    },
    {
      title: 'Properties',
      icon: HomeCityOutline,
      role: 'jh-project-admin',

      // badgeContent: 'new',
      badgeColor: 'error',
      children: [
        {
          icon: FormatListBulleted,
          title: 'All listed Properties',
          path: '/project/all-listing'
        },
        {
          icon: ProgressClock,
          title: 'Property Updates',
          path: '/project/property-update'
        },
        {
          icon: HomePlusOutline,
          title: 'Pending Properties',
          path: '/project/property-pending'
        },
        {
          icon: HomeRemoveOutline,
          title: 'Declined Properties',
          path: '/project/declined'
        },
        {
          icon: HomeRemoveOutline,
          title: 'Unlisted Properties',
          path: '/project/unlisted'
        }
      ]
    },
    {
      icon: BankTransfer,
      title: 'All Payments',
      path: ERoutes.PAYMENTS,
      role: 'jh-agent-admin'
    },
    {
      icon: AccountLock,
      title: 'All Customer',
      path: ERoutes.CUSTOMER,
      role: 'jh-agent-admin'
    },
    {
      icon: AccountCheck,
      title: 'Close leads',
      path: ERoutes.CLOSED_LEADS,
      role: 'jh-agent-admin'
    },
    {
      icon: BankTransfer,
      title: 'Refund Requests',
      path: ERoutes.REFUND_REQUESTS,
      role: 'jh-agent-admin'
    },
    {
      title: 'T&C',
      icon: BadgeAccount,
      path: '/tnc',
      role: 'jh-agent-admin'
    },
    {
      title: 'Privacy Policy',
      icon: ShieldAccount,
      path: '/privacy-policy',
      role: 'jh-agent-admin'
    },
    {
      title: 'Agent Analytics',
      icon: Equalizer,
      path: '/agent-analytics',
      role: 'jh-agent-admin'
    },
    {
      title: 'Customer Analytics',
      icon: Equalizer,
      path: '/customer-analytics',
      role: 'jh-agent-admin'
    },
    {
      title: 'Subscription Plan',
      icon: ShieldAccount,
      path: '/subscription',
      role: 'jh-agent-admin'
    },

    // {
    //   title: 'Trending Properties',
    //   icon: FrequentlyAskedQuestions,
    //   path: '/trendingProperties',
    //   role: 'jh-agent-admin'
    // },

    {
      title: 'Broadcast Notification',
      icon: FrequentlyAskedQuestions,
      path: '/broadcastNotification',
      role: 'jh-agent-admin'
    },
    {
      title: 'FAQs',
      icon: FrequentlyAskedQuestions,
      path: '/faq',
      role: 'jh-agent-admin'
    },
    {
      title: 'Collections',
      role: 'jh-project-admin',
      icon: RhombusSplit,
      path: ERoutes.COLLECTION
    },
    {
      title: 'Buying Guides',
      role: 'jh-project-admin',
      icon: TelevisionGuide,
      path: ERoutes.BUYING_GUIDE
    }

    // {
    //   sectionTitle: 'Forms & Tables'
    // },
    // {
    //   title: 'Form Elements',
    //   icon: FormSelect,
    //   children: [
    //     {
    //       title: 'Text Field',
    //       path: '/forms/form-elements/text-field'
    //     },
    //     {
    //       title: 'Select',
    //       path: '/forms/form-elements/select'
    //     },
    //     {
    //       title: 'Checkbox',
    //       path: '/forms/form-elements/checkbox'
    //     },
    //     {
    //       title: 'Radio',
    //       path: '/forms/form-elements/radio'
    //     },
    //     {
    //       title: 'Textarea',
    //       path: '/forms/form-elements/textarea'
    //     },
    //     {
    //       title: 'Autocomplete',
    //       path: '/forms/form-elements/autocomplete'
    //     },
    //     {
    //       title: 'Date Pickers',
    //       path: '/forms/form-elements/pickers'
    //     },
    //     {
    //       title: 'Switch',
    //       path: '/forms/form-elements/switch'
    //     },
    //     {
    //       title: 'File Uploader',
    //       path: '/forms/form-elements/file-uploader'
    //     },
    //     {
    //       title: 'Editor',
    //       path: '/forms/form-elements/editor'
    //     },
    //     {
    //       title: 'Slider',
    //       path: '/forms/form-elements/slider'
    //     },
    //     {
    //       title: 'Input Mask',
    //       path: '/forms/form-elements/input-mask'
    //     }
    //   ]
    // },

    // {
    //   title: 'User Profile',
    //   icon: BadgeAccount,
    //   path: '/zoom'
    // }
    // {
    //   sectionTitle: 'Apps & Pages'
    // },
    // {
    //   title: 'Email',
    //   icon: EmailOutline,
    //   path: '/apps/email'
    // },
    // {
    //   title: 'Chat',
    //   icon: MessageOutline,
    //   path: '/apps/chat'
    // },
    // {
    //   title: 'Calendar',
    //   icon: CalendarBlankOutline,
    //   path: '/apps/calendar'
    // },
    // {
    //   title: 'Invoice',
    //   icon: FileDocumentOutline,
    //   children: [
    //     {
    //       title: 'List',
    //       path: '/apps/invoice/list'
    //     },
    //     {
    //       title: 'Preview',
    //       path: '/apps/invoice/preview'
    //     },
    //     {
    //       title: 'Edit',
    //       path: '/apps/invoice/edit'
    //     },
    //     {
    //       title: 'Add',
    //       path: '/apps/invoice/add'
    //     }
    //   ]
    // },
    // {
    //   title: 'User',
    //   icon: AccountOutline,
    //   children: [
    //     {
    //       title: 'List',
    //       path: '/apps/user/list'
    //     },
    //     {
    //       title: 'View',
    //       path: '/apps/user/view'
    //     }
    //   ]
    // },
    // {
    //   title: 'Roles & Permissions',
    //   icon: LockOutline,
    //   children: [
    //     {
    //       title: 'Roles',
    //       path: '/apps/roles'
    //     },
    //     {
    //       title: 'Permissions',
    //       path: '/apps/permissions'
    //     }
    //   ]
    // },
    // {
    //   title: 'Pages',
    //   icon: FileDocumentOutline,
    //   children: [
    //     {
    //       title: 'Authentication',
    //       children: [
    //         {
    //           title: 'Login',
    //           children: [
    //             {
    //               openInNewTab: true,
    //               title: 'Login v1',
    //               path: '/pages/auth/login-v1'
    //             },
    //             {
    //               openInNewTab: true,
    //               title: 'Login v2',
    //               path: '/pages/auth/login-v2'
    //             },
    //             {
    //               openInNewTab: true,
    //               title: 'Login With AppBar',
    //               path: '/pages/auth/login-with-appbar'
    //             }
    //           ]
    //         },
    //         {
    //           title: 'Register',
    //           children: [
    //             {
    //               openInNewTab: true,
    //               title: 'Register v1',
    //               path: '/pages/auth/register-v1'
    //             },
    //             {
    //               openInNewTab: true,
    //               title: 'Register v2',
    //               path: '/pages/auth/register-v2'
    //             }
    //           ]
    //         },
    //         {
    //           title: 'Forgot Password',
    //           children: [
    //             {
    //               openInNewTab: true,
    //               title: 'Forgot Password v1',
    //               path: '/pages/auth/forgot-password-v1'
    //             },
    //             {
    //               openInNewTab: true,
    //               title: 'Forgot Password v2',
    //               path: '/pages/auth/forgot-password-v2'
    //             }
    //           ]
    //         },
    //         {
    //           title: 'Reset Password',
    //           children: [
    //             {
    //               openInNewTab: true,
    //               title: 'Reset Password v1',
    //               path: '/pages/auth/reset-password-v1'
    //             },
    //             {
    //               openInNewTab: true,
    //               title: 'Reset Password v2',
    //               path: '/pages/auth/reset-password-v2'
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       title: 'Account Settings',
    //       path: '/pages/account-settings'
    //     },
    //     {
    //       title: 'Pricing',
    //       path: '/pages/pricing'
    //     },
    //     {
    //       title: 'FAQ',
    //       path: '/pages/faq'
    //     },
    //     {
    //       title: 'Knowledge Base',
    //       path: '/pages/knowledge-base'
    //     },
    //     {
    //       title: 'Miscellaneous',
    //       children: [
    //         {
    //           openInNewTab: true,
    //           title: 'Coming Soon',
    //           path: '/pages/misc/coming-soon'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Under Maintenance',
    //           path: '/pages/misc/under-maintenance'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Page Not Found - 404',
    //           path: '/pages/misc/404-not-found'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Not Authorized - 401',
    //           path: '/pages/misc/401-not-authorized'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Server Error - 500',
    //           path: '/pages/misc/500-server-error'
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   icon: VectorArrangeBelow,
    //   title: 'Dialog Examples',
    //   path: '/pages/dialog-examples'
    // },
    // {
    //   sectionTitle: 'User Interface'
    // },
    // {
    //   title: 'Typography',
    //   icon: FormatLetterCase,
    //   path: '/ui/typography'
    // },
    // {
    //   title: 'Icons',
    //   path: '/ui/icons',
    //   icon: GoogleCirclesExtended
    // },
    // {
    //   title: 'Cards',
    //   icon: CreditCardOutline,
    //   children: [
    //     {
    //       title: 'Basic',
    //       path: '/ui/cards/basic'
    //     },
    //     {
    //       title: 'Statistics',
    //       path: '/ui/cards/statistics'
    //     },
    //     {
    //       title: 'Advanced',
    //       path: '/ui/cards/advanced'
    //     },
    //     {
    //       title: 'Gamification',
    //       path: '/ui/cards/gamification'
    //     },
    //     {
    //       title: 'Actions',
    //       path: '/ui/cards/actions'
    //     },
    //     {
    //       title: 'Widgets',
    //       path: '/ui/cards/widgets'
    //     }
    //   ]
    // },
    // {
    //   badgeContent: '18',
    //   title: 'Components',
    //   icon: ArchiveOutline,
    //   badgeColor: 'primary',
    //   children: [
    //     {
    //       title: 'Accordion',
    //       path: '/components/accordion'
    //     },
    //     {
    //       title: 'Alerts',
    //       path: '/components/alerts'
    //     },
    //     {
    //       title: 'Avatars',
    //       path: '/components/avatars'
    //     },
    //     {
    //       title: 'Badges',
    //       path: '/components/badges'
    //     },
    //     {
    //       title: 'Buttons',
    //       path: '/components/buttons'
    //     },
    //     {
    //       title: 'Button Group',
    //       path: '/components/button-group'
    //     },
    //     {
    //       title: 'Chips',
    //       path: '/components/chips'
    //     },
    //     {
    //       title: 'Dialogs',
    //       path: '/components/dialogs'
    //     },
    //     {
    //       title: 'List',
    //       path: '/components/list'
    //     },
    //     {
    //       title: 'Menu',
    //       path: '/components/menu'
    //     },
    //     {
    //       title: 'Pagination',
    //       path: '/components/pagination'
    //     },
    //     {
    //       title: 'Ratings',
    //       path: '/components/ratings'
    //     },
    //     {
    //       title: 'Snackbar',
    //       path: '/components/snackbar'
    //     },
    //     {
    //       title: 'Tabs',
    //       path: '/components/tabs'
    //     },
    //     {
    //       title: 'Timeline',
    //       path: '/components/timeline'
    //     },
    //     {
    //       title: 'Toasts',
    //       path: '/components/toast'
    //     },
    //     {
    //       title: 'Tree View',
    //       path: '/components/tree-view'
    //     },
    //     {
    //       title: 'More',
    //       path: '/components/more'
    //     }
    //   ]
    // },
    // {
    //   icon: CubeOutline,
    //   title: 'Form Layouts',
    //   path: '/forms/form-layouts'
    // },
    // {
    //   title: 'Form Validation',
    //   path: '/forms/form-validation',
    //   icon: CheckboxMarkedCircleOutline
    // },
    // {
    //   title: 'Form Wizard',
    //   path: '/forms/form-wizard',
    //   icon: PackageVariantClosed
    // },
    // {
    //   title: 'Table',
    //   icon: Table,
    //   path: '/tables/mui'
    // },
    // {
    //   title: 'Mui DataGrid',
    //   icon: Table,
    //   path: '/tables/data-grid'
    // },
    // {
    //   sectionTitle: 'Charts & Misc'
    // },
    // {
    //   title: 'Charts',
    //   icon: ChartDonut,
    //   children: [
    //     {
    //       title: 'Apex',
    //       path: '/charts/apex-charts'
    //     },
    //     {
    //       title: 'Recharts',
    //       path: '/charts/recharts'
    //     },
    //     {
    //       title: 'ChartJS',
    //       path: '/charts/chartjs'
    //     }
    //   ]
    // },
    // {
    //   path: '/acl',
    //   action: 'read',
    //   subject: 'acl-page',
    //   icon: ShieldOutline,
    //   title: 'Access Control'
    // },
    // {
    //   title: 'Others',
    //   icon: DotsHorizontal,
    //   children: [
    //     {
    //       title: 'Menu Levels',
    //       children: [
    //         {
    //           title: 'Menu Level 2.1'
    //         },
    //         {
    //           title: 'Menu Level 2.2',
    //           children: [
    //             {
    //               title: 'Menu Level 3.1'
    //             },
    //             {
    //               title: 'Menu Level 3.2'
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       title: 'Disabled Menu',
    //       disabled: true
    //     },
    //     {
    //       title: 'Raise Support',
    //       externalLink: true,
    //       openInNewTab: true,
    //       path: 'https://pixinvent.ticksy.com/'
    //     },
    //     {
    //       title: 'Documentation',
    //       externalLink: true,
    //       openInNewTab: true,
    //       path: 'https://pixinvent.com/demo/materialize-mui-react-nextjs-admin-template/documentation'
    //     }
    //   ]
    // }
  ]
}

export default navigation
