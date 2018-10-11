#!/bin/bash

find ./android -type file \( -name '*.gradle' -or -name '*.properties' -or -name '*.xml' -or -name '*.json' -or -name 'BUCK' -or -name '*.java' \) -exec sed -i '' "s/com.buzznog.catalyst.WhitneyPaige.debug/$1/g" {} \;