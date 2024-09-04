import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import GlossyPaper from "./GlossyPaper";
import useNotificationCount from "./useNotificationCount";
import StaticBadge from "./StaticBadge";

export default function Layout({
  selectedTopic,
  sidebar,
  children,
  onClearAll,
}: {
  selectedTopic: string | null;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  onClearAll: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const drawerWidth = Math.min(290, window.innerWidth - 30);

  const notificationCount =
    useNotificationCount()[selectedTopic || "allTopics"];

  const documentTitle = `${notificationCount ? `(${notificationCount}) ` : ""}${
    selectedTopic ? `NtfyCenter | ${selectedTopic}` : "NtfyCenter"
  }`;

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  useEffect(() => {
    document.title = documentTitle;
    setMobileOpen(false);
  }, [documentTitle]);

  return (
    <Box
      p={3}
      gap={3}
      mx="auto"
      display="flex"
      maxWidth={1280}
      flexDirection="column"
    >
      <AppBar
        position="static"
        component={GlossyPaper}
        sx={(theme) => ({
          [theme.breakpoints.down("md")]: {
            position: "sticky",
            mt: -3,
            mx: -3,
            top: 0,
            left: 0,
            width: "100vw",
            borderRadius: "0 !important",
            zIndex: 2,
          },
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            display={{ xs: "flex", md: "none", overflow: "hidden" }}
            alignItems="center"
            gap={1}
            sx={{ flex: 1 }}
          >
            <Typography
              variant="h6"
              component="div"
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
            >
              {selectedTopic || "All Topics"}
            </Typography>
            <StaticBadge count={notificationCount || 0} />
          </Box>
          <Typography
            display={{ xs: "none", md: "initial" }}
            variant="h6"
            noWrap
            component="div"
            sx={{ flex: 1 }}
          >
            NtfyCenter
          </Typography>
          <IconButton color="inherit" onClick={onClearAll}>
            <ClearAllIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          component: GlossyPaper,
          sx: { borderRadius: "0 !important" },
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {sidebar}
      </Drawer>
      <Box display="flex" gap={3}>
        <Box
          component="nav"
          zIndex={1}
          width={{ sm: drawerWidth }}
          display={{ xs: "none", md: "block" }}
          flexShrink={{ sm: 0 }}
        >
          <GlossyPaper py={0.7} width={drawerWidth}>
            {sidebar}
          </GlossyPaper>
        </Box>
        <Box component="main" flexGrow={1}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
