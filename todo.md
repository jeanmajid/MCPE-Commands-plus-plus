/run "execute as @a at @s run give @s diamond {score.selector}"
selector could something like {“score”:{“name”:”@s”,”objective”:”example”}}

- valid keys:
    - {@s.block_from_view_direction}
    - {@s.score.objective}

/transfer -- transfers player to a server with a port ( may be able to bind ports to names to )all easier

/shootprojectile -- spawns a projectile (probs with velocity)

/pickup -- gives target an item from a drop

/container -- gives an item to a player from a speciic chest slot || /container <target> {vector} [slot_id]

/draw -- draw debug shapes, one commmand per shape

/spawnparticle -- spawns a particle with more parameters than the regular particle command; includes particle spawn radius, variable modification, etc.

/spawn -- alternative to the summon command with additional capabilities

/score -- alternative for scoreboard with enhanced capabilities; focus on better operations like sqrt(), but also include base operations like +-\*/ without the need for fakeplayers; Better score random

- Consider just taking in a single string containing the formula to allow for complex multi-operation calculations

/fillshape -- loads a shape with provided dimensions
/phil -- better fill with gradients, ticking area loading, replacing with gradient and this and that

/ui -- suit of commands to create and manage ui's
/ui -- modalform, returned value can be used in the command with custom syntax to be decided

/waypoint -- class of commands to handle locator bar waypoints

[!] /dimension -- transport players between dimensions

/givebutbetter -- give with extra parameters like nbt editing / lore, additional properties, enchants, whatever tha fak

/damageitem -- modify an item durability by a positive or negative value
/setitemdurability -- set an item durability to a fixed value
/enchantitem -- enchant an item in an entity's inventory
/nameitem -- rename an item in an entity's inventory
/nameitemraw -- same as nameitem but uses rawtext JSON formatting
/moveitem -- move an item between slots in an entity's inventory

[!] /explode -- create an explosion with parameters

/permissions -- modify player permissions like block breaking and entity damaging and shitting and such

[!] /phase -- teleport through the block in front of you

/nametagraw -- same as /nametag but uses rawtext JSON formatting

/clientparticle -- spawns a particle only visible by a certain client
/clientanimation -- animates a target only visible by a certain client

[!] /gamerulesetup -- sets gamerules to world optimised default values (needs confirmation)

/lograw -- same as /log but uses rawtext JSON formatting

/og kick -- allows kicking of players using target selectors (excluding the world owner)
/ban -- permanently removes a player from the world (excluding the world owner)
/unban -- removes a player from the ban list

/heal -- heal the player by an integer value
/hunger <set/add/remove> -- sets, adds, or removes hunger from the target player

/hitbox -- reveals the hitbox of the target

/potion -- gives a potions with custom parameters

/invulnerable -- makes an entity unable to be damaged by any source

[!] /vanish -- hides an entity to others and optionally tp back to original location when exiting (spectator mode)
[!] /unvanish -- unhides entities from vanish mode

/helditems <target> [location] -- lists contents within the provided location in chat (if no location provided default to all held items)

/warp -- tp to a warp id
/addwarp -- add the warp with permissions

[!] /loadarea -- Alternative to /tickingarea using the Script API tickingArea module to allow for more total ticking areas & a different ticking system than the in-build command version; will need a class of commands to manage

/getattribute -- One time trigger for an attribute which gets the value using the "on activate" method of the given attribute

/config [rule] [value] -- custom gamerules handling; if no rule, query all; if no value, query the rule

[!] /benchmarkstart <id> -- Save the current world time to memory under the provided ID for benchmarking
[!] /benchmarkend <id> <console|chat> -- Logs to the console the time since the start time of the benchmark registered under the ID
[!] /benchmarkendsave <id> <fakeplayer> <objective> -- Returns to the objective on the fakeplayer the current time minus the start time from the provided ID for benchmarking (time elapsed since start from run)

/rules -- Allows non-operator players to view the world specific rules set by /rulesset; by default displays a message like "No defined rules for this world", or just doesnt log anything
/rulesset -- Allows operators to set world specific rules using a fixed string

[!] GAMERULES MANAGER WITH SYNTAX SIMILAR TO COMMANDS TO REGISTER NEW GAME RULES ON THE WORLD

wiki
listattributes get all + status (on off)
setitemdata/readitemdata
attributes should only be event based, anything that would require a runInterval, should just be triggered via command block as a custom command and not a attribute
get/set redstone power of block (maybe more similar block methods like this)
Document tooling setup
maybe like spawnplayer or smth
event system, run commands on certain events like og commands++, allowing command users to crazily optimise their works

## Gamerules

Custom gamerules under the /config command

- debugmode <true | false> -- toggles the debug mode for the world which controls the activation of specific debug utilities (may be broken down into individual rules like private logging)
- debughitboxes <true | false> -- toggles if hitboxes are shown from /hitbox

## Attributes

- Command on attribute change

- Attributes per entity /atribute <selector> <atribute>

- Weather
- Real world time
- Ingame times
- Coords, Velocity, FacingDirection
- PlayerProperties (sneak, swim, level, xp, etc.)
- tps
- ping
- input
- biome

## Tags

- Holding item typeid
- Holding item name
