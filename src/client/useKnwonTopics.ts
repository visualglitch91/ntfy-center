import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function useKnwonTopics() {
  return useQuery({
    queryKey: ["knownTopics"],
    queryFn: () => axios.get<string[]>("/api/topics").then((res) => res.data),
  });
}
