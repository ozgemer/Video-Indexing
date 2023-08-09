#!/bin/bash
cd Algo_Web_Server
docker compose up -d
cd ..
cd Node_Web_Server
docker build -t node_server .
docker run -it -p 5050:5050 --name node_server --ip 172.20.0.11  --network inner-network node_server