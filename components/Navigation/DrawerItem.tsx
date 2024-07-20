import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useEffect, useState } from "react";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import data from "./data";
import { useRouter } from "next/router";
import { getLocalStorage, setLocalStorage } from "@sonamusica-fe/utils/BrowserUtil";
import { merge } from "lodash";
import HomeIcon from "@mui/icons-material/Home";

import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SvgIconTypeMap,
  Theme,
  Tooltip,
  Typography
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type DrawerItemContainerProps = {
  children: React.ReactNode;
  text: string;
  divider?: boolean;
  disabled?: boolean;
};

type DrawerItemSingleLevelProps = {
  children?: React.ReactNode;
  text: string;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, never>, "svg">>;
  url?: string;
  disabled?: boolean;
  inset?: boolean;
  parentText?: string;
  hidden?: boolean;
  testIdContext: string;
  useSubstringStartsWithForMarkSelected?: boolean;
};

type DrawerItemMultiLevelProps = {
  children: React.ReactNode;
  disabled?: boolean;
  text: string;
  hidden?: boolean;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, never>, "svg">>;
  testIdContext: string;
};

const styles = {
  item: {
    "&:hover, &:hover div.MuiBox-root": {
      backgroundColor: (theme: Theme) => theme.palette.primary.main,
      color: "white"
    }
  },
  active: {
    color: "primary.main"
  }
};

const DrawerItem = (): JSX.Element => {
  const { drawerOpen, isLoading } = useApp((state) => ({
    drawerOpen: state.drawerOpen,
    isLoading: state.isLoading
  }));
  const { user } = useUser();

  const lists = data.map((section, idx) => {
    const innerItem = section.items.map(
      (
        { text, useSubstringStartsWithForMarkSelected, icon: Icon, url, userHasAccess, subMenu },
        innerIdx
      ) => {
        if (subMenu) {
          const subMenuItem = subMenu.map(
            (
              {
                text: subMenuText,
                icon: subMenuIcon,
                url: subMenuUrl,
                userHasAccess: subMenuPermission
              },
              subMenuIdx
            ) => {
              return (
                <SingleLevel
                  key={`sidebar-item-submenu-${subMenuIdx}`}
                  text={subMenuText}
                  parentText={text}
                  useSubstringStartsWithForMarkSelected={useSubstringStartsWithForMarkSelected}
                  icon={subMenuIcon}
                  url={subMenuUrl}
                  inset={drawerOpen}
                  testIdContext={`${text.replaceAll(" ", "")}-${subMenuText.replaceAll(" ", "")}`}
                  hidden={!subMenuPermission(user?.privilegeType)}
                  disabled={isLoading}
                />
              );
            }
          );

          return (
            <MultiLevel
              key={`sidebar-item-${innerIdx}`}
              disabled={isLoading}
              hidden={!userHasAccess(user?.privilegeType)}
              icon={Icon}
              testIdContext={text.replaceAll(" ", "")}
              text={text}
            >
              {subMenuItem}
            </MultiLevel>
          );
        }

        return (
          <SingleLevel
            key={`sidebar-item-${innerIdx}`}
            text={text}
            icon={Icon}
            useSubstringStartsWithForMarkSelected={useSubstringStartsWithForMarkSelected}
            testIdContext={text.replaceAll(" ", "")}
            url={url}
            disabled={isLoading}
            hidden={!userHasAccess(user?.privilegeType)}
          />
        );
      }
    );

    if (section.items.length > 0) {
      // 1 container for 1 menu
      return (
        <Container
          disabled={
            typeof section.userHasAccess === "function"
              ? !section.userHasAccess(user?.privilegeType)
              : !section.userHasAccess
          }
          key={`sidebar-item-section-${idx}`}
          text={section.name}
          divider={data[idx + 1] !== undefined}
        >
          {innerItem}
        </Container>
      );
    } else {
      return (
        <Box>
          <SingleLevel
            testIdContext={section.name.replaceAll(" ", "")}
            key={`sidebar-section-${idx}`}
            text={section.name}
            icon={section.icon || HomeIcon}
            url={section.url}
            disabled={isLoading}
            hidden={
              (typeof section.userHasAccess === "function" &&
                !section.userHasAccess(user?.privilegeType)) ||
              section.userHasAccess === false
            }
          />
          <Divider />
        </Box>
      );
    }
  });
  return <>{lists}</>;
};

const Container = ({ children, text, divider }: DrawerItemContainerProps) => {
  const drawerOpen = useApp((state) => state.drawerOpen);

  return (
    <>
      <List
        subheader={
          <ListSubheader
            disableSticky
            sx={
              drawerOpen
                ? undefined
                : {
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    px: 0.5,
                    height: "32px"
                  }
            }
            component="div"
          >
            <Box
              component={"span"}
              sx={
                drawerOpen
                  ? undefined
                  : {
                      display: "inline-block",
                      width: "50px",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                      fontSize: "12px",
                      overflow: "hidden"
                    }
              }
            >
              {text}
            </Box>
          </ListSubheader>
        }
      >
        {children}
      </List>
      {divider && <Divider />}
    </>
  );
};

const SingleLevel = ({
  parentText,
  text,
  icon: Icon,
  url,
  disabled,
  inset,
  hidden,
  testIdContext,
  useSubstringStartsWithForMarkSelected
}: DrawerItemSingleLevelProps) => {
  const { drawerOpen, startLoading } = useApp((state) => ({
    startLoading: state.startLoading,
    drawerOpen: state.drawerOpen
  }));
  const router = useRouter();
  const menuHandler = async (url?: string) => {
    if (url && url !== router.route) {
      startLoading();
      router.push(url, undefined, { shallow: true });
    }
  };

  return (
    <Tooltip
      title={
        !drawerOpen ? (
          <Typography variant="subtitle2">
            {parentText ? parentText + " - " : ""}
            {text}
          </Typography>
        ) : (
          ""
        )
      }
      arrow
      placement="right"
    >
      <ListItemButton
        onClick={() => menuHandler(url)}
        key={text}
        data-testid={`Sidebar-Item-${testIdContext}`}
        disabled={disabled}
        className={hidden ? "hide" : ""}
        sx={merge(
          { transition: "none", flex: 0, py: 0.7 },
          (useSubstringStartsWithForMarkSelected === true && router.route.startsWith(url ?? "")) ||
            router.route === url
            ? styles.active
            : styles.item,
          inset ? { pl: 4 } : {}
        )}
      >
        <ListItemIcon sx={router.route === url ? styles.active : styles.item}>
          <Box>
            <Icon />
          </Box>
        </ListItemIcon>
        {drawerOpen && (
          <>
            <ListItemText sx={{ whiteSpace: "normal" }} primary={text} />
          </>
        )}
      </ListItemButton>
    </Tooltip>
  );
};

const MultiLevel = ({
  icon: Icon,
  text,
  children,
  disabled,
  hidden,
  testIdContext
}: DrawerItemMultiLevelProps) => {
  const drawerOpen = useApp((state) => state.drawerOpen);
  const initialOpen = getLocalStorage("sidebar-" + text);
  const [open, setOpen] = useState(initialOpen === "true" ? true : false);

  const toggleMenu = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setLocalStorage("sidebar-" + text, open + "");
  }, [open]);

  return (
    <>
      <Tooltip
        title={
          !drawerOpen ? <Typography variant="subtitle2">{text} (click to toogle)</Typography> : ""
        }
        arrow
        placement="right"
      >
        <ListItemButton
          data-testid={`Sidebar-Parent-${testIdContext}`}
          disabled={disabled}
          className={hidden ? "hide" : ""}
          onClick={toggleMenu}
        >
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          {drawerOpen && (
            <>
              <ListItemText sx={{ whiteSpace: "normal" }} primary={text} />
            </>
          )}
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
      </Tooltip>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children}
        </List>
      </Collapse>
    </>
  );
};

export default DrawerItem;
