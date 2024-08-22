export interface Notification {
  id: string;
  topic: string;
  title: string;
  body: string;
  icon?: string;
  timestamp: string;
}

export interface Device {
  token: string;
  topics: string[];
}
