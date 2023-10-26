#!/bin/bash

# Sometimes container does not recognize this domain
sudo bash -c "sudo echo \"127.0.0.1 auth.anthaathi.localhost\" >> /etc/hosts"

export PATH=$PATH:$HOME/.dotnet/tools/

dotnet ef database update --context graphql_engine.Entity.Organization.AnthaathiOrganizationContext --project ./graphql-engine
dotnet ef database update --context graphql_engine.Entity.Form.AnthaathiFormContext --project ./graphql-engine
