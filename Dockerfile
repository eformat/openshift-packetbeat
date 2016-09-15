FROM centos:7

RUN yum -y install libpcap wget net-tools && yum update -y && yum clean all -y

WORKDIR /opt/
ENV VERSION=1.3.0 ARCH=x86_64 EXTENSION=tar.gz
ENV FILENAME=packetbeat-${VERSION}-${ARCH}.${EXTENSION}

RUN wget https://download.elastic.co/beats/packetbeat/${FILENAME} && tar zxvf ${FILENAME}

WORKDIR packetbeat-${VERSION}-${ARCH}
#ADD packetbeat.yml packetbeat.yml

RUN setcap cap_net_raw=ep /opt/packetbeat-${VERSION}-${ARCH}/packetbeat
CMD ["./packetbeat", "-e", "-c=/opt/packetbeat-${VERSION}-${ARCH}/config/packetbeat.yml"]
