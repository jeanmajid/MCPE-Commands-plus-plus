import { Module } from '../../models/module.js';
import { setScore } from "../../utils/score";

Module.register(
    {
        name: "xp",
        description: "Get the XP of an player via scoreboard",
        interval: 20,
        scoreboard: "xp"
    },
    (player) => {
        setScore(player, "xp", player.level);
    }
);
