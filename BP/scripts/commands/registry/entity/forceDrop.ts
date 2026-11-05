import {
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandStatus,
    ContainerSlot,
    ItemStack,
    Entity,
    system,
    world,
} from "@minecraft/server";

import { ITEM_LOCATIONS_ENUM_KEY, ItemLocations } from "../../../enums/registry/itemLocations.js";
import { Vector } from "../../../utils/vector.js";
import { CommandManager } from "../../command.js";

declare module "@minecraft/server" {
    interface Entity {
        forceDropped?: { owner: Entity; dropTick: number };
    }
}

CommandManager.register(
    {
        name: "forcedrop",
        description: "Forces given targets to drop items at provided slot location and amount",
        permissionLevel: CommandPermissionLevel.GameDirectors,

        mandatoryParameters: [
            { name: "targets", type: CustomCommandParamType.EntitySelector },
            {
                name: "slotType",
                type: CustomCommandParamType.Enum,
                enumName: ITEM_LOCATIONS_ENUM_KEY,
            },
            { name: "slot", type: CustomCommandParamType.Integer },
        ],
        optionalParameters: [{ name: "count", type: CustomCommandParamType.Integer }],
    },
    (origin, targets, slotLocation, slotIndex, amount = 64) => {
        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets matched selector" };
        }

        if (amount <= 0) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Amount to drop cant be 0 or lower",
            };
        }

        const targetItemSlots = new Map();

        for (const target of targets) {
            const itemSlotResult = ItemLocations[slotLocation](target, slotIndex);

            if (itemSlotResult === undefined) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: `Couldnt get ${slotLocation} for ${target?.nameTag ? target.nameTag : target?.typeId}`,
                };
            }

            if (!(itemSlotResult instanceof ContainerSlot)) {
                return itemSlotResult;
            }

            targetItemSlots.set(target, itemSlotResult);
        }

        // to ensure no entities iterated before possible errors gets its items dropped

        for (const [target, itemSlot] of targetItemSlots) {
            const itemToDrop = itemSlot.getItem();
            if (itemToDrop === undefined) {
                continue;
            }

            const amountToDrop = Math.min(amount, itemSlot.amount);

            system.run(() => dropItem(target, itemSlot, itemToDrop, amountToDrop));
        }

        return {
            status: CustomCommandStatus.Success,
            message: `Force dropped item(s) for ${targets.length} entity(s)`,
        };
    }
);

function dropItem(
    entity: Entity,
    containerSlot: ContainerSlot,
    itemStack: ItemStack,
    amountToDrop: number
): void {
    const viewDirection = entity.getViewDirection();

    const itemToDrop = itemStack.clone();
    itemToDrop.amount = amountToDrop;

    if (amountToDrop >= itemStack.amount) {
        containerSlot.setItem(undefined);
    } else {
        itemStack.amount = itemStack.amount - amountToDrop;
        containerSlot.setItem(itemStack);
    }

    const dropLocation = entity.getHeadLocation();
    dropLocation.y -= 0.3;
    const droppedItemEntity = entity.dimension.spawnItem(itemToDrop, dropLocation);

    droppedItemEntity.forceDropped = { owner: entity, dropTick: system.currentTick };

    droppedItemEntity.clearVelocity();
    droppedItemEntity.applyImpulse(Vector.divide(viewDirection, 4));

    // player.runCommand(
    //     `playanimation @s animation.player.attack.rotations a 0.6 "v.life_time = q.life_time*2.25; v.start_time = v.start_time??v.life_time; v.time_passed = (v.life_time-v.start_time); v.attack_time=v.time_passed; return (v.time_passed > 0.6 ? 1 : 0);" "cpp_atk:${Math.floor(Date.now())}"`
    // );
}

world.beforeEvents.entityItemPickup.subscribe((event) => {
    const { entity, item } = event;

    const forceDropData = item?.forceDropped;

    if (!forceDropData) {
        return;
    }

    if (forceDropData.owner?.id !== entity?.id) {
        return;
    }

    if (system.currentTick - forceDropData.dropTick > 20) {
        item.forceDropped = undefined;
        return;
    }

    event.cancel = true;
});
