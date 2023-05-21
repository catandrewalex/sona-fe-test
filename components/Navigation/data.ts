import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
import { UserType } from "@sonamusica-fe/types";
import GroupIcon from "@mui/icons-material/Group";
import LockIcon from "@mui/icons-material/Lock";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import PublicIcon from "@mui/icons-material/Public";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarToday from "@mui/icons-material/CalendarToday";
import SettingsRemote from "@mui/icons-material/SettingsRemote";
import Settings from "@mui/icons-material/Settings";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import HomeIcon from "@mui/icons-material/Home";
import ApiIcon from "@mui/icons-material/Api";
import AdbIcon from "@mui/icons-material/Adb";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import AddchartIcon from "@mui/icons-material/Addchart";
import EditNotificationsIcon from "@mui/icons-material/EditNotifications";
import { People, Hail } from "@mui/icons-material";

export type SidebarItem = {
  text: string;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, never>, "svg">>;
  url?: string;
  permission: (userType?: UserType) => boolean;
  subMenu?: SidebarItem[];
};

export type SidebarSection = {
  name: string;
  items: Array<SidebarItem>;
  permission: ((userType?: UserType) => boolean) | boolean;
  icon?: OverridableComponent<SvgIconTypeMap<Record<string, never>, "svg">>;
  url?: string;
};

const data: Array<SidebarSection> = [
  {
    name: "Home",
    items: [],
    icon: HomeIcon,
    url: "/",
    permission: true
  },
  {
    name: "CRUD",
    permission: (userType?: UserType): boolean => {
      return userType === UserType.ADMIN;
    },
    items: [
      {
        icon: People,
        text: "User",
        url: "/user",
        permission: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: Hail,
        text: "Teacher",
        url: "/teacher",
        permission: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Student",
        url: "/student",
        permission: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Instrument",
        url: "/instrument",
        permission: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      }
    ]
  }
];

export default data;
