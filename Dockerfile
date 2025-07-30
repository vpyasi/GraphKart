# Use .NET SDK image for build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# -------------------------------
# Install Node.js (required for React projects)
# -------------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    node -v && npm -v

WORKDIR /src
COPY ["Neo4j.Server/Neo4j.Server.csproj", "Neo4j.Server/"]
RUN dotnet restore "Neo4j.Server/Neo4j.Server.csproj"

COPY . .
WORKDIR "/src/Neo4j.Server"
RUN dotnet build "Neo4j.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Neo4j.Server.csproj" -c Release -o /app/publish

# Use ASP.NET runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "Neo4j.Server.dll"]
