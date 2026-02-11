export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface Chat {
  id: number;
  title: string;
  messages: Message[];
}
