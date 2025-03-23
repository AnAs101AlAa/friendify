import { Message } from "./message";

export interface Chat {
    id: string;
    fuser: string;
    suser: string;
    messages: Message[];
}