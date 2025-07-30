FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 7008

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["Neo4j.Server/Neo4j.Server.csproj", "Neo4j.Server/"]
RUN dotnet restore "Neo4j.Server/Neo4j.Server.csproj"
COPY . .
WORKDIR "/src/Neo4j.Server"
RUN dotnet build "Neo4j.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Neo4j.Server.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Neo4j.Server.dll"]
