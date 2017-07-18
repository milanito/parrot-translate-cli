# Parrot CLI

[![CircleCI](https://circleci.com/gh/milanito/parrot-translate-cli.svg?style=svg)](https://circleci.com/gh/milanito/parrot-translate-cli) [![npm version](https://badge.fury.io/js/parrot-translate-cli.svg)](https://badge.fury.io/js/parrot-translate-cli) [![GitHub issues](https://img.shields.io/github/issues/milanito/parrot-translate-cli.svg)](https://github.com/milanito/parrot-translate-cli/issues) [![GitHub stars](https://img.shields.io/github/stars/milanito/parrot-translate-cli.svg)](https://github.com/milanito/parrot-translate-cli/stargazers)

This module is a CLI tool for any [parrot](http://anthonynsimon.com/parrot.github.io/) backend.

> I made this because I needed specific actions, if you need any other, please feel free to open an issue, or even  an PR :)

## Installation

Simply install the package globally :

    $ npm install --global parrot-translate-cli
    $ yarn global add parrot-translate-cli

You will be able to use the following command `parrot-cli`.

## Usage

### Display help

Simply enter the command without any action

    $ parrot-cli

It will display the help :

```
Usage: parrot [options] [command]


Commands:

login|l                  Login to the parrot backend
logout                   Logout of the parrot backend
info|i                   Info about the user
import-keys|ik           Import keys to project
import-locale-keys|ilk   Import keys to locale for a project
help [cmd]               display help for [cmd]

This is the parrot CLI

Options:

-h, --help     output usage information
-V, --version  output the version number
```
### Actions

You first need need to login using the `login` action

    $ parrot-cli login

You will be asked for your parrot backend address (something like `https://localhost` when testing locally), email and password.

You can then check your information using the `info` command :

    $ parrot-cli info

It will display something like this :

```
info: Host  https://localhost
info: Email  your@email.com
```

You can then start the other actions :

- `import-keys` : This action imports keys to a specific project. It requires the `-f` option with a path to the JSON file. It will prompt for the project
- `import-locale-keys` : This action imports translations for a specific locale to a specific project. It requires the `-f` option with a path to the JSON file. It will prompt for the project and then the locale

## Format

For the moment, the imports for keys and strings support [i18next](https://www.i18next.com/) format:

```
{
  "key": "value",
  "keyDeep": {
    "inner": "value"
  },
  ...
}
```

> It will then work on flat JSON

## License

MIT
