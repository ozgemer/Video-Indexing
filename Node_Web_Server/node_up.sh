#!/bin/bash
docker build -t node_server .
docker run -it -p 5050:5050 --name node_server node_server