import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  CssBaseline,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  ThemeProvider,
  Container,
  Stack,
} from "@mui/material";
import theme from "./theme";
import { initializeFCM } from "./firebase";
import useNotifications from "./useNotifications";
import Layout from "./Layout";
import TopicsList from "./TopicsList";

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
      <Layout
        title={selectedTopic ? `NtfyCenter - ${selectedTopic}` : "NtfyCenter"}
        sidebar={
          <TopicsList
            token={token}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
          />
        }
      >
        <Stack sx={{ py: 2, mx: "auto", maxWidth: 700 }} gap={3}>
          {notificationsCards.length > 0 ? (
            notificationsCards
          ) : (
            <Typography align="center">
              {selectedTopic
                ? "No notifications found for this topic."
                : "No notifications yet."}
            </Typography>
          )}
        </Stack>
      </Layout>
    </ThemeProvider>
  );
}
