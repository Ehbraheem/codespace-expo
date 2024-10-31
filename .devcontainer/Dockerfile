FROM mcr.microsoft.com/devcontainers/universal:latest

LABEL maintainer "Bolatan Ibrahim"

ENV DEBIAN_FRONTEND noninteractive

WORKDIR $HOME/Android/Sdk/cmdline-tools
# Install additional packages
RUN sudo apt-get update && \
    sudo apt install -y curl sudo wget unzip bzip2 libdrm-dev libxkbcommon-dev libgbm-dev libasound-dev libnss3 libxcursor1 libpulse-dev libxshmfence-dev xauth xvfb x11vnc fluxbox wmctrl libdbus-glib-1-2 && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O tools.zip && \
    unzip tools.zip -d ~/Android/Sdk && \
    rm tools.zip && \
    npm install -g eas-cli expo-cli appium --unsafe-perm=true --allow-root && \
    appium driver install uiautomator2 && \
    yes Y | ./bin/sdkmanager --licenses --sdk_root=. && \
    echo "export ANDROID_SDK_ROOT=$HOME/Android/Sdk" >> ~/.bashrc && \
    echo "export PATH=\$PATH:\$ANDROID_SDK_ROOT/cmdline-tools/latest/bin" >> ~/.bashrc && \
    echo "export PATH=\$PATH:\$ANDROID_SDK_ROOT/platform-tools" >> ~/.bashrc && \
    yes Y | ./bin/sdkmanager --verbose --no_https "platform-tools" "platforms;android-34" "build-tools;34" "system-images;android-34.0.0;google_apis;x86_64" "emulator" "ndk-bundle"


# Create the emulator
ARG EMULATOR_NAME="nexus"
ARG EMULATOR_DEVICE="Nexus 6"
ENV EMULATOR_NAME=$EMULATOR_NAME
ENV DEVICE_NAME=$EMULATOR_DEVICE
RUN echo "no" | ./bin/avdmanager --verbose create avd --force --name "${EMULATOR_NAME}" --device "${EMULATOR_DEVICE}" --package "${EMULATOR_PACKAGE}"

#===================
# Alias
#===================
ENV EMU=./start_emu.sh
ENV EMU_HEADLESS=./start_emu_headless.sh
ENV VNC=./start_vnc.sh
ENV APPIUM=./start_appium.sh

#===================
# Ports
#===================
ENV APPIUM_PORT=4723

#=========================
# Copying Scripts to root
#=========================
COPY . /

RUN chmod a+x start_vnc.sh && \
    chmod a+x start_emu.sh && \
    chmod a+x start_appium.sh && \
    chmod a+x start_emu_headless.sh

#=======================
# framework entry point
#=======================
CMD [ "/bin/bash" ]
