import { system, world } from "@minecraft/server";

import { AttributeManager, BaseAttribute } from "../attribute";

class HealthAttribute extends BaseAttribute {
    public id = "health";
    public runId: number = -1;

    public initialize(): void {
        this.runId = system.runInterval(() => {
            for (const entity of world.getAllPlayers()) {
                this.score.setScore(entity, entity.getComponent("health")?.currentValue ?? 0);
            }
        });
    }

    public cleanup(): void {
        system.clearRun(this.runId);
    }
}

AttributeManager.registerAttribute(new HealthAttribute());
