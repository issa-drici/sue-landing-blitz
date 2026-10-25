// Formes renvoyées par l'API (mêmes données que l'app mobile)

export type ParticipantStatus = "accepted" | "pending" | "declined";

export interface WebParticipant {
    id: string;
    fullName: string;
    status: ParticipantStatus;
    avatarUrl: string | null;
    hasGivenAvailability?: boolean;
    hasNewSlots?: boolean;
}

export interface WebSlot {
    id: string;
    date: string; // YYYY-MM-DD (heure de Paris)
    startTime: string; // HH:mm
    endTime: string;
    availableUserIds: string[];
    availabilityCount: number;
    proposedBy?: string | null; // invité qui l'a proposé, null si c'est l'organisateur
}

export interface WebSession {
    id: string;
    sport: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    maxParticipants: number | null;
    pricePerPerson: number | null;
    status: "active" | "cancelled";
    scheduling: "scheduled" | "finding_slot";
    slotProposals: WebSlot[];
    shareToken: string | null;
    organizer: { id: string; fullName: string; avatarUrl: string | null };
    participants: WebParticipant[];
}

export interface WebUser {
    id: string;
    firstname: string;
    lastname: string;
    phone: string;
}
