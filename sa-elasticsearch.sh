cat <<EOF | oc create -n packetbeat -f -
kind: ServiceAccount
apiVersion: v1
metadata:
  name: elasticsearch 
EOF
