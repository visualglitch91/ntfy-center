import axios from "axios";
import { useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Notification } from "../common/types";

export default function useNotifications() {
  const nextIdRef = useRef(0);

  return useInfiniteQuery({
    queryKey: ["notifications"],
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
}
