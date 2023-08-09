FROM python:3.10-slim

# install git
RUN apt-get update && apt-get install git -y

# install openai-whisper
RUN pip3 install "git+https://github.com/openai/whisper.git" 
RUN apt-get install -y ffmpeg

RUN pip3 install setuptools
RUN pip3 install wheel

# copy Algo_Web_Server into container
COPY . /Algo_Web_Server

# cd Algo_Web_Server
WORKDIR /Algo_Web_Server

# install requirements
RUN pip3 install --no-cache-dir -r requirements.txt

# ENTRYPOINT [ "/bin/bash" ]
ENTRYPOINT [ "python", "-m", "algo_server.py" ]
