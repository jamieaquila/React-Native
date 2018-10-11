fastlane documentation
================
# Installation
```
sudo gem install fastlane
```
# Available Actions
### deploy
```
fastlane deploy 
```
Deploys an app specified with APP_ID env variable or with the `app:APP_ID` option.
### deploy_all
```
fastlane deploy_all
```
Attempts to deploy all apps in the database.
### provision
```
fastlane provision
```
Creating a code signing certificate and provisioning profiles for an app specified with APP_ID env variable or with the `app:APP_ID` option.
### environment
```
fastlane environment
```
Shows the current environmental variables.

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [https://fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [GitHub](https://github.com/fastlane/fastlane/tree/master/fastlane).
