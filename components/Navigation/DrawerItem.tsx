import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Collapse from "@mui/material/Collapse";
import { SvgIconTypeMap } from "@mui/material/SvgIcon";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Theme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import data from "./data";
import { useRouter } from "next/router";
import { getLocalStorage, setLocalStorage } from "@sonamusica-fe/utils/BrowserUtil";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { merge } from "lodash";
import HomeIcon from "@mui/icons-material/Home";

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
      ({ text, icon: Icon, url, permission, subMenu }, innerIdx) => {
        if (subMenu) {
          const subMenuItem = subMenu.map(
            (
              {
                text: subMenuText,
                icon: subMenuIcon,
                url: subMenuUrl,
                permission: subMenuPermission
              },
              subMenuIdx
            ) => {
              return (
                <SingleLevel
                  key={`sidebar-item-submenu-${subMenuIdx}`}
                  text={subMenuText}
                  parentText={text}
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
              hidden={!permission(user?.privilegeType)}
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
            testIdContext={text.replaceAll(" ", "")}
            url={url}
            disabled={isLoading}
            hidden={!permission(user?.privilegeType)}
          />
        );
      }
    );

    if (section.items.length > 0) {
      // 1 container for 1 menu
      return (
        <Container
          disabled={
            typeof section.permission === "function"
              ? !section.permission(user?.privilegeType)
              : !section.permission
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
        <SingleLevel
          testIdContext={section.name.replaceAll(" ", "")}
          key={`sidebar-section-${idx}`}
          text={section.name}
          icon={section.icon || HomeIcon}
          url={section.url}
          disabled={isLoading}
          hidden={
            (typeof section.permission === "function" &&
              !section.permission(user?.privilegeType)) ||
            section.permission === false
          }
        />
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
                : { display: "inline-block", height: "3px", width: "100%", px: 0 }
            }
            component="span"
          >
            {drawerOpen ? text : <Divider />}
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
  testIdContext
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
          { transition: "none", flex: 0 },
          router.route === url ? styles.active : styles.item,
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
