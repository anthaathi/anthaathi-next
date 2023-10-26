#!/bin/bash

echo "$(ip a | grep 172.17 | grep -oP '(?<=inet\s)\d+\.\d+\.\d+\.\d+'):4443"
