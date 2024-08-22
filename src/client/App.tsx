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
import { initializeFCM } from "./firebase";
import useNotifications from "./useNotifications";
import Layout from "./Layout";
import TopicsList from "./TopicsList";
import NotificationCard from "./NotificationCard";
import GlossyPaper from "./GlossyPaper";

export default function App() {
  const $notifications = useNotifications();
  const fetchNextRef = useRef($notifications.fetchNextPage);
  const [token, setToken] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

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
          <TopicsList
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
