# Commands++ Commands
## Total Amount of Commands: 65


## attribute

> ### `/bind`
> **Parameters:** `<bindtype: Enum>` • `<scoreboardId: String>`
> 
> Bind an attribute to a score
> 
> `GameDirectors`

> ### `/getattribute`
> **Parameters:** `<bindtype: Enum>` • `<scoreboardId: String>`
> 
> One time getter for attributes
> 
> `GameDirectors`

> ### `/unbind`
> **Parameters:** `<bindtype: Enum>`
> 
> Unbind an attribute
> 
> `GameDirectors`



## block

> ### `/block`
> **Parameters:** `[blockType: BlockType]`
> 
> Places a block at the current position
> 
> `Admin`

> ### `/b`
> **Parameters:** `[blockType: BlockType]`
> 
> Places a block at the current position
> 
> `Admin` • *Alias of `/block`*

> ### `/blockstates`
> **Parameters:** `[position: Location]`
> 
> Lists all block states for either the block being viewed or the block at the specified position
> 
> `Admin`

> ### `/blockstatesid`
> **Parameters:** `<blockId: BlockType>`
> 
> Lists all default block state values for the provided block
> 
> `Admin`



## command

> ### `/delay`
> **Parameters:** `<id: String>` • `<delayInTicks: Integer>` • `<command: String>`
> 
> Delays the execution of a command
> 
> `GameDirectors`



## debug

> ### `/benchmarkend`
> **Parameters:** `<startId: String>` • `[logType: Enum]` • `[fakeplayer: String]` • `[objective: String]`
> 
> Logs and saves the time since the benchmark started in milliseconds
> 
> `GameDirectors`

> ### `/benchmarkstart`
> **Parameters:** `<id: String>`
> 
> Creates a time checkpoint used to find the time commands have taken to run using /benchmarkend
> 
> `GameDirectors`

> ### `/biome`
> **Parameters:** `[biomeData: Enum]`
> 
> Outputs the data for the biome based on the position of the executor
> 
> `GameDirectors`

> ### `/log`
> **Parameters:** `<logType: Enum>` • `<message: String>`
> 
> Logs a message to the content log console if enabled in the user's Creator settings
> 
> `GameDirectors`

> ### `/seed`
> 
> Returns a message to the executor containing the world seed
> 
> `GameDirectors`

> ### `/test`
> 
> Provides an output message in chat if the command has ran successfully
> 
> `GameDirectors`

> ### `/t`
> 
> Provides an output message in chat if the command has ran successfully
> 
> `GameDirectors` • *Alias of `/test`*



## dimension

> ### `/explode`
> **Parameters:** `<location: Location>` • `[radius: Float]` • `[breaksBlocks: Boolean]` • `[causesFire: Boolean]` • `[allowUnderwater: Boolean]` • `[explosionSource: EntitySelector]`
> 
> Creates an explosion at the target position with the provided parameters
> 
> `GameDirectors`



## drawer

> ### `/draw`
> **Parameters:** `<id: String>`
> 
> Draws a group of shapes under a given id
> 
> `GameDirectors`

> ### `/drawarrow`
> **Parameters:** `<id: String>` • `<startPos: Location>` • `<endPos: Location>` • `<headLength: Float>` • `<headRadius: Float>` • `<headSegments: Integer>`
> 
> Draws a arrow via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawbox`
> **Parameters:** `<id: String>` • `<position: Location>` • `<bound: Location>` • `<scale: Float>`
> 
> Draws a box via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawcircle`
> **Parameters:** `<id: String>` • `<position: Location>` • `<scale: Float>`
> 
> Draws a circle via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawcone`
> **Parameters:** `<id: String>` • `<position: Location>` • `<height: Float>` • `<radii: Float>` • `<scale: Float>`
> 
> Draws a cone via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawcylinder`
> **Parameters:** `<id: String>` • `<position: Location>` • `<height: Float>` • `<radiiBottom: Float>` • `<radiiTop: Float>` • `<scale: Float>` • `<numSegments: Integer>`
> 
> Draws a cylinder via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawellipsoid`
> **Parameters:** `<id: String>` • `<position: Location>` • `<radii: Float>` • `<scale: Float>` • `<segmentsPerAxis: Integer>`
> 
> Draws a ellipsoid via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawline`
> **Parameters:** `<id: String>` • `<startPos: Location>` • `<endPos: Location>`
> 
> Add a line
> 
> `GameDirectors`

> ### `/drawpyramid`
> **Parameters:** `<id: String>` • `<position: Location>` • `<height: Float>` • `<width: Float>` • `<depth: Float>` • `<scale: Float>`
> 
> Draws a pyramid via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawremove`
> **Parameters:** `<id: String>`
> 
> Undraws and removes a group of shapes permanently
> 
> `GameDirectors`

> ### `/drawremoveall`
> 
> Undraws and removes all shapes permanently
> 
> `GameDirectors`

> ### `/drawsphere`
> **Parameters:** `<id: String>` • `<position: Location>` • `<scale: Float>`
> 
> Draws a sphere via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawtext`
> **Parameters:** `<id: String>` • `<location: Location>` • `<text: String>` • `<useRotation: Boolean>` • `<showThroughBlocks: Boolean>` • `<backfaceVisible: Boolean>` • `<textBackfaceVisible: Boolean>`
> 
> Draws a text via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawvolume`
> **Parameters:** `<id: String>` • `<startPos: Location>` • `<endPos: Location>`
> 
> Draws a box via the Debug Drawer module
> 
> `GameDirectors`

> ### `/getdrawcount`
> 
> Display how many shapes are currently drawn
> 
> `GameDirectors`

> ### `/setdrawcolor`
> **Parameters:** `<shapeId: String>` • `<colorRed: Integer>` • `<colorGreen: Integer>` • `<colorBlue: Integer>` • `<alpha: Integer>`
> 
> Sets the draw color
> 
> `GameDirectors`

> ### `/setdrawtextbackgroundcolor`
> **Parameters:** `<shapeId: String>` • `<colorRed: Integer>` • `<colorGreen: Integer>` • `<colorBlue: Integer>` • `<alpha: Integer>`
> 
> Sets the draw color for text
> 
> `GameDirectors`

> ### `/undraw`
> **Parameters:** `<id: String>`
> 
> Undraws a group of shapes under a given id, but keeps them in the manager
> 
> `GameDirectors`

> ### `/undrawall`
> 
> Undraws all shapes, but keeps the groups in the manager
> 
> `GameDirectors`



## entity

> ### `/entitycount`
> **Parameters:** `<targets: EntitySelector>` • `<fakeplayer: String>` • `<objective: String>`
> 
> Returns the count of all loaded targets to a fakeplayer's scoreboard objective
> 
> `GameDirectors`

> ### `/fmbe`
> **Parameters:** `<entities: EntitySelector>` • `[fmbeType: Enum]`
> 
> Animates targets (fox) to appear as a full block when holding a three dimensional block item
> 
> `GameDirectors`

> ### `/harm`
> **Parameters:** `[target: PlayerSelector]` • `[value: Integer]`
> 
> Decreases all targets current health value by an amount
> 
> `GameDirectors`

> ### `/heal`
> **Parameters:** `[target: PlayerSelector]` • `[value: Integer]`
> 
> Heals the target by a value
> 
> `GameDirectors`

> ### `/health`
> **Parameters:** `<target: PlayerSelector>` • `<mode: Enum>` • `<value: Integer>`
> 
> Modifies all targets health based on the mode and value
> 
> `GameDirectors`

> ### `/ignite`
> **Parameters:** `<targets: EntitySelector>` • `[timeSeconds: Float]` • `[useEffects: Boolean]`
> 
> Sets the target entities on fire
> 
> `GameDirectors`

> ### `/remove`
> **Parameters:** `<targets: EntitySelector>`
> 
> Removes entites from the world
> 
> `GameDirectors`

> ### `/rotate`
> **Parameters:** `[targets: EntitySelector]` • `[rotationX: Float]` • `[rotationY: Float]`
> 
> Modifies target entities rotation
> 
> `GameDirectors`

> ### `/spawnitem`
> **Parameters:** `<item: ItemType>` • `<location: Location>` • `[quantity: Integer]`
> 
> Summons an item entity
> 
> `GameDirectors`

> ### `/top`
> **Parameters:** `[targets: EntitySelector]` • `[minHeight: Float]`
> 
> Teleports the targets to the top most block at their position
> 
> `GameDirectors`



## misc

> ### `/credits`
> 
> Provides an output message in chat containing the credits for Commands++
> 
> `Any`

> ### `/gamerulesetup`
> 
> Sets most gamerules to game-ready optimised values
> 
> `GameDirectors`

> ### `/guide`
> **Parameters:** `[page: Integer]`
> 
> Lists in chat all new commands added by Commands++
> 
> `Admin`

> ### `/listcommands`
> **Parameters:** `[page: Integer]`
> 
> Lists in chat all new commands added by Commands++
> 
> `Admin` • *Alias of `/guide`*

> ### `/wiki`
> 
> Provides a link in chat to the wiki page of Commands++
> 
> `Admin`



## nameTag

> ### `/nametag`
> **Parameters:** `<targets: EntitySelector>` • `<nametag: String>`
> 
> Set nametag of entities
> 
> `GameDirectors`

> ### `/resetnametag`
> **Parameters:** `<targets: EntitySelector>`
> 
> Reset the nametag for players
> 
> `GameDirectors`



## player

> ### `/hunger`
> **Parameters:** `<players: PlayerSelector>` • `<mode: Enum>` • `<value: Integer>`
> 
> Modifies all target players hunger based on the mode and value
> 
> `GameDirectors`

> ### `/tpspawnpoint`
> **Parameters:** `[targets: PlayerSelector]`
> 
> Teleports all targets to their spawnpoint
> 
> `GameDirectors`

> ### `/tpworldspawn`
> **Parameters:** `[targets: PlayerSelector]`
> 
> Teleports all targets to the world spawn point
> 
> `GameDirectors`

> ### `/unvanish`
> **Parameters:** `[players: PlayerSelector]` • `[tpBack: Boolean]`
> 
> Exits vanish mode and optionally returns to original position
> 
> `GameDirectors`

> ### `/uv`
> **Parameters:** `[players: PlayerSelector]` • `[tpBack: Boolean]`
> 
> Exits vanish mode and optionally returns to original position
> 
> `GameDirectors` • *Alias of `/unvanish`*

> ### `/vanish`
> **Parameters:** `[players: PlayerSelector]`
> 
> Enter vanish mode and optionally return to original position when exiting
> 
> `GameDirectors`

> ### `/v`
> **Parameters:** `[players: PlayerSelector]`
> 
> Enter vanish mode and optionally return to original position when exiting
> 
> `GameDirectors` • *Alias of `/vanish`*



## structure

> ### `/structurelist`
> 
> list all the structures on the world
> 
> `Admin`



## tag

> ### `/addtags`
> **Parameters:** `<targets: EntitySelector>` • `<tags: String>`
> 
> Adds an array of provided tags to the targets
> 
> `GameDirectors`

> ### `/removetags`
> **Parameters:** `<targets: EntitySelector>` • `[tags: String]`
> 
> Removes an array of provided tags from the targets
> 
> `GameDirectors`



## velocity

> ### `/applyimpulse`
> **Parameters:** `<targets: EntitySelector>` • `<x: Float>` • `<y: Float>` • `<z: Float>`
> 
> Applies an impulse to the selected entities
> 
> `GameDirectors`

> ### `/applyknockback`
> **Parameters:** `<targets: EntitySelector>` • `<x: Float>` • `<y: Float>` • `<z: Float>`
> 
> Applies knockback to the selected entities
> 
> `GameDirectors`

> ### `/clearvelocity`
> **Parameters:** `<targets: EntitySelector>`
> 
> Clears target entities velocity
> 
> `GameDirectors`

