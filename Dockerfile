# ---- Base image for .NET SDK ----
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Install Node.js (for React build)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    node -v && npm -v

# Set working directory
WORKDIR /src

# Restore backend dependencies
COPY Neo4j/Server/Neo4j.Server.csproj Neo4j/Server/
RUN dotnet restore "Neo4j/Server/Neo4j.Server.csproj"

# Copy entire source
COPY Neo4j /src/Neo4j

# Build frontend
WORKDIR /src/Neo4j/neo4j.client
RUN npm install && npm run build

# Build backend
WORKDIR /src/Neo4j/neo4j.Server
RUN dotnet build "Neo4j.Server.csproj" -c Release -o /app/build

# ---- Publish .NET app ----
FROM build AS publish
RUN dotnet publish "Neo4j.Server.csproj" -c Release -o /app/publish

# ---- Final runtime image ----
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Copy backend publish output
COPY --from=publish /app/publish .

# Copy built React frontend to wwwroot
COPY --from=build /src/Neo4j/neo4j.client/dist ./wwwroot

ENTRYPOINT ["dotnet", "Neo4j.Server.dll"]
