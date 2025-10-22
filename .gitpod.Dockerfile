FROM gitpod/workspace-full-vnc:latest

# install updates
RUN sudo DEBIAN_FRONTEND=noninteractive apt-get update

# Install Electron dependencies
RUN sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
        libgtk-3-0 \
        libnss3 \
        libasound2 \
        libgbm1

# Install playwright dependencies
RUN sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
        libnss3 \
        libnspr4 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libdrm2 \
        libxkbcommon0 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxrandr2 \
        libgbm1 \
        libatspi2.0-0 \
        libwayland-client0 \
        fakeroot

# Install AppImage dependencies
RUN sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
        fuse \
        libfuse2


# Install nodeJs
RUN bash -c ". .nvm/nvm.sh \
    && nvm install 22.21.0 \
    && nvm use 22.21.0 \
    && nvm alias default 22.21.0"

RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix
