import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Notification } from "../common/types";

const queryKey = ["notifications"];

export default function useNotifications() {
  const queryClient = useQueryClient();

  const $query = useQuery({
    queryKey,
    queryFn: () =>
      axios
        .get<Notification[]>(`/api/notifications?since=0`)
        .then((res) => res.data),
  });

  const deleteNotification = (id: string) => {
    queryClient.setQueryData<Notification[]>(
      queryKey,
      (data) => data?.filter((it) => it.id !== id) ?? []
    );

    axios.delete(`/api/notifications/${id}`);
  };

  const deleteAllNotifications = () => {
    queryClient.setQueryData<Notification[]>(queryKey, (data) => []);
    axios.delete(`/api/notifications/all`);
  };

  return {
    ...$query,
    deleteNotification,
    deleteAllNotifications,
  };
}
