import { CustomCommand } from "../handler";

CustomCommand.register({
    name: "test",
    description: "This is a test command",
}, (data) => {
    const { source, args } = data;
    console.warn("Test command executed by", source.name, "with args", args);
})