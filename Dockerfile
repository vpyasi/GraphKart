# --------- BUILD STAGE ---------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Install Node.js (for React)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy .NET project and restore
COPY ["Neo4j.Server/Neo4j.Server.csproj", "Neo4j.Server/"]
RUN dotnet restore "Neo4j.Server/Neo4j.Server.csproj"

# Copy everything
COPY . .

# Build React frontend
WORKDIR /app/Neo4j.Client
RUN npm install && npm run build

# Copy built React app into .NET project wwwroot
RUN cp -r dist/* ../Neo4j.Server/wwwroot/

# Build .NET backend
WORKDIR /app/Neo4j.Server
RUN dotnet build -c Release -o /build
RUN dotnet publish -c Release -o /publish

# --------- RUNTIME STAGE ---------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Copy published .NET app
COPY --from=build /publish .

ENTRYPOINT ["dotnet", "Neo4j.Server.dll"]
