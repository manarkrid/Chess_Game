FROM jenkins/jenkins:2.528.3-jdk21

USER root

# Install Docker CLI from static binaries (no apt needed)
RUN curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-24.0.7.tgz -o /tmp/docker.tgz && \
    tar -xzf /tmp/docker.tgz -C /tmp && \
    mv /tmp/docker/docker /usr/local/bin/ && \
    rm -rf /tmp/docker /tmp/docker.tgz

# Install Node.js from official binaries (no apt needed)
RUN curl -fsSL https://nodejs.org/dist/v20.9.1/node-v20.9.1-linux-x64.tar.xz -o /tmp/node.tar.xz && \
    tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 && \
    rm /tmp/node.tar.xz

USER jenkins

# Jenkins plugins
RUN jenkins-plugin-cli --plugins blueocean docker-workflow json-path-api
