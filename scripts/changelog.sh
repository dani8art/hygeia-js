#!/bin/bash

RELEASE_REGEX=".*(-.*\.[0-99])"

if [[ "$1" =~ $RELEASE_REGEX ]]; then
    git log --pretty=format:'* %s (%h)' $(git describe --tags --abbrev=0)...HEAD
else
    git log --pretty=format:'* %s (%h)' $(git tag | grep -v next | sed -n 1p)...HEAD | grep -v chore
fi
