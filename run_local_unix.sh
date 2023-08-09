docker network create --driver=bridge --subnet=172.20.0.0/16 --ip-range=172.20.0.0/24 video_indexing
docker run -d --name algo --ip=172.20.0.11 --network video_indexing algo_server
docker run -d --name front -p 3000:3000 --network video_indexing front
docker run -d --name node -p 5050:5050 --ip=172.20.0.12 --network video_indexing node_server 