> ### `/bind`
> **Parameters:** `<bindtype: Enum>` • `<scoreboardId: String>`
> 
> Bind an attribute to a score
> 
> `GameDirectors`

> ### `/unbind`
> **Parameters:** `<bindtype: Enum>`
> 
> Unbind an attribute
> 
> `GameDirectors`

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

> ### `/delay`
> **Parameters:** `<id: String>` • `<delayInTicks: Integer>` • `<command: String>`
> 
> Delays the execution of a command
> 
> `GameDirectors`

> ### `/benchmarkend`
> **Parameters:** `<startId: String>` • `[logType: Enum]`
> 
> Logs the time since the benchmark started in milliseconds
> 
> `GameDirectors`

> ### `/benchmarkstart`
> **Parameters:** `<id: String>`
> 
> Creates a time checkpoint used to find the time commands have taken to run using /benchmarkend
> 
> `GameDirectors`

> ### `/biome`
> 
> Outputs the identifier for the biome based on the position of the executor
> 
> `GameDirectors`

> ### `/biometags`
> 
> Outputs the tags for the biome based on the position of the executor
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

> ### `/draw`
> **Parameters:** `<id: String>`
> 
> Draws a group of shapes under a given id
> 
> `GameDirectors`

> ### `/drawarrow`
> **Parameters:** `<startPos: Location>` • `<endPos: Location>` • `<headLength: Float>` • `<headRadius: Float>` • `<headSegments: Integer>` • `<id: String>`
> 
> Draws a arrow via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawbox`
> **Parameters:** `<startPos: Location>` • `<boundX: Location>` • `<boundY: Location>` • `<boundZ: Location>` • `<scale: Float>` • `<id: String>`
> 
> Draws a box via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawcircle`
> **Parameters:** `<startPos: Location>` • `<scale: Float>` • `<id: String>`
> 
> Draws a circle via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawcone`
> **Parameters:** `<startPos: Location>` • `<height: Float>` • `<radii: Float>` • `<scale: Float>` • `<id: String>`
> 
> Draws a cone via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawcylinder`
> **Parameters:** `<startPos: Location>` • `<height: Float>` • `<radii: Float>` • `<scale: Float>` • `<numSegments: Integer>` • `<id: String>`
> 
> Draws a cylinder via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawellipsoid`
> **Parameters:** `<startPos: Location>` • `<radii: Float>` • `<scale: Float>` • `<segmentsPerAxis: Integer>` • `<id: String>`
> 
> Draws a ellipsoid via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawline`
> **Parameters:** `<startPos: Location>` • `<endPos: Location>` • `<id: String>`
> 
> Add a line
> 
> `GameDirectors`

> ### `/drawpyramid`
> **Parameters:** `<startPos: Location>` • `<height: Float>` • `<width: Float>` • `<depth: Float>` • `<scale: Float>` • `<id: String>`
> 
> Draws a pyramid via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawsphere`
> **Parameters:** `<startPos: Location>` • `<scale: Float>` • `<id: String>`
> 
> Draws a sphere via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawtext`
> **Parameters:** `<id: String>`
> 
> Draws a text via the Debug Drawer module
> 
> `GameDirectors`

> ### `/drawvolume`
> **Parameters:** `<startPos: Location>` • `<endPos: Location>` • `<id: String>`
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
> **Parameters:** `<shapeId: String>` • `<colorRed: Integer>` • `<colorGreen: Integer>` • `<colorBlue: Integer>`
> 
> Sets the draw color
> 
> `GameDirectors`

> ### `/entitycount`
> **Parameters:** `<targets: EntitySelector>` • `<fakeplayer: String>` • `<objective: String>`
> 
> Returns the count of all loaded targets to a fakeplayer's scoreboard objective
> 
> `GameDirectors`

> ### `/remove`
> **Parameters:** `<targets: EntitySelector>`
> 
> Removes entites from the world
> 
> `GameDirectors`

> ### `/rotate`
> **Parameters:** `[target: EntitySelector]` • `[rotationX: Float]` • `[rotationY: Float]`
> 
> Rotates an entity
> 
> `GameDirectors`

> ### `/setonfire`
> **Parameters:** `<targets: EntitySelector>` • `[timeSeconds: Float]` • `[useEffects: Boolean]`
> 
> Sets the target entities on fire
> 
> `GameDirectors`

> ### `/spawnitem`
> **Parameters:** `<item: ItemType>` • `<location: Location>` • `[quantity: Integer]`
> 
> Summons an item entity
> 
> `GameDirectors`

> ### `/top`
> **Parameters:** `[target: EntitySelector]` • `[minHeight: Float]`
> 
> Teleports the target to the top most block at their position
> 
> `GameDirectors`

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

> ### `/tpspawnpoint`
> **Parameters:** `[target: PlayerSelector]`
> 
> Teleports the target to their spawnpoint
> 
> `GameDirectors`

> ### `/tpworldspawn`
> **Parameters:** `[target: PlayerSelector]`
> 
> Teleports the target to the world spawn point
> 
> `GameDirectors`

> ### `/unvanish`
> **Parameters:** `[player: PlayerSelector]` • `[tpBack: Boolean]`
> 
> Go out of spectator mode and optionally return to original position when exiting
> 
> `GameDirectors`

> ### `/uv`
> **Parameters:** `[player: PlayerSelector]` • `[tpBack: Boolean]`
> 
> Go out of spectator mode and optionally return to original position when exiting
> 
> `GameDirectors` • *Alias of `/unvanish`*

> ### `/vanish`
> **Parameters:** `[player: PlayerSelector]`
> 
> Go into spectator mode and optionally return to original position when exiting
> 
> `GameDirectors`

> ### `/v`
> **Parameters:** `[player: PlayerSelector]`
> 
> Go into spectator mode and optionally return to original position when exiting
> 
> `GameDirectors` • *Alias of `/vanish`*

> ### `/structurelist`
> 
> list all the structures on the world
> 
> `Admin`

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

