import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Notification } from "../common/types";
import GlossyPaper from "./GlossyPaper";

function formatDateShort(timestamp: string | number) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(Number(timestamp)));
}

export default function NotificationCard({
  notification,
  onDelete,
}: {
  notification: Notification;
  onDelete: () => void;
}) {
  return (
    <Card component={GlossyPaper}>
      <CardHeader
        sx={{
          pb: 0,
          "& .MuiCardHeader-avatar": {
            mr: 1,
          },
          "& .MuiCardHeader-title": {
            fontSize: 18,
            fontWeight: 600,
          },
          "& .MuiCardHeader-content": {
            display: "flex",
            flexDirection: "column",
          },
        }}
        avatar={
          notification.icon && (
            <img style={{ width: 40, height: 40 }} src={notification.icon} />
          )
        }
        action={
          <IconButton onClick={onDelete}>
            <CloseIcon />
          </IconButton>
        }
        title={notification.title}
        subheader={notification.topic}
      />
      <CardContent sx={{ pt: 0.5, pb: "16px !important" }}>
        <Typography variant="body2">{notification.body}</Typography>
        <Typography variant="caption">
          {formatDateShort(notification.timestamp)}
        </Typography>
      </CardContent>
    </Card>
  );
}
