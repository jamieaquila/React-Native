#!/bin/bash

INFO='\033[00;32m'

NPM_PACKAGE_VERSION=`node -e "console.log(require('./package.json').version);"`
BUILD_NUMBER=`git rev-list HEAD --count`
BUILD_TAG="v$NPM_PACKAGE_VERSION+$BUILD_NUMBER"
DESCRIPTION="$NPM_PACKAGE_VERSION ($BUILD_NUMBER)"
TARGET_VERSION="${NPM_PACKAGE_VERSION%.*}.x"
DEPLOYMENT="In-House"

echo -e "${INFO}Targeting \"${DEPLOYMENT}\" (${TARGET_VERSION}) with ${BUILD_TAG}."

code-push release-react catalyst-mobileapp ios -d "${DEPLOYMENT}" -t "${TARGET_VERSION}" --description "${DESCRIPTION}"