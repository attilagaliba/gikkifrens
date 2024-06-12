
import img1 from 'src/assets/images/profile/user-1.jpg';

import icon1 from 'src/assets/images/svgs/icon-account.svg'

import ddIcon1 from 'src/assets/images/svgs/icon-dd-chat.svg'

//
// Notifications dropdown
//
const notifications = [
  {
    avatar: img1,
    title: 'te',
    subtitle: 'te',
  }
];

//
// Profile dropdown
//
const profile = [
  {
    href: '/',
    title: 'acc',
    subtitle: 'acc',
    icon: icon1,
  }
];

// apps dropdown

const appsLink = [
  {
    href: '/',
    title: 'app',
    subtext: 'app',
    avatar: ddIcon1
  }
]

const pageLinks = [
  {
    href: '/',
    title: 'pg'
  },
]

export { notifications, profile, pageLinks, appsLink };
