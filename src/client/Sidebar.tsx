import axios from "axios";
import { List, ListItemText, IconButton, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOffOutlined";
import useKnwonTopics from "./useKnwonTopics";
import useDeviceTopics from "./useDeviceTopics";
import useNotificationCount from "./useNotificationCount";
import LabelWithCount from "./LabelWithCount";
import SidebarItem from "./SidebarItem";
import fullReload from "./fullReload";

export default function Sidebar({
  token,
  selectedTopic,
  setSelectedTopic,
}: {
  token: string | null | false;
  selectedTopic: string | null;
  setSelectedTopic: (value: string | null) => void;
}) {
  const $knwonTopics = useKnwonTopics();
  const $deviceTopics = useDeviceTopics(token);
  const count = useNotificationCount();

  const knwonTopics = $knwonTopics.data || [];
  const deviceTopics = $deviceTopics.data || [];

  return (
    <List>
      <SidebarItem
        divider
        isSelected={selectedTopic === null}
        onClick={() => setSelectedTopic(null)}
      >
        <ListItemText
          primary={
            <LabelWithCount label="All Topics" count={count.allTopics || 0} />
          }
        />
      </SidebarItem>
      {knwonTopics.map((topic) => {
        const isSelectedTopic = topic === selectedTopic;
        const isDeviceTopic = deviceTopics.includes(topic);

        return (
          <SidebarItem
            divider
            key={topic}
            isSelected={isSelectedTopic}
            onClick={() => setSelectedTopic(topic)}
            secondaryAction={
              <IconButton
                edge="end"
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
              >
                {isDeviceTopic ? (
                  <NotificationsIcon />
                ) : (
                  <NotificationsOffIcon />
                )}
              </IconButton>
            }
          >
            <ListItemText
              primary={
                <LabelWithCount
                  label={
                    <Box
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                    >
                      {topic}
                    </Box>
                  }
                  count={count[topic] || 0}
                />
              }
            />
          </SidebarItem>
        );
      })}
      <SidebarItem onClick={() => fullReload()}>
        <ListItemText primary="Full Reload" />
      </SidebarItem>
    </List>
  );
}
