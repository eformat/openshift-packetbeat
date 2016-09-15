FROM centos:7

RUN yum -y install libpcap wget
RUN yum update -y

ENV VERSION=1.3.0 ARCH=x86_64 EXTENSION=tar.gz
ENV FILENAME=packetbeat-${VERSION}-${ARCH}.${EXTENSION}

RUN wget https://download.elastic.co/beats/packetbeat/${FILENAME}
RUN tar zxvf ${FILENAME}

WORKDIR packetbeat-${VERSION}-${ARCH}
ADD packetbeat.yml packetbeat.yml

CMD ["./packetbeat", "-e", "-c=packetbeat.yml"]
