import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
import { UserType } from "@sonamusica-fe/types";
import HomeIcon from "@mui/icons-material/Home";
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
