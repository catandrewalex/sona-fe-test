import { SvgIconTypeMap } from "@mui/material";
import { UserType } from "@sonamusica-fe/types";
import HomeIcon from "@mui/icons-material/Home";
import {
  Face,
  FaceRetouchingNatural,
  Groups,
  LocalAtm,
  Man,
  Payment,
  PeopleAlt,
  Person,
  Piano,
  RequestQuote,
  Savings,
  School,
  TrendingUp
} from "@mui/icons-material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export type SidebarItem = {
  text: string;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, never>, "svg">>;
  url?: string;
  userHasAccess: (userType?: UserType) => boolean;
  subMenu?: SidebarItem[];
  useSubstringStartsWithForMarkSelected?: boolean;
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
    userHasAccess: (userType?: UserType): boolean => {
      return (userType ?? UserType.ANONYMOUS) >= UserType.STAFF;
    },
    items: [
      {
        icon: Payment,
        text: "Enrollment Payment",
        url: "/payment",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.STAFF;
        },
        useSubstringStartsWithForMarkSelected: true
      },
      {
        icon: PeopleAlt,
        text: "Attendance",
        url: "/attendance",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.STAFF;
        },
        useSubstringStartsWithForMarkSelected: true
      },
      {
        icon: RequestQuote,
        text: "Teacher Payment",
        url: "/teacher-payment",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.STAFF;
        },
        useSubstringStartsWithForMarkSelected: true
      }
    ]
  },
  {
    name: "Dashboard",
    items: [
      {
        icon: LocalAtm,
        text: "Expense",
        url: "/dashboard/expense",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.ADMIN;
        }
      },
      {
        icon: Savings,
        text: "Income",
        url: "/dashboard/income",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.ADMIN;
        }
      }
    ],
    userHasAccess: (userType?: UserType): boolean => {
      return (userType ?? UserType.ANONYMOUS) >= UserType.ADMIN;
    }
  },
  {
    name: "CRUD",
    userHasAccess: (userType?: UserType): boolean => {
      return (userType ?? UserType.ANONYMOUS) >= UserType.ADMIN;
    },
    items: [
      {
        icon: Person,
        text: "User",
        url: "/admin/user",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.ADMIN;
        }
      },
      {
        icon: FaceRetouchingNatural,
        text: "Teacher",
        url: "/admin/teacher",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.ADMIN;
        }
      },
      {
        icon: Face,
        text: "Student",
        url: "/admin/student",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.ADMIN;
        }
      },
      {
        icon: Piano,
        text: "Instrument",
        url: "/admin/instrument",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.ADMIN;
        }
      },
      {
        icon: TrendingUp,
        text: "Grade",
        url: "/admin/grade",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.ADMIN;
        }
      },
      {
        icon: School,
        text: "Course",
        url: "/admin/course",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.ADMIN;
        }
      },
      {
        icon: Groups,
        text: "Class",
        url: "/admin/class",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.ADMIN;
        }
      },
      {
        icon: Man,
        text: "Teacher Special Fee",
        url: "/admin/teacher-special-fee",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.ADMIN;
        }
      },
      {
        icon: Savings,
        text: "Student Learning Token",
        url: "/admin/student-learning-token",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.SUPER_ADMIN;
        }
      },
      {
        icon: Payment,
        text: "Enrollment Payment",
        url: "/admin/enrollment-payment",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.SUPER_ADMIN;
        }
      },
      {
        icon: PeopleAlt,
        text: "Attendance",
        url: "/admin/attendance",
        userHasAccess: (userType?: UserType): boolean => {
          return (userType ?? UserType.ANONYMOUS) >= UserType.SUPER_ADMIN;
        }
      }
    ]
  }
];

export default data;
