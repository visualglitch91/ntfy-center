import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  CssBaseline,
  Typography,
  Grid,
  ThemeProvider,
  Stack,
} from "@mui/material";
import theme from "./theme";
import { requestToken } from "./firebase";
import useNotifications from "./useNotifications";
import Layout from "./Layout";
import Sidebar from "./Sidebar";
import NotificationCard from "./NotificationCard";
import GlossyPaper from "./GlossyPaper";

export default function App() {
  const $notifications = useNotifications();
  const refetchRef = useRef($notifications.refetch);
  const [token, setToken] = useState<null | false | string>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const setupFCM = async () => {
    const token = await requestToken();
    setToken(token);

    if (token) {
      await axios.post("/api/devices/register", { token });
      console.log("FCM ready with token", token);
    } else {
      console.log("FCM setup failed");
    }
  };

  useEffect(() => {
    setupFCM();

    const refetch = () => refetchRef.current();
    window.addEventListener("focus", refetch);
    document.addEventListener("visibilitychange", refetch);

    return () => {
      window.removeEventListener("focus", refetch);
      document.removeEventListener("visibilitychange", refetch);
    };
  }, []);

  const notificationsCards =
    $notifications.data
      ?.reverse()
      .map((notification) => {
        if (selectedTopic && notification.topic !== selectedTopic) {
          return false;
        }

        return (
          <Grid item xs={12} md={6} key={notification.id}>
            <NotificationCard
              notification={notification}
              onDelete={() => {
                $notifications.deleteNotification(notification.id);
              }}
            />
          </Grid>
        );
      })
      .filter(Boolean) || [];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout
        selectedTopic={selectedTopic}
        sidebar={
          <Sidebar
            token={token}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
          />
        }
      >
        <Stack gap={3}>
          {notificationsCards.length > 0 ? (
            notificationsCards
          ) : (
            <GlossyPaper px={3} py={4}>
              <Typography align="center">
                {selectedTopic
                  ? "No notifications found for this topic"
                  : "No notifications yet"}
              </Typography>
            </GlossyPaper>
          )}
        </Stack>
      </Layout>
    </ThemeProvider>
  );
}
