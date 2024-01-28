# Commands

This document provides a detailed description of the available commands in the application.

## Command List

- `help`: Show available commands
- `search <type> [search <string>] [state <on/off>] [type <before/after>]` : Search for modules
- `disable <module>`: Disable a module
- `enable <module>`: Enable a module
- `interval <module> <interval>`: Set the interval of a scoreboard module
- `scoreboard <module> <string>`: Set the scoreboard of a scoreboard module
- `code <module> <subcommand> [args...]`: Set the code of an event module
- `resetdata <CONFIRM>`: Reset all addon data (confirmation required)
- `methods <module>`: Show available methods of an event module
- `source <module> <subcommand> [args...]`: Set the source of an event module
- `bytes <module|all|total>`: Show the amount of bytes used by a module

## Command Details

### `help`

Displays a list of all available commands.

### `search <type> [search <string>] [state <on/off>] [type <before/after>]`

Searches for modules. Subcommands:

- `help`: Shows usage of the search command
- `all`: Searches all modules
- `score`: Searches scoreboard modules
- `event`: Searches event modules

optional arguments:

- `search`: Searches for modules with the specified search string
- `type`: Searches for modules of the specified event type (before, after)
- `state`: Searches for modules of the specified state (on, off, true, false)

### `disable <module>`

Disables a module. Requires the name of the module as an argument.

### `enable <module>`

Enables a module. Requires the name of the module as an argument.

### `interval <module> <interval>`

Sets the interval of a scoreboard module. Requires the name of the module and the interval as arguments.

### `scoreboard <module> <string>`

Sets the scoreboard of a scoreboard module. Requires the name of the module and the scoreboard as arguments.

### `code <module>`

Manages the code of an event module. Subcommands:

- `add`: Adds a line of code to the module
- `remove`: Removes a line of code from the module
- `set`: Sets a line of code in the module
- `setall`: Sets all code of the module
- `show`: Shows the code of the module
- `show compiled`: Shows the compiled code of the module

### `resetdata <CONFIRM>`

Resets all addon data. Requires "CONFIRM" as the first argument to confirm the action.

### `methods <module>`

Shows available methods of an event module. Requires the name of the module as an argument. Specifying a method will show methods of the method.

### `source <module>`

Sets the source of an event module. Subcommands:

- `show`: Shows the source of the module
- `available`: Shows available sources for the module
- `set`: Sets the source of the module

### `bytes`

- `all | total`: Shows the total amount of bytes used by all modules
- `<module>`: Shows the amount of bytes used by the specified module
