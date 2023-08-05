import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
import { UserType } from "@sonamusica-fe/types";
import HomeIcon from "@mui/icons-material/Home";
import { People, Hail } from "@mui/icons-material";

export type SidebarItem = {
  text: string;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, never>, "svg">>;
  url?: string;
  userHasAccess: (userType?: UserType) => boolean;
  subMenu?: SidebarItem[];
};

export type SidebarSection = {
  name: string;
  items: Array<SidebarItem>;
  userHasAccess: ((userType?: UserType) => boolean) | boolean;
  icon?: OverridableComponent<SvgIconTypeMap<Record<string, never>, "svg">>;
  url?: string;
};

const data: Array<SidebarSection> = [
  {
    name: "Home",
    items: [],
    icon: HomeIcon,
    url: "/",
    userHasAccess: true
  },
  {
    name: "CRUD",
    userHasAccess: (userType?: UserType): boolean => {
      return userType === UserType.ADMIN;
    },
    items: [
      {
        icon: People,
        text: "User",
        url: "/user",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: Hail,
        text: "Teacher",
        url: "/teacher",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Student",
        url: "/student",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Instrument",
        url: "/instrument",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Grade",
        url: "/grade",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Course",
        url: "/course",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Class",
        url: "/class",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Teacher Special Fee",
        url: "/teacher-special-fee",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      }
    ]
  }
];

export default data;
