# --------------------
# Stage 1: Build React App
# --------------------
FROM node:18-alpine AS frontend-builder
WORKDIR /app

# Copy React app
COPY ../neo4j.client ./neo4j.client

# Install dependencies and build
WORKDIR /app/neo4j.client
RUN npm install && npm run build

# --------------------
# Stage 2: Build .NET App
# --------------------
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Copy backend project
COPY . ./Neo4j.Server
WORKDIR /src/Neo4j.Server

# Restore, build, publish
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# --------------------
# Stage 3: Final Image
# --------------------
FROM base AS final

# Copy published backend
COPY --from=build /app/publish .

# Copy built frontend into wwwroot
COPY --from=frontend-builder /app/neo4j.client/dist ./wwwroot

ENTRYPOINT ["dotnet", "Neo4j.Server.dll"]
