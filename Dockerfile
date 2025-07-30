# --------------------
# Stage 1: Base ASP.NET Runtime
# --------------------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

# --------------------
# Stage 2: Build .NET + React App
# --------------------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# ✅ Install Node.js required for esproj build
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    node -v && npm -v

# ✅ Copy full source
COPY . .

# ✅ Restore and publish (React + .NET)
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# --------------------
# Stage 3: Final Image
# --------------------
FROM base AS final

# Copy published app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Neo4j.Server.dll"]
