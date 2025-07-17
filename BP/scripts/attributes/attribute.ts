import { ScoreboardObjective } from "@minecraft/server";

export abstract class BaseAttribute {
    abstract id: string;
    score: ScoreboardObjective;
    selector?: string;
    /**
     * Function to initiate all your events or runIntervals
     */
    abstract initialize(): void;
    /**
     * Function to clear up all your events or runIntervals
     */
    abstract cleanup(): void;
}

export class AttributeManager {
    static attributes: BaseAttribute[] = [];

    static registerAttribute(attribute: BaseAttribute): void {
        this.attributes.push(attribute);
    }
}
