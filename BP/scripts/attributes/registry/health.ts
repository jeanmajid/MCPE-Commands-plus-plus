import { system, world } from "@minecraft/server";
import { AttributeManager, BaseAttribute } from "../attribute";

class HealthAttribute extends BaseAttribute {
    id = "health";
    runId: number;

    initialize(): void {
        this.runId = system.runInterval(() => {
            for (const entity of world.getAllPlayers()) {
                this.score.setScore(entity, entity.getComponent("health")?.currentValue ?? 0);
            }
        });
    }

    cleanup(): void {
        system.clearRun(this.runId);
    }
}

AttributeManager.registerAttribute(new HealthAttribute());
