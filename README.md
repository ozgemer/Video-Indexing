# Video-Indexing

Website mockup: https://www.figma.com/file/GwpH6vcDA5baSgNtGLSjIp/Video-Indexing-Mockup?node-id=0%3A1&t=cRK77DRZUfs4Qb4u-1 

## Prerequisites
* install docker
* add to Video-Indexing/Node_Web_Server .env file:
  ```
    STATUS = development
    ALGO_PROD_URL = "http://172.20.0.11"
    ALGO_DEV_URL = "http://172.20.0.11"
    ALGO_PROD_PORT=8080
    ALGO_DEV_PORT = 8080
    VIP_MAIL_USR = "ooosivip@gmail.com"
    VIP_MAIL_PSW = "XXXXXXXXXXXXXXXXXXX"
    
    FIREBASE_CONFIG = {
        apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXX",
        authDomain: "video-indexing-project.firebaseapp.com",
        projectId: "video-indexing-project",
        storageBucket: "video-indexing-project.appspot.com",
        messagingSenderId: "135604416968",
        appId: "1:135604416968:web:b03e6d36113324991f10fd"
    };
  ```
* add to Video-Indexing/Algo_Web_Server apikey.py file with your chatGPT apikey:
  ```
   api_key = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  ```

## Instructions to run the app on unix base systems:
* Build - run the `build_images_unix.sh`
* Run - run the `run_local_unix.sh`
* Clean - run the `clean_env_unix.sh`
* you may need to `chmod +x` to the above files before

## Instructions to run the app on windows:
* Build - run the `build_images_windows.bat`
* Run - run the `run_local_windows.bat`
* Clean - run the `clean_env_windows.bat`
