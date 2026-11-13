// Chat d'une session : mêmes formats que l'app mobile (cf. backend SessionChatService)

export interface ChatMessage {
    id: number;
    clientId: string;
    sessionId: string;
    senderId: string;
    senderFirstname: string | null;
    body: string;
    mentions: string[];
    createdAt: string;
}

/** Message affiché : confirmé par le serveur (id) ou en cours d'envoi depuis ce navigateur */
export interface DisplayMessage extends Omit<ChatMessage, "id"> {
    id: number | null;
    status: "sending" | "sent" | "failed";
}

export interface ChatMember {
    id: string;
    firstname: string;
    lastname: string;
    avatarUrl: string | null;
    status: "accepted" | "pending" | "declined";
    isOrganizer: boolean;
}

export interface ChatMeta {
    members: ChatMember[];
    muted: boolean;
    lastReadMessageId: number;
    unreadCount: number;
    reads: Record<string, number>;
}

export interface ChatPage {
    messages: ChatMessage[];
    hasMore: boolean;
}
