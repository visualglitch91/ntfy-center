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
import initializeFCM, { BROADCAST_CHANNEL_KEY } from "./initializeFCM";
import useNotifications from "./useNotifications";
import Layout from "./Layout";
import Sidebar from "./Sidebar";
import NotificationCard from "./NotificationCard";
import GlossyPaper from "./GlossyPaper";
import { useQueryClient } from "@tanstack/react-query";

export default function App() {
  const queryClient = useQueryClient();
  const $notifications = useNotifications();
  const [token, setToken] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    initializeFCM().then(
      (token) => {
        setToken(token);
        axios.post("/api/devices/register", { token });
        console.log("FCM ready with token", token);
      },
      () => {
        console.log("FCM setup failed");
      }
    );

    const fcmChannel = new BroadcastChannel(BROADCAST_CHANNEL_KEY);

    const onMessage = ({ data: payload }: any) => {
      if (
        payload.type === "FOREGROUND_MESSAGE" ||
        payload.type === "BACKGROUND_MESSAGE"
      ) {
        queryClient.refetchQueries();
      }
    };

    fcmChannel.addEventListener("message", onMessage);

    return () => {
      fcmChannel.removeEventListener("message", onMessage);
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

  if (!token) {
    return null;
  }

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
