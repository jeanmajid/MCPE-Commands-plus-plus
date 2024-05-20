import { CustomCommand } from "../handler";

CustomCommand.register({
    name: "push",
    description: "This is a test command",
    args: ["<target: entity>"]
}, ({source, args}) => {
    source.applyKnockback(...args);
})