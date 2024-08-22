import useNotifications from "./useNotifications";

export default function useNotificationCount() {
  const $notifications = useNotifications();
  const notifications = $notifications.data?.pages.flat().reverse() || [];

  return notifications.reduce(
    (acc, { topic }) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    },
    { allTopics: notifications.length } as Record<string, number | undefined>
  );
}
