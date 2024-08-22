import axios from "axios";
import { useRef } from "react";
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Notification } from "../common/types";

const queryKey = ["notifications"];

export default function useNotifications() {
  const nextIdRef = useRef(0);
  const queryClient = useQueryClient();

  const $query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => {
      return axios
        .get<Notification[]>(`/api/notifications?since=${pageParam}`)
        .then((res) => {
          if (res.data.length) {
            nextIdRef.current = Math.max(
              ...res.data.map((it) => Number(it.id))
            );
          }

          return res.data;
        });
    },
    initialPageParam: 0,
    getNextPageParam: () => nextIdRef.current,
  });

  const deleteNotification = (id: string) => {
    queryClient.setQueryData<InfiniteData<Notification[]>>(
      queryKey,
      (data) => ({
        pages:
          data?.pages.map((page) => page.filter((it) => it.id !== id)) ?? [],
        pageParams: data?.pageParams ?? [],
      })
    );

    axios.delete(`/api/notifications/${id}`);
  };

  return {
    ...$query,
    deleteNotification,
  };
}
