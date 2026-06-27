import { ScoreboardObjective, world } from "@minecraft/server";

export abstract class BaseAttribute {
    public abstract id: string;
    public isBinded: boolean = false;
    public score!: ScoreboardObjective;
    public selector?: string;
    /**
     * Function to initiate all your events or runIntervals
     */
    public abstract initialize(): void;
    /**
     * Function to clear up all your events or runIntervals
     */
    public abstract cleanup(): void;
}

export class AttributeManager {
    public static attributes: BaseAttribute[] = [];

    public static registerAttribute(attribute: BaseAttribute): void {
        this.attributes.push(attribute);
    }

    public static getAttribute(id: string): BaseAttribute | undefined {
        return this.attributes.find(attribute => attribute.id === id);
    }

    public static loadAttributesFromMemory(): void {
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
