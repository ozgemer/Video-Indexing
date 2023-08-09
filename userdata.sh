#!/bin/bash
sudo yum install jq -y
sudo yum install git -y
echo -e "Host github.com\n\tStrictHostKeyChecking no" > ~/.ssh/config
chmod 600 ~/.ssh/config
aws ssm get-parameter --name id_rsa.pub --with-decryption --query Parameter.Value --output text > ~/.ssh/id_rsa.pub && chmod 400 ~/.ssh/id_rsa.pub
aws ssm get-parameter --name id_rsa --with-decryption --query Parameter.Value --output text > ~/.ssh/id_rsa && chmod 400 ~/.ssh/id_rsa
git clone git@github.com:Video-Indexing/Video-Indexing.git
sudo yum install docker -y
sudo usermod -a -G docker ec2-user
newgrp docker
sudo systemctl enable docker.service
sudo systemctl start docker.service
cd Video-Indexing/Node_Web_Server
chmod +x node_up.sh
node_up.sh