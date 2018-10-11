#!/bin/bash

BUILD_NUMBER=`git rev-list HEAD --count`
NPM_PACKAGE_VERSION=`node -e "console.log(require('./package.json').version);"`

echo -e "v${NPM_PACKAGE_VERSION}+${BUILD_NUMBER}"