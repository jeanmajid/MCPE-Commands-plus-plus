# Commands++ Commands
## Total Amount of Commands: 73


## attribute

> ### `/bindattribute`
> **Parameters:** `<bindtype: Enum>` • `<scoreboardId: String>`
> 
> Bind an attribute to a score
> 
> `Operators + Command Blocks`

> ### `/getattribute`
> **Parameters:** `<bindtype: Enum>` • `<scoreboardId: String>`
> 
> One time getter for attributes
> 
> `Operators + Command Blocks`

> ### `/unbindattribute`
> **Parameters:** `<bindtype: Enum>`
> 
> Unbind an attribute
> 
> `Operators + Command Blocks`



## block

> ### `/block`
> **Parameters:** `[blockType: Block]`
> 
> Places a block at the current position
> 
> `Operator`

> ### `/b`
> **Parameters:** `[blockType: Block]`
> 
> Places a block at the current position
> 
> `Operator` • *Alias of `/block`*

> ### `/blockstates`
> **Parameters:** `[position: Location]`
> 
> Lists all block states for either the block being viewed or the block at the specified position
> 
> `Operator`

> ### `/blockstatesid`
> **Parameters:** `<blockId: Block>`
> 
> Lists all default block state values for the provided block
> 
> `Operator`



## command

> ### `/delay`
> **Parameters:** `<id: String>` • `<delayInTicks: Integer>` • `<command: String>`
> 
> Delays the execution of a command
> 
> `Operators + Command Blocks`

> ### `/scoremath`
> **Parameters:** `<targets: Entity>` • `<targetObjective: String>` • `<operation: Enum>` • `[selectors: Entity]` • `[objective: String]`
> 
> Performs a calculation with the selected operation between the scores of two targets
> 
> `Operators + Command Blocks`

> ### `/scorerandom`
> **Parameters:** `<targets: Entity>` • `<targetObjective: String>` • `[min: Integer]` • `[max: Integer]`
> 
> Outputs a random score value to the target objective, optionally between a min and max value
> 
> `Operators + Command Blocks`



## debug

> ### `/benchmarkend`
> **Parameters:** `<startId: String>` • `[logType: Enum]` • `[fakeplayer: String]` • `[objective: String]`
> 
> Logs and saves the time since the benchmark started in milliseconds
> 
> `Operators + Command Blocks`

> ### `/benchmarkstart`
> **Parameters:** `<id: String>`
> 
> Creates a time checkpoint used to find the time commands have taken to run using /benchmarkend
> 
> `Operators + Command Blocks`

> ### `/biome`
> **Parameters:** `[biomeData: Enum]`
> 
> Outputs the data for the biome based on the position of the executor
> 
> `Operators + Command Blocks`

> ### `/log`
> **Parameters:** `<logType: Enum>` • `<message: String>`
> 
> Logs a message to the content log console if enabled in the user's Creator settings
> 
> `Operators + Command Blocks`

> ### `/seed`
> 
> Returns a message to the executor containing the world seed
> 
> `Operators + Command Blocks`

> ### `/test`
> 
> Provides an output message in chat if the command has ran successfully
> 
> `Operators + Command Blocks`

> ### `/t`
> 
> Provides an output message in chat if the command has ran successfully
> 
> `Operators + Command Blocks` • *Alias of `/test`*



## dimension

> ### `/dimension`
> **Parameters:** `<dimension: Enum>` • `[targets: Entity]`
> 
> Teleport between dimensions
> 
> `Operators + Command Blocks`

> ### `/explode`
> **Parameters:** `<location: Location>` • `[radius: Float]` • `[breaksBlocks: Boolean]` • `[causesFire: Boolean]` • `[allowUnderwater: Boolean]` • `[explosionSource: Entity]`
> 
> Creates an explosion at the target position with the provided parameters
> 
> `Operators + Command Blocks`



## drawer

> ### `/draw`
> **Parameters:** `<id: String>`
> 
> Draws a group of shapes under a given id
> 
> `Operators + Command Blocks`

> ### `/drawarrow`
> **Parameters:** `<id: String>` • `<startPos: Location>` • `<endPos: Location>` • `<headLength: Float>` • `<headRadius: Float>` • `<headSegments: Integer>`
> 
> Draws a arrow via the Debug Drawer module
> 
> `Operators + Command Blocks`

> ### `/drawbox`
> **Parameters:** `<id: String>` • `<position: Location>` • `<bound: Location>` • `<scale: Float>`
> 
> Draws a box via the Debug Drawer module
> 
> `Operators + Command Blocks`

> ### `/drawcircle`
> **Parameters:** `<id: String>` • `<position: Location>` • `<scale: Float>`
> 
> Draws a circle via the Debug Drawer module
> 
> `Operators + Command Blocks`

> ### `/drawcone`
> **Parameters:** `<id: String>` • `<position: Location>` • `<height: Float>` • `<radii: Float>` • `<scale: Float>`
> 
> Draws a cone via the Debug Drawer module
> 
> `Operators + Command Blocks`

> ### `/drawcylinder`
> **Parameters:** `<id: String>` • `<position: Location>` • `<height: Float>` • `<radiiBottom: Float>` • `<radiiTop: Float>` • `<scale: Float>` • `<numSegments: Integer>`
> 
> Draws a cylinder via the Debug Drawer module
> 
> `Operators + Command Blocks`

> ### `/drawellipsoid`
> **Parameters:** `<id: String>` • `<position: Location>` • `<radii: Float>` • `<scale: Float>` • `<segmentsPerAxis: Integer>`
> 
> Draws a ellipsoid via the Debug Drawer module
> 
> `Operators + Command Blocks`

> ### `/drawline`
> **Parameters:** `<id: String>` • `<startPos: Location>` • `<endPos: Location>`
> 
> Add a line
> 
> `Operators + Command Blocks`

> ### `/drawpyramid`
> **Parameters:** `<id: String>` • `<position: Location>` • `<height: Float>` • `<width: Float>` • `<depth: Float>` • `<scale: Float>`
> 
> Draws a pyramid via the Debug Drawer module
> 
> `Operators + Command Blocks`

> ### `/drawremove`
> **Parameters:** `<id: String>`
> 
> Undraws and removes a group of shapes permanently
> 
> `Operators + Command Blocks`

> ### `/drawremoveall`
> 
> Undraws and removes all shapes permanently
> 
> `Operators + Command Blocks`

> ### `/drawsphere`
> **Parameters:** `<id: String>` • `<position: Location>` • `<scale: Float>`
> 
> Draws a sphere via the Debug Drawer module
> 
> `Operators + Command Blocks`

> ### `/drawtext`
> **Parameters:** `<id: String>` • `<location: Location>` • `<text: String>` • `<useRotation: Boolean>` • `<showThroughBlocks: Boolean>` • `<backfaceVisible: Boolean>` • `<textBackfaceVisible: Boolean>`
> 
> Draws a text via the Debug Drawer module
> 
> `Operators + Command Blocks`

> ### `/drawvolume`
> **Parameters:** `<id: String>` • `<startPos: Location>` • `<endPos: Location>`
> 
> Draws a box via the Debug Drawer module
> 
> `Operators + Command Blocks`

> ### `/getdrawcount`
> 
> Display how many shapes are currently drawn
> 
> `Operators + Command Blocks`

> ### `/setdrawcolor`
> **Parameters:** `<shapeId: String>` • `<colorRed: Integer>` • `<colorGreen: Integer>` • `<colorBlue: Integer>` • `<alpha: Integer>`
> 
> Sets the draw color
> 
> `Operators + Command Blocks`

> ### `/setdrawtextbackgroundcolor`
> **Parameters:** `<shapeId: String>` • `<colorRed: Integer>` • `<colorGreen: Integer>` • `<colorBlue: Integer>` • `<alpha: Integer>`
> 
> Sets the draw color for text
> 
> `Operators + Command Blocks`

> ### `/undraw`
> **Parameters:** `<id: String>`
> 
> Undraws a group of shapes under a given id, but keeps them in the manager
> 
> `Operators + Command Blocks`

> ### `/undrawall`
> 
> Undraws all shapes, but keeps the groups in the manager
> 
> `Operators + Command Blocks`



## entity

> ### `/entitycount`
> **Parameters:** `<targets: Entity>` • `<fakeplayer: String>` • `<objective: String>`
> 
> Returns the count of all loaded targets to a fakeplayer's scoreboard objective
> 
> `Operators + Command Blocks`

> ### `/fmbe`
> **Parameters:** `<entities: Entity>` • `[fmbeType: Enum]`
> 
> Animates targets (fox) to appear as a full block when holding a three dimensional block item
> 
> `Operators + Command Blocks`

> ### `/harm`
> **Parameters:** `[target: Player]` • `[value: Integer]`
> 
> Decreases all targets current health value by an amount
> 
> `Operators + Command Blocks`

> ### `/heal`
> **Parameters:** `[target: Player]` • `[value: Integer]`
> 
> Heals the target by a value
> 
> `Operators + Command Blocks`

> ### `/health`
> **Parameters:** `<target: Player>` • `<mode: Enum>` • `<value: Integer>`
> 
> Modifies all targets health based on the mode and value
> 
> `Operators + Command Blocks`

> ### `/remove`
> **Parameters:** `<targets: Entity>`
> 
> Removes entites from the world
> 
> `Operators + Command Blocks`

> ### `/rotate`
> **Parameters:** `[targets: Entity]` • `[rotationX: Float]` • `[rotationY: Float]`
> 
> Modifies target entities rotation
> 
> `Operators + Command Blocks`

> ### `/setonfire`
> **Parameters:** `<targets: Entity>` • `[timeSeconds: Float]` • `[useEffects: Boolean]`
> 
> Sets the target entities on fire
> 
> `Operators + Command Blocks`

> ### `/spawnitem`
> **Parameters:** `<item: Item>` • `<location: Location>` • `[quantity: Integer]`
> 
> Summons an item entity
> 
> `Operators + Command Blocks`

> ### `/top`
> **Parameters:** `[targets: Entity]` • `[minHeight: Float]`
> 
> Teleports the targets to the top most block at their position
> 
> `Operators + Command Blocks`



## misc

> ### `/credits`
> 
> Provides an output message in chat containing the credits for Commands++
> 
> `Everyone`

> ### `/gamerulesetup`
> 
> Sets most gamerules to game-ready optimised values
> 
> `Operators + Command Blocks`

> ### `/guide`
> **Parameters:** `[page: Integer]`
> 
> Lists in chat all new commands added by Commands++
> 
> `Operator`

> ### `/listcommands`
> **Parameters:** `[page: Integer]`
> 
> Lists in chat all new commands added by Commands++
> 
> `Operator` • *Alias of `/guide`*

> ### `/rules`
> **Parameters:** `[line: Integer]`
> 
> Outputs to chat the world specific rules
> 
> `Everyone`

> ### `/ruleset`
> **Parameters:** `<line: Integer>` • `[rule: String]`
> 
> Sets the world specific rules that can be viewed by any player using /rules
> 
> `Operators + Command Blocks`

> ### `/wiki`
> 
> Provides a link in chat to the wiki page of Commands++
> 
> `Operator`



## nameTag

> ### `/nametag`
> **Parameters:** `<targets: Entity>` • `<nametag: String>`
> 
> Set nametag of entities
> 
> `Operators + Command Blocks`

> ### `/resetnametag`
> **Parameters:** `<targets: Entity>`
> 
> Reset the nametag for players
> 
> `Operators + Command Blocks`



## player

> ### `/ban`
> **Parameters:** `<players: Player>` • `[reason: String]`
> 
> Permanently bans a player from the world
> 
> `Operators + Command Blocks`

> ### `/hunger`
> **Parameters:** `<players: Player>` • `<mode: Enum>` • `<value: Integer>`
> 
> Modifies all target players hunger based on the mode and value
> 
> `Operators + Command Blocks`

> ### `/masskick`
> **Parameters:** `<players: Player>` • `[reason: String]`
> 
> Kicks players from the world supporting selectors
> 
> `Operators + Command Blocks`

> ### `/serverjoin`
> **Parameters:** `<players: Player>` • `<ip: String>` • `<port: Integer>`
> 
> Transfers players to a server
> 
> `Operators + Command Blocks`

> ### `/tpspawnpoint`
> **Parameters:** `[targets: Player]`
> 
> Teleports all targets to their spawnpoint
> 
> `Operators + Command Blocks`

> ### `/tpworldspawn`
> **Parameters:** `[targets: Player]`
> 
> Teleports all targets to the world spawn point
> 
> `Operators + Command Blocks`

> ### `/unvanish`
> **Parameters:** `[players: Player]` • `[tpBack: Boolean]`
> 
> Exits vanish mode and optionally returns to original position
> 
> `Operators + Command Blocks`

> ### `/uv`
> **Parameters:** `[players: Player]` • `[tpBack: Boolean]`
> 
> Exits vanish mode and optionally returns to original position
> 
> `Operators + Command Blocks` • *Alias of `/unvanish`*

> ### `/vanish`
> **Parameters:** `[players: Player]`
> 
> Enter vanish mode and optionally return to original position when exiting
> 
> `Operators + Command Blocks`

> ### `/v`
> **Parameters:** `[players: Player]`
> 
> Enter vanish mode and optionally return to original position when exiting
> 
> `Operators + Command Blocks` • *Alias of `/vanish`*



## structure

> ### `/structurelist`
> 
> list all the structures on the world
> 
> `Operator`



## tag

> ### `/addtags`
> **Parameters:** `<targets: Entity>` • `<tags: String>`
> 
> Adds an array of provided tags to the targets
> 
> `Operators + Command Blocks`

> ### `/removetags`
> **Parameters:** `<targets: Entity>` • `[tags: String]`
> 
> Removes an array of provided tags from the targets
> 
> `Operators + Command Blocks`



## velocity

> ### `/applyimpulse`
> **Parameters:** `<targets: Entity>` • `<x: Float>` • `<y: Float>` • `<z: Float>`
> 
> Applies an impulse to the selected entities
> 
> `Operators + Command Blocks`

> ### `/applyknockback`
> **Parameters:** `<targets: Entity>` • `<x: Float>` • `<y: Float>` • `<z: Float>`
> 
> Applies knockback to the selected entities
> 
> `Operators + Command Blocks`

> ### `/clearvelocity`
> **Parameters:** `<targets: Entity>`
> 
> Clears target entities velocity
> 
> `Operators + Command Blocks`

