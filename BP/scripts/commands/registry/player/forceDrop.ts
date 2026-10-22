import {
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandStatus,
    ContainerSlot,
    ItemStack,
    Player,
    system,
    world,
} from "@minecraft/server";

import { ITEM_LOCATIONS_ENUM_KEY, ItemLocations } from "../../../enums/registry/itemLocations.js";
import { Vector } from "../../../utils/vector.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "forcedrop",
        description: "Forces given targets to drop items at provided slot location and amount",
        permissionLevel: CommandPermissionLevel.GameDirectors,

        mandatoryParameters: [
            { name: "targets", type: CustomCommandParamType.PlayerSelector },
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

        for (const target of targets) {
            const itemSlotResult = ItemLocations[slotLocation](target, slotIndex);

            if (itemSlotResult === undefined) {
                continue;
            }

            if (!(itemSlotResult instanceof ContainerSlot)) {
                return itemSlotResult;
            }

            const itemToDrop = itemSlotResult.getItem();
            if (itemToDrop === undefined) {
                continue;
            }

            const amountToDrop = Math.min(amount, itemSlotResult.amount);

            system.run(() => dropItem(target, itemSlotResult, itemToDrop, amountToDrop));
        }

        return {
            status: CustomCommandStatus.Success,
            message: `Force dropped item(s) for ${targets.length} player(s)`,
        };
    }
);

function dropItem(
    player: Player,
    containerSlot: ContainerSlot,
    itemStack: ItemStack,
    amountToDrop: number
): void {
    const viewDirection = player.getViewDirection();

    const itemToDrop = itemStack.clone();
    itemToDrop.amount = amountToDrop;

    if (amountToDrop >= itemStack.amount) {
        containerSlot.setItem(undefined);
    } else {
        itemStack.amount = itemStack.amount - amountToDrop;
        containerSlot.setItem(itemStack);
    }

    const dropLocation = player.getHeadLocation();
    dropLocation.y -= 0.3;
    const droppedItemEntity = player.dimension.spawnItem(itemToDrop, dropLocation);

    // @ts-expect-error
    droppedItemEntity.forceDropped = { owner: player, dropTick: system.currentTick };

    droppedItemEntity.clearVelocity();
    droppedItemEntity.applyImpulse(Vector.divide(viewDirection, 4));

    // player.runCommand(
    //     `playanimation @s animation.player.attack.rotations a 0.6 "v.life_time = q.life_time*2.25; v.start_time = v.start_time??v.life_time; v.time_passed = (v.life_time-v.start_time); v.attack_time=v.time_passed; return (v.time_passed > 0.6 ? 1 : 0);" "cpp_atk:${Math.floor(Date.now())}"`
    // );
}

world.beforeEvents.entityItemPickup.subscribe((event) => {
    const { entity, item } = event;

    // @ts-expect-error
    const forceDropData = item?.forceDropped;

    if (!forceDropData) {
        return;
    }

    if (forceDropData.owner?.id !== entity?.id) {
        return;
    }

    if (system.currentTick - forceDropData.dropTick > 20) {
        // @ts-expect-error
        item.forceDropped = undefined;
        return;
    }

    event.cancel = true;
});
