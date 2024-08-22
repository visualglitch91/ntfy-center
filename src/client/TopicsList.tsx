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
  alpha,
  Badge,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOffOutlined";
import useKnwonTopics from "./useKnwonTopics";
import useDeviceTopics from "./useDeviceTopics";
import useNotificationCount from "./useNotificationCount";
import LabelWithCount from "./LabelWithCount";

const ListItemButton = styled((props: ListItemProps) => (
  <ListItem component={ButtonBase} {...props} />
))<{ isSelected: boolean }>(({ theme, isSelected }) =>
  isSelected
    ? {
        "&, &:focus": {
          background: alpha(darken(theme.palette.background.paper, 0.2), 0.3),
        },
        "&:hover": {
          background: alpha(darken(theme.palette.background.paper, 0.25), 0.3),
        },
      }
    : {
        "&:hover": {
          background: alpha(darken(theme.palette.background.paper, 0.1), 0.3),
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
  const count = useNotificationCount();

  const knwonTopics = $knwonTopics.data || [];
  const deviceTopics = $deviceTopics.data || [];

  return (
    <List>
      <ListItemButton
        divider
        isSelected={selectedTopic === null}
        onClick={() => setSelectedTopic(null)}
      >
        <ListItemText
          primary={
            <LabelWithCount label="All Topics" count={count.allTopics || 0} />
          }
        />
      </ListItemButton>
      {knwonTopics.map((topic, index, list) => {
        const isSelectedTopic = topic === selectedTopic;
        const isDeviceTopic = deviceTopics.includes(topic);

        return (
          <ListItemButton
            divider={index < list.length - 1}
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
          </ListItemButton>
        );
      })}
    </List>
  );
}
