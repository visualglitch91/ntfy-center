import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Notification } from "../common/types";

export default function NotificationCard({
  notification,
  onDelete,
}: {
  notification: Notification;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardHeader
        sx={{
          pb: 0,
          "& .MuiCardHeader-content": {
            display: "flex",
            flexDirection: "column-reverse",
          },
        }}
        action={
          <IconButton onClick={onDelete}>
            <CloseIcon />
          </IconButton>
        }
        title={notification.title}
        subheader={`${notification.topic} - ${new Date(
          Number(notification.timestamp)
        ).toLocaleString()}`}
      />
      <CardContent sx={{ pt: 0.5 }}>
        <Typography variant="body2">{notification.body}</Typography>
      </CardContent>
    </Card>
  );
}
