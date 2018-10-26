#!/bin/sh

# copy git hooks into the repository
cp githooks/commit-msg/check-message .git/hooks/commit-msg

# remove example
rm .git/hooks/commit-msg.sample &>/dev/null | exit 0