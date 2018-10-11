#!/bin/bash

INFO='\033[00;32m'

NPM_PACKAGE_VERSION=`node -e "console.log(require('./package.json').version);"`
BUILD_NUMBER=`git rev-list HEAD --count`
BUILD_TAG="v$NPM_PACKAGE_VERSION+$BUILD_NUMBER"
DESCRIPTION="$NPM_PACKAGE_VERSION ($BUILD_NUMBER)"
TARGET_VERSION="${NPM_PACKAGE_VERSION%.*}.x"
SOURCE_DEPLOYMENT="In-House"
TARGET_DEPLOYMENT="App Store"

echo -e "${INFO}Promoting \"${SOURCE_DEPLOYMENT}\" to \"${TARGET_DEPLOYMENT}\"."

code-push promote catalyst-mobileapp "${SOURCE_DEPLOYMENT}" "${TARGET_DEPLOYMENT}"