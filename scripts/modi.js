import { Block } from "@minecraft/server";

Object.defineProperties(Block.prototype, function () {
    this.runCommandAsync = (command) => {
        const { x, y, z } = this.location;
        this.dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} run ${command}`);
    };
});