
### Create the packetbeat image

oc new-app https://github.com/noelo/openshift-packetbeat.git --strategy=docker -o yaml > packetbeat.yaml

### Create the sample app and add the packetbeat image as a sidecar

oc new-app https://github.com/openshift/nodejs-ex -l name=myapp -o yaml > sample-node-app.yaml

Edit and add the sidecar image

```
spec:
      containers:
      - image: 172.30.93.103:5000/packetbeat/nodejs-ex
        imagePullPolicy: Always
        name: nodejs-ex
        ports:
        - containerPort: 8080
          protocol: TCP
        resources: {}
        terminationMessagePath: /dev/termination-log
      - image: 172.30.93.103:5000/packetbeat/openshift-packetbeat:latest
        imagePullPolicy: Always
        name: packetbeat
        resources: {}
        terminationMessagePath: /dev/termination-log
```


### Add a config map to configure packetbeat

oc create configmap packetbeat-config --from-file=packetbeat.yml

oc volume dc/nodejs-ex --add --overwrite -t configmap --configmap-name=packetbeat-config --name=packetbeat-config-volume-1 -m=/opt/packetbeat-1.3.0-x86_64/config


## Docker commands for non-OSE environments
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
