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

/rotate -- rotates an entity

/spawnitem -- summons an item entity

/spawn -- alternative to the summon command with additional capabilities

/score -- alternative for scoreboard with enhanced capabilities; focus on better operations like sqrt(), but also include base operations like +-\*/ without the need for fakeplayers; Better score random

- Consider just taking in a single string containing the formula to allow for complex multi-operation calculations

/blockstates -- reads the block states of the block on the provided xyz position; may also have a "block id" param which lists all block states allowed for the provided block

/fillshape -- loads a shape with provided dimensions

/phil -- better fill with gradients, ticking area loading, replacing with gradient and this and that

/ui -- suit of commands to create and manage ui's

/og kick
/ban
/unban

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
