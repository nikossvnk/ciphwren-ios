#!/bin/bash

set -e

# Where the bundles are uploaded to and served from (your own host): these have to be set
SSH_HOST=${SSH_HOST:?SSH_HOST must be set}
SSH_PORT=${SSH_PORT:-22}
SSH_USER=${SSH_USER:?SSH_USER must be set}
SSH_TARGET_DIR=${SSH_TARGET_DIR:?SSH_TARGET_DIR must be set}

OUTPUTDIR='dist'

PUBLIC_URL=${PUBLIC_URL:?PUBLIC_URL must be set}
DEPLOY_PATH='release'
# DEPLOY_PATH='test'

APP_VERSION=5

yarn lint --max-warnings 0
yarn tsc

rm -rf "$OUTPUTDIR"
yarn run expo export --dump-sourcemap --public-url ${PUBLIC_URL}/${DEPLOY_PATH}/${APP_VERSION}
rsync -e "ssh -p ${SSH_PORT}" -P --delete --exclude '*android*' -rvc -zz ${OUTPUTDIR}/ ${SSH_USER}@${SSH_HOST}:${SSH_TARGET_DIR}/${DEPLOY_PATH}/${APP_VERSION}
