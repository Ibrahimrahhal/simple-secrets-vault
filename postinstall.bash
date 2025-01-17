#!/bin/bash

# Determine the user's shell configuration file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - check for both bash and zsh
    if [[ "$SHELL" == *"zsh"* ]]; then
        config_file="$HOME/.zshrc"
    else
        config_file="$HOME/.bash_profile"
    fi
else
    # Linux
    config_file="$HOME/.bashrc"
fi

# Function definition to be added
function_def='
local-vault() {
    local vault_path
    vault_path="$(npm bin)/simple-local-vault"
    local global_vault_path
    global_vault_path="$(npm root -g)/@ibrahim-rahhal/simple-secrets-vault/bin/index"
    
    # Check if the file exists locally or globally
    if [[ ! -f "$vault_path" ]] && [[ ! -f "$global_vault_path" ]]; then
        echo "local-vault script not found. Have you installed the package?"
        return 1
    fi

    # Use global path if local not found
    if [[ ! -f "$vault_path" ]]; then
        vault_path="$global_vault_path"
    fi

    # Source the script and pass all arguments
    source "$vault_path" "$@"
}'

# Check if function already exists
if ! grep -q "local_vault()" "$config_file"; then
    # Add the function to the shell configuration file
    echo "$function_def" >> "$config_file"
    
    # Reload the configuration
    source "$config_file"
    
    echo "local_vault function has been added to $config_file"
else
    echo "local_vault function already exists in $config_file"
fi
