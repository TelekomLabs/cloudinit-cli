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
