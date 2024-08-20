import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { uniq, without } from "lodash-es";
import {
  AppBar,
  CssBaseline,
  Card,
  CardContent,
  CardHeader,
  Toolbar,
  Typography,
  Grid,
  Container,
  Drawer,
  List,
  ListItemText,
  IconButton,
  Divider,
  ListItemButton,
  ThemeProvider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import theme from "./theme";
import { initializeFCM } from "./firebase";
import useKnwonTopics from "./useKnwonTopics";
import useDeviceTopics from "./useDeviceTopics";
import useNotifications from "./useNotifications";

export default function App() {
  const $notifications = useNotifications();
  const fetchNextRef = useRef($notifications.fetchNextPage);
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  useEffect(() => {
    const fetchNext = () => fetchNextRef.current();

    window.addEventListener("focus", fetchNext);
    document.addEventListener("visibilitychange", fetchNext);

    initializeFCM({
      onNotification: (notification) => {
        new window.Notification(
          [notification.topic, notification.title].filter(Boolean).join(": "),
          { body: notification.body }
        );

        fetchNextRef.current();
      },
    }).then(async (token) => {
      await axios.post("/api/devices/register", { token });
      setToken(token);
    });

    return () => {
      window.removeEventListener("focus", fetchNext);
      document.removeEventListener("visibilitychange", fetchNext);
    };
  }, []);

  const $knwonTopics = useKnwonTopics();
  const $deviceTopics = useDeviceTopics(token);

  const knwonTopics = $knwonTopics.data || [];
  const deviceTopics = $deviceTopics.data || [];

  const notificationsCards =
    $notifications.data?.pages
      .flat()
      .reverse()
      .map((notification) => {
        if (selectedTopic && notification.topic !== selectedTopic) {
          return false;
        }

        return (
          <Grid item xs={12} md={6} key={notification.id}>
            <Card
              variant="outlined"
              sx={{ backgroundColor: "#44475a", borderColor: "#6272a4" }}
            >
              <CardHeader
                title={notification.title}
                subheader={notification.topic}
                sx={{ backgroundColor: "#6272a4", color: "#f8f8f2" }}
              />
              <CardContent>
                <Typography variant="body2" color="#f8f8f2">
                  {notification.body}
                </Typography>
                <Typography variant="caption" color="#f8f8f2">
                  {new Date(Number(notification.timestamp)).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })
      .filter(Boolean) || [];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(true)}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Notifications</Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 250, backgroundColor: "#44475a" }}>
          <Typography variant="h6" sx={{ p: 2, color: "#f8f8f2" }}>
            Topics
          </Typography>
          <Divider />
          <ListItemButton
            onClick={() => {
              setSelectedTopic("");
              setOpen(false);
            }}
            sx={{ color: "#f8f8f2" }}
          >
            <ListItemText primary="All Topics" />
          </ListItemButton>
          {knwonTopics.map((topic) => {
            const isDeviceTopic = deviceTopics.includes(topic);

            return (
              <ListItemButton
                key={topic}
                onClick={() => {
                  setSelectedTopic(topic);
                  setOpen(false);
                }}
                sx={{ color: "#f8f8f2" }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();

                          axios
                            .post(
                              isDeviceTopic
                                ? `/api/devices/topics/${topic}/unsubscribe`
                                : `/api/devices/topics/${topic}/subscribe`,
                              { token }
                            )
                            .then(() => $deviceTopics.refetch());
                        }}
                        sx={{
                          color: isDeviceTopic ? "#50fa7b" : "#ff5555",
                          mr: 1,
                        }}
                      >
                        {isDeviceTopic ? (
                          <NotificationsIcon />
                        ) : (
                          <NotificationsOffIcon />
                        )}
                      </IconButton>
                      {topic}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
      <Container sx={{ py: 3 }}>
        <Grid container spacing={2}>
          {notificationsCards.length > 0 ? (
            notificationsCards
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" color="#f8f8f2" align="center">
                No notifications found for this topic.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
