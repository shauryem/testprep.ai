## Setup Instructions for Node v20.5.0 MacOS

### Step 1: Install Node.js
Ensure you have Node.js version v20.5.0 installed on your system. You can download it from [Node.js official website](https://nodejs.org/).

First, ensure you have `nvm` (Node Version Manager) installed which allows you to manage multiple Node.js versions. You can install `nvm` by running the following command in your terminal:

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
nvm install v20.5.0
nvm use v20.5.0

### Step 2: Install Expo CLI
Open your terminal and install Expo CLI globally using npm:
npm install -g expo-cli

### Step 3: Install Dependencies
npm install

### Step 5: Start the development server
Run the following command to start the Expo development server:
npm run web
