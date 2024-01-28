import { Module } from '../../module';
import { setScore } from "./utils";

Module.register(
    {
        name: "xp",
        description: "Get the XP of an player via scoreboard",
        interval: 20,
        scoreboard: "xp"
    },
    (player) => {
        setScore(player, "xp", player.level);
        console.warn(player.level);
    }
);
