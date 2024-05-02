import { SvgIconTypeMap } from "@mui/material";
import { UserType } from "@sonamusica-fe/types";
import HomeIcon from "@mui/icons-material/Home";
import { People, Hail } from "@mui/icons-material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export type SidebarItem = {
  text: string;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, never>, "svg">>;
  url?: string;
  userHasAccess: (userType?: UserType) => boolean;
  subMenu?: SidebarItem[];
  useSubstringIncludeForMarkSelected?: boolean;
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
    name: "Management",
    items: [
      {
        icon: People,
        text: "Enrollment Payment",
        url: "/payment",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Attendance",
        url: "/attendance",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        },
        useSubstringIncludeForMarkSelected: true
      },
      {
        icon: People,
        text: "Teacher Payment",
        url: "/teacher-payment",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        },
        useSubstringIncludeForMarkSelected: true
      }
    ],
    userHasAccess: (userType?: UserType): boolean => {
      return userType === UserType.ADMIN || userType === UserType.STAFF;
    }
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
        url: "/admin/user",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: Hail,
        text: "Teacher",
        url: "/admin/teacher",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Student",
        url: "/admin/student",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Instrument",
        url: "/admin/instrument",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Grade",
        url: "/admin/grade",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Course",
        url: "/admin/course",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Class",
        url: "/admin/class",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Teacher Special Fee",
        url: "/admin/teacher-special-fee",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Student Learning Token",
        url: "/admin/student-learning-token",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Enrollment Payment",
        url: "/admin/enrollment-payment",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      },
      {
        icon: People,
        text: "Attendance",
        url: "/admin/attendance",
        userHasAccess: (userType?: UserType): boolean => {
          return userType === UserType.ADMIN;
        }
      }
    ]
  }
];

export default data;
