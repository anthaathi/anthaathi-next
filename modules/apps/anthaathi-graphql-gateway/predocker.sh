#!/bin/zsh

echo "Running predocker.sh"

filepath=$(pwd)

arg1="${1:-../../../..}"

rm -rf $filepath/docker-build

cd ../../..

find . -name package.json  ! -path '*/.yarn/*' ! -path '*/node_modules/*' ! -path '*/.wireit/*' | while read line; do
	mkdir -p $filepath/docker-build/$(dirname $line)
	cp $line $filepath/docker-build/$(dirname $line)
done

cp yarn.lock $filepath/docker-build
cp .yarnrc.yml $filepath/docker-build
rsync -q -av --exclude='unplugged' --exclude='install-state.gz' .yarn/ $filepath/docker-build/.yarn

cd $filepath
