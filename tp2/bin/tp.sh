#!/bin/bash

OPTIONS=""
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -a|--algo)
    ALGO="$2"
    shift
    ;;
    -e|--ex_path)
    EX_PATH="$2"
    shift
    ;;
    -p|--print|-t|--time)
    OPTIONS="${OPTIONS}${1}"
    ;;
    *)
        echo "Argument inconnu: ${1}"
        exit
    ;;
esac
shift
done

node ../index.js $ALGO $EX_PATH $OPTIONS
