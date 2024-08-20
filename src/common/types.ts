export interface Notification {
  id: string;
  topic: string;
  title: string;
  body: string;
  timestamp: string;
}

export interface Device {
  token: string;
  topics: string[];
}
