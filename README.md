# Cloudinit Cli

[![build status](https://secure.travis-ci.org/TelekomLabs/cloudinit-cli.png)](http://travis-ci.org/TelekomLabs/cloudinit-cli)

# Purpose

You may know the pain to configure a new machine with chef:
 
    nova boot ...
    browse the internet until your server is up
    assign public ip if your are using vpn
    knife bootstrap 10.123.10.123
    more commands to configure your nodes

It could be so simple

    nova boot yournode --flavor=2 --image=id --user-data serverconfig.sh
    get a cup of coffee and talk with others

This cli tool helps you to easily generate a bash or powershell file to use for cloudinit or copy paste on any remote machine.

# Installation

Prepare your OS with nodejs installation e.g. for Ubuntu

    apt-get update && apt-get install -y python-software-properties python g++ make && add-apt-repository -y ppa:chris-lea/node.js && apt-get update && apt-get install -y nodejs

Please have a look at [nodejs](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager) for other operating systems.

After nodejs is installed 

    npm install -g cloudinit-cli

# Usage

    Usage: cloudinit [options]

    Options:

      -h, --help               output usage information
      -V, --version            output the version number
      -i, --input [file]       chef dna or chef rols [file]
      -o, --outputfile [file]  generated cloudinit file
      -e, --env [name]         configuration environment [name]

Just run the tool on any dna or role json

    cloudinit -i test/files/dna.json -o dn.sh -e default

Now your are able to boot machine with the generated file

    nova boot gitlab --flavor=2 --image=yourimageid  --user-data ./dna.sh

Or just run the generated script on your target machine

    ./dna.sh

# Define your own environment

To define your own environment, create a `~/.cloudinit/YOURENVIRONMENT` folder and add the following two files:

 - `pk.key`
 - `settings.json`

The private key is your private chef-validator key. In `settings.json` are all your chef-configurations.

```json
{
    "chef": {
        "validator_key": "pk.key",
        "chef_server_url": "https://example.com/organizations/org",
        "validation_client_name": "yourvalidator"
    }
}
```

# Build cloudinit for unix and windows

    # generate unix cloudinit
    cloudinit -i test/files/dna.json -t unix
    # or just (unix is default)
    cloudinit -i test/files/dna.json

    # for windows
    cloudinit -i test/files/dna.json -t win

# What is supported 

 - read dna.json and generate a proper bash script to run on your server (see `test/files` for samples)
 - read a chef role and generate a proper bash script to run
 - linux and windows support
 - since the generated script is plain bash or powershell you can copy-paste or pipe it anywhere

# Roadmap

 - mocha tests
 - chef solo support
 - further improvements for bare metal deployment

# Reference

 - [Cloudinit](http://cloudinit.readthedocs.org/en/latest/)
 - [Cloudinit for Windows](https://github.com/cloudbase/cloudbase-init) 

# License

Company: Deutsche Telekom AG

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
