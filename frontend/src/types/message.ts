export interface Message {
    id: string;
    timestamp: EpochTimeStamp;
    sender: string;
    receiver: string;
    messagecontent: string;
}