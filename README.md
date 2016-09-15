

    docker build -t my_packetbeat .
    docker run --privileged --net host --name packetbeat -d my_packetbeat


kibana:
  image: kibana:latest
  container_name: kibana
  ports:
   - "5601:5601"
  environment:
   - ELASTICSEARCH_URL=http://elasticsearch:9200
  links:
   - elasticsearch

elasticsearch:
  container_name: elasticsearch
  image: elasticsearch:latest
  ports:
   - "9200:9200"
   - "9300:9300"
