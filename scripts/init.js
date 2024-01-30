import { world, Block } from "@minecraft/server";

const id = world.afterEvents.playerSpawn.subscribe(() => {
    if (world.getDynamicProperty("debugMode") === undefined) {
        world.sendMessage(
            `

§9Welcome to MCBE Commands++

§rThis is a Minecraft Bedrock addon that extends the capabilities of vanilla commands.
§fIt allows you to use features from the Script API, opening up a whole new world of possibilities for your Minecraft experience

For more information, please visit the GitHub repository at: §ahttps://github.com/jeanmajid/MCBE-Commands-plus-plus§r
To get started, use the command §a"!help"§r. Please note that this addon may be complex for beginners, so I recommend checking out the video tutorials on the basics available on YouTube (channel: §cJean majid§r) or joining our Discord server for support: §ahttps://discord.gg/6PFMrzS3sG§r

§cIf you encounter any issues or have any feedback, please create an issue on GitHub or report it on Discord by contacting me.

§aEnjoy!§r

`
        );
        world.setDynamicProperty("debugMode", 0);
    }
    world.afterEvents.playerSpawn.unsubscribe(id);
});

Object.defineProperties(Block.prototype, function () {
    this.runCommandAsync = (command) => {
        const { x, y, z } = this.location;
        this.dimension.runCommandAsync(`execute positioned ${x} ${y} ${z} run ${command}`);
    };
});
