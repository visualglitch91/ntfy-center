import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function useDeviceTopics(token: string | null | false) {
  return useQuery({
    queryKey: ["deviceTopics"],
    queryFn: () => {
      return axios
        .post<string[]>("/api/devices/topics/list", { token })
        .then((res) => res.data);
    },
    enabled: Boolean(token),
    refetchOnWindowFocus: true,
  });
}
