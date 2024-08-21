import axios from "axios";
import {
  List,
  ListItemText,
  IconButton,
  Divider,
  ListItem,
  darken,
  styled,
  ListItemProps,
  ButtonBase,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOffOutlined";
import useKnwonTopics from "./useKnwonTopics";
import useDeviceTopics from "./useDeviceTopics";

const ListItemButton = styled((props: ListItemProps) => (
  <ListItem component={ButtonBase} {...props} />
))<{ isSelected: boolean }>(({ theme, isSelected }) =>
  isSelected
    ? {
        "&, &:focus": {
          background: darken(theme.palette.background.paper, 0.2),
        },
        "&:hover": {
          background: darken(theme.palette.background.paper, 0.25),
        },
      }
    : {
        "&:hover": {
          background: darken(theme.palette.background.paper, 0.1),
        },
      }
);

export default function TopicsList({
  token,
  selectedTopic,
  setSelectedTopic,
}: {
  token: string;
  selectedTopic: string | null;
  setSelectedTopic: (value: string | null) => void;
}) {
  const $knwonTopics = useKnwonTopics();
  const $deviceTopics = useDeviceTopics(token);

  const knwonTopics = $knwonTopics.data || [];
  const deviceTopics = $deviceTopics.data || [];

  return (
    <List>
      <ListItemButton
        isSelected={selectedTopic === null}
        onClick={() => setSelectedTopic(null)}
      >
        <ListItemText primary="All Topics" />
      </ListItemButton>
      <Divider />
      {knwonTopics.map((topic) => {
        const isSelectedTopic = topic === selectedTopic;
        const isDeviceTopic = deviceTopics.includes(topic);

        return (
          <ListItemButton
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
            <ListItemText primary={topic} />
          </ListItemButton>
        );
      })}
    </List>
  );
}
