import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function useDeviceTopics(token: string) {
  return useQuery({
    queryKey: ["deviceTopics"],
    queryFn: () => {
      return axios
        .post<string[]>("/api/devices/topics/list", { token })
        .then((res) => res.data);
    },
  });
}
