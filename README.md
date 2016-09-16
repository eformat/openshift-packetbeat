
### Create the packetbeat image
```
oc new-app https://github.com/noelo/openshift-packetbeat.git --strategy=docker -o yaml > packetbeat.yaml
```
### Create the sample app and add the packetbeat image as a sidecar
```
oc new-app https://github.com/openshift/nodejs-ex -l name=myapp -o yaml > sample-node-app.yaml
```
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
```
oc create configmap packetbeat-config --from-file=packetbeat.yml

oc volume dc/nodejs-ex --add --overwrite -t configmap --configmap-name=packetbeat-config --name=packetbeat-config-volume-1 -m=/opt/packetbeat-1.3.0-x86_64/config

```

## Docker commands for non-OSE environments
docker build -t my_packetbeat .
docker run --privileged --net host --name packetbeat -d my_packetbeat


## Run Kibana and Elasticsearch

It should be possible to run using the Aggregated Logging privded with Openshift (which has RBAC). for
now, run packetbeat against in memory instances of ES, Kibana 

# Elasticsearch

    cat <<EOF | oc create -f -
    ---
      apiVersion: v1
      kind: ServiceAccount
      metadata:
        name: <elasticsearch></elasticsearch>
    EOF
    oc adm policy add-scc-to-user anyuid -z elasticsearch -n packetbeat

    oc import-image elasticsearch:latest --confirm
    oc create -f ./es-template.yaml
    oc new-app --template=es-template

    -- test
    ose-master1:~$ curl 172.30.138.29:9200
    {
      "name" : "Quasimodo",
      "cluster_name" : "elasticsearch",
      "version" : {
        "number" : "2.4.0",
        "build_hash" : "ce9f0c7394dee074091dd1bc4e9469251181fc55",
        "build_timestamp" : "2016-08-29T09:14:17Z",
        "build_snapshot" : false,
        "lucene_version" : "5.5.2"
      },
      "tagline" : "You Know, for Search"
    }

# Kibana

    cat <<EOF | oc create -f -
    ---
      apiVersion: v1
      kind: ServiceAccount
      metadata:
        name: kibana
    EOF
    oc adm policy add-scc-to-user anyuid -z kibana -n packetbeat

    oc import-image kibana:latest --confirm
    oc create -f ./kibana-template.yaml
    oc new-app --template=kibana-template
    oc expose svc kibana --hostname=kibana-packetbeat.apps.eformat.nz

