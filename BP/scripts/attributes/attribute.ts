import { ScoreboardObjective, world } from "@minecraft/server";

export abstract class BaseAttribute {
    abstract id: string;
    isBinded: boolean = false;
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

    static getAttribute(id: string): BaseAttribute | undefined {
        return this.attributes.find((attribute) => attribute.id === id);
    }

    static loadAttributesFromMemory(): void {
        for (const propertyId of world.getDynamicPropertyIds()) {
            if (!propertyId.startsWith("attribute:")) {
                continue;
            }

            const attributeId = propertyId.replace("attribute:", "");
            const attribute = this.getAttribute(attributeId);
            if (!attribute) {
                console.warn(
                    `ERROR: cannot find attribute ${attributeId}, which is found in storage... Deleting`
                );
                world.setDynamicProperty(propertyId, undefined);
                continue;
            }

            const scoreboardId = world.getDynamicProperty(propertyId) as string;

            attribute.isBinded = true;
            attribute.score =
                world.scoreboard.getObjective(scoreboardId) ??
                world.scoreboard.addObjective(scoreboardId);
            attribute.initialize();
        }
    }
}
