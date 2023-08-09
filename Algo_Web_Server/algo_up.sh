docker build -t algo_server .
docker run -it -p 8080:8080 --name algo_server algo_server