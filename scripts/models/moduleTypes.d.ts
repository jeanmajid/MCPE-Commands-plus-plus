export type callback = (player: import("@minecraft/server").Player) => void;

export interface EventSignal {
    subscribe(callback: (arg: {}) => void, context: Object): (arg: {}) => void;
    unsubscribe(callback: (arg: any) => void): void;
}

export interface scoreModule {
    name: string;
    description: string;
    scoreboard: string;
    interval: number;
    state?: boolean;
}

export interface eventModule {
    name: string;
    type: "after" | "before";
    description: string;
    event: EventSignal;
    eventId?: any;
    state?: boolean;
    code: string[];
    compiledCode: Function;
}
