export interface CallbackParams {
    source: import("@minecraft/server").Player | import("@minecraft/server").Entity | import("@minecraft/server").Block;
    args: string[];
}

export type callback = (params: CallbackParams) => void;

export interface chatCommand {
    name: string;
    aliases: string[];
    description: string;
    callback: Function;
}
