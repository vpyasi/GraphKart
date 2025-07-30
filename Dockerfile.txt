# --- Build Stage ---
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

COPY Neo4j.Server/*.csproj ./Neo4j.Server/
RUN dotnet restore Neo4j.Server/Neo4j.Server.csproj

COPY . .
WORKDIR /src/Neo4j.Server
RUN dotnet publish -c Release -o /app/publish

# --- Runtime Stage ---
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Neo4j.Server.dll"]
