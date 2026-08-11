/run "execute as @a at @s run give @s diamond {score.selector}"
selector could something like {“score”:{“name”:”@s”,”objective”:”example”}}

- valid keys:
    - {@s.block_from_view_direction}
    - {@s.score.objective}

/transfer -- transfers player to a server with a port ( may be able to bind ports to names to )all easier

/shootprojectile -- spawns a projectile (probs with velocity)

/pickup -- gives target an item from a drop

/container -- gives an item to a player from a speciic chest slot || /container <target> {vector} [slot_id]

/draw - draw debug shapes, one commmand per shape

/spawnparticle -- spawns a particle with more parameters than the regular particle command; includes particle spawn radius, variable modification, etc.

✅ /rotate -- rotates an entity

✅ /spawnitem -- summons an item entity

/spawn -- alternative to the summon command with additional capabilities

/score -- alternative for scoreboard with enhanced capabilities; focus on better operations like sqrt(), but also include base operations like +-\*/ without the need for fakeplayers; Better score random

- Consider just taking in a single string containing the formula to allow for complex multi-operation calculations

/blockstates -- reads the block states of the block on the provided xyz position; may also have a "block id" param which lists all block states allowed for the provided block

/fillshape -- loads a shape with provided dimensions
/phil -- better fill with gradients, ticking area loading, replacing with gradient and this and that

/ui -- suit of commands to create and manage ui's
/ui -- modalform, returned value can be used in the command with custom syntax to be decided

/waypoint -- class of commands to handle locator bar waypoints

/dimension -- transport players between dimensions

/givebutbetter -- give with extra parameters like nbt editing / lore, additional properties, enchants, whatever tha fak

/damageitem -- modify an item durability by a positive or negative value
/setitemdurability -- set an item durability to a fixed value
/enchantitem -- enchant an item in an entity's inventory
/nameitem -- rename an item in an entity's inventory
/nameitemraw -- same as nameitem but uses rawtext JSON formatting
/moveitem -- move an item between slots in an entity's inventory

/explode -- create an explosion with parameters

/permissions -- modify player permissions like block breaking and entity damaging and shitting and such

/phase -- teleport through the block in front of you

/nametagraw -- same as /nametag but uses rawtext JSON formatting

/clientparticle -- spawns a particle only visible by a certain client
/clientanimation -- animates a target only visible by a certain client

/gamerulesetup -- sets gamerules to world optimised default values (needs confirmation)

✅ /log -- logs a message to the console rather than to chat for lower profile debugging (class of commands including warn, info, whatever tha fak)
/lograw -- same as /log but uses rawtext JSON formatting

✅ /seed -- logs the world seed
/credits -- prints the credits of commands plus plus

/wiki -- show wiki link (very importa)

/og kick
/ban
/unban

wiki
listattributes get all + status (on off)
setitemdata/readitemdata
attributes should only be event based, anything that would require a runInterval, should just be triggered via command block as a custom command and not a attribute
get/set redstone power of block (maybe more similar block methods like this)
Document tooling setup
maybe like spawnplayer or smth
event system, run commands on certain events like og commands++, allowing command users to crazily optimise their works

## Attributes

- Command on attribute change

- Attributes per entity /atribute <selector> <atribute>

- Weather
- Real world time
- Ingame times
- Coords, Velocity, FacingDirection
- PlayerProperties (sneak, swim, level, xp, etc.)
- tps
- input

## Tags

- Holding item typeid
- Holding item name
