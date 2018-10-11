#!/bin/bash

# grab commits since the last if this tag doesn't already exist otherwise grab commits since second to last
if [ -z "$(git ls-remote origin refs/tags/$BUILD_TAG)" ]; then
    LAST_TAG=`git describe --tags --abbrev=0`
    git log $LAST_TAG..HEAD --pretty=tformat:"• %s"
else
    LAST_TAG=`git describe --tags --abbrev=0`
    SECOND_TO_LAST_TAG=`git describe --tags --abbrev=0 $LAST_TAG^`
    git log $SECOND_TO_LAST_TAG..HEAD --pretty=tformat:"• %s"
fi