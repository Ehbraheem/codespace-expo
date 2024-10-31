FROM mcr.microsoft.com/devcontainers/universal:latest

LABEL maintainer "Bolatan Ibrahim"

# Create non-root user
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Create the user
RUN groupadd --gid $USER_GID $USERNAME \
  && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
  && apt-get update \
  && apt-get install -y sudo \
  && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
  && chmod 0440 /etc/sudoers.d/$USERNAME

# Environment variables
ENV DEBIAN_FRONTEND=noninteractive \
  ANDROID_SDK_ROOT=/home/$USERNAME/Android/Sdk \
  PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools \
  PATH=${PATH}:/opt/scripts

# Install system dependencies
RUN apt-get update && apt-get install -y \
  curl \
  wget \
  unzip \
  bzip2 \
  libdrm-dev \
  libxkbcommon-dev \
  libgbm-dev \
  libasound-dev \
  libnss3 \
  libxcursor1 \
  libpulse-dev \
  libxshmfence-dev \
  xauth \
  xvfb \
  x11vnc \
  fluxbox \
  wmctrl \
  libdbus-glib-1-2 \
  && rm -rf /var/lib/apt/lists/*

USER $USERNAME

# Setup Android SDK
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools && \
  wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O tools.zip && \
  unzip tools.zip -d $ANDROID_SDK_ROOT/cmdline-tools && \
  mv $ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest && \
  rm tools.zip


# Install Node.js packages
RUN sudo npm install -g eas-cli expo-cli appium --unsafe-perm=true --allow-root && \
  sudo appium driver install uiautomator2


# Setup Android tools and accept licenses
RUN yes Y | sdkmanager --licenses --sdk_root=${ANDROID_SDK_ROOT} && \
  sdkmanager --verbose \
  "platform-tools" \
  "platforms;android-34" \
  "build-tools;34.0.0" \
  "system-images;android-34;google_apis;x86_64" \
  "emulator" \
  "ndk-bundle"

# Configure emulator
ARG EMULATOR_NAME="nexus"
ARG EMULATOR_DEVICE="Nexus 6"
ENV EMULATOR_NAME=${EMULATOR_NAME} \
  DEVICE_NAME=${EMULATOR_DEVICE} \
  EMU=/opt/scripts/start_emu.sh \
  EMU_HEADLESS=/opt/scripts/start_emu_headless.sh \
  VNC=/opt/scripts/start_vnc.sh \
  APPIUM=/opt/scripts/start_appium.sh

RUN echo "no" | avdmanager create avd \
  --force \
  --name "${EMULATOR_NAME}" \
  --device "${EMULATOR_DEVICE}" \
  --package "system-images;android-34;google_apis;x86_64"



# Copy and setup scripts
COPY --chown=$USERNAME:$USERNAME scripts/ /opt/scripts/
RUN sudo chmod +x /opt/scripts/*.sh \
  echo "alias emu='${EMU}'" >> ~/.bashrc && \
  echo "alias vnc='${VNC}'" >> ~/.bashrc && \
  echo "alias appium='${APPIUM}'" >> ~/.bashrc


WORKDIR /workspaces

# Expose ports
EXPOSE 5900 \
  5554-5556 \
  4723-4728 \
  5037

