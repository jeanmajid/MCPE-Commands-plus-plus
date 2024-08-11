import { Player } from "@minecraft/server";

export class Module {
    static scoreModules: scoreModule[];
    static eventModules: eventModule[];
    static register(info: scoreModule | eventModule, callback: callback): void;
    static getModule(name: string): scoreModule | eventModule;
    static getAllModules(): scoreModule[] | eventModule[];
    static toggleModule(name: string, state: boolean): string;
    static updateModule(module: scoreModule | eventModule): void;
    static updateCode(module: scoreModule | eventModule): void;
    static getClosestModule(name: String): scoreModule | eventModule;
    static getAmountOfBytesUsed(module: scoreModule | eventModule): { variable: number, property: number };
    static getTotalAmountOfBytesUsed(): { variable: number, property: number };
}

declare type callback = (player: Player) => void;

declare type scoreModule = {
    name: string
    description: string
    scoreboard: string
    interval: number
    state?: boolean
}

declare type eventModule = {
    name: string
    type: "after" | "before"
    description: string
    event: EventSignal
    eventId?: any
    state?: boolean
    code: string[]
    compiledCode: Function
}

export class EventSignal {
    private constructor();
    subscribe(callback: (arg: {}) => void, options?: {}): (arg: {}) => void;
    unsubscribe(callback: (arg: any) => void): void;
}