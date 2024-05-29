import {
  IconAperture,
  IconUmbrella,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconHeartHandshake,
  IconFriends,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    id: uniqueId(),
    title: "Your Channel",
    icon: IconUmbrella,
    href: "/channel",
  },
  {
    navlabel: true,
    subheader: "Frens",
  },
  {
    id: uniqueId(),
    title: "Subscriptions",
    icon: IconHeartHandshake,
    href: "/subs",
  },
  {
    id: uniqueId(),
    title: "Stakes",
    icon: IconFriends,
    href: "/stakes",
  },
  {
    navlabel: true,
    subheader: "idk",
  },
  {
    id: uniqueId(),
    title: "Ai Fren",
    icon: IconMoodHappy,
    href: "/ai",
  },
];

export default Menuitems;
