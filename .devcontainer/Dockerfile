FROM mcr.microsoft.com/devcontainers/universal:latest

LABEL maintainer "Bolatan Ibrahim"

# Create non-root user
ARG USERNAME=vscode
ARG USER_UID=1001
ARG USER_GID=$USER_UID

# Environment variables
ENV DEBIAN_FRONTEND=noninteractive \
  ANDROID_SDK_ROOT=/home/$USERNAME/Android/Sdk \
  QT_DEBUG_PLUGINS=1 \
  DISPLAY=:99

ENV ANDROID_AVD_HOME=/home/$USERNAME/.android/avd \
  ANDROID_HOME=$ANDROID_SDK_ROOT

ENV PATH=${PATH}:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools:${ANDROID_SDK_ROOT}/emulator:/opt/scripts

# Install system dependencies
RUN apt-get update && apt-get install -y \
    # Core utilities
    curl \
    wget \
    unzip \
    # KVM essentials
    qemu-kvm \
    libvirt-daemon-system \
    # X11 and display core
    libdrm-dev \
    libxkbcommon-dev \
    libnss3 \
    libxcursor1 \
    xauth \
    xvfb \
    x11vnc \
    # Qt dependencies
    libxcb-cursor0 \
    libxcb-icccm4 \
    libxcb-image0 \
    libxcb-keysyms1 \
    libxcb-randr0 \
    qt5-default \
    && rm -rf /var/lib/apt/lists/*


# Create the user and add to KVM group
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && usermod -aG kvm $USERNAME \
    && usermod -aG libvirt $USERNAME \
    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    && mkdir -p /workspaces \
    && chown -R $USERNAME:$USERNAME /workspaces

# Set KVM permissions
RUN mkdir -p /dev/kvm \
    && chown root:kvm /dev/kvm \
    && chmod 660 /dev/kvm

# Switch to user and setup Android SDK
USER $USERNAME
WORKDIR /home/$USERNAME

# Download and setup Android SDK
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools && \
    cd $ANDROID_SDK_ROOT/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O tools.zip && \
    unzip tools.zip && \
    mv cmdline-tools latest && \
    rm tools.zip


# Accept licenses and install Android components
RUN cd $ANDROID_SDK_ROOT/cmdline-tools/latest/bin && \
    yes Y | ./sdkmanager --licenses --sdk_root=$ANDROID_SDK_ROOT && \
    ./sdkmanager --verbose \
    "platform-tools" \
    "platforms;android-34" \
    "build-tools;34.0.0" \
    "system-images;android-34;google_apis;x86_64" \
    "emulator" \
    "ndk-bundle"


# Install Node.js packages
RUN sudo npm install -g eas-cli expo-cli appium --unsafe-perm=true --allow-root && \
  sudo appium driver install uiautomator2


# Configure emulator
ARG EMULATOR_NAME="nexus"
ARG EMULATOR_DEVICE="Nexus 6"
ENV EMULATOR_NAME=${EMULATOR_NAME} \
  DEVICE_NAME=${EMULATOR_DEVICE} \
  EMU=/opt/scripts/start_emu.sh \
  EMU_HEADLESS=/opt/scripts/start_emu_headless.sh \
  VNC=/opt/scripts/start_vnc.sh \
  APPIUM=/opt/scripts/start_appium.sh

RUN cd $ANDROID_SDK_ROOT/cmdline-tools/latest/bin && \
  echo "no" | ./avdmanager create avd \
  --force \
  --name "${EMULATOR_NAME}" \
  --device "${EMULATOR_DEVICE}" \
  --package "system-images;android-34;google_apis;x86_64"



# Copy and setup scripts
COPY --chown=$USERNAME:$USERNAME scripts/ /opt/scripts/

RUN sudo chmod +x /opt/scripts/*.sh && \
  echo "alias emu='${EMU}'" >> ~/.bashrc && \
  echo "alias vnc='${VNC}'" >> ~/.bashrc && \
  echo "alias appium='${APPIUM}'" >> ~/.bashrc


WORKDIR /workspaces

# Expose ports
EXPOSE 5900 \
  5554-5556 \
  4723-4728 \
  5037

