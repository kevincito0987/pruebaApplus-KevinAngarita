# 1. Usamos la imagen base de Python 3.12 (Debian 12 Bookworm)
FROM mcr.microsoft.com/devcontainers/python:1-3.12-bookworm

# 2. ELIMINAR EL REPOSITORIO PROBLEMÁTICO DE YARN
RUN rm -f /etc/apt/sources.list.d/yarn.list

# 3. ACTUALIZAR E INSTALAR NODE.JS Y PNPM
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    curl \
    gnupg2

# Instalar Node.js v20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# --- NUEVO: Habilitar e instalar pnpm ---
RUN corepack enable && corepack prepare pnpm@latest --activate
# ----------------------------------------

# 4. INSTALAR HERRAMIENTAS DE SQL SERVER (Drivers v18)
RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /usr/share/keyrings/microsoft-prod.gpg && \
    curl https://packages.microsoft.com/config/debian/12/prod.list | tee /etc/apt/sources.list.d/microsoft-prod.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 mssql-tools18 unixodbc-dev

# 5. CREAR EL ENLACE SIMBÓLICO PARA SQLCMD
RUN ln -s /opt/mssql-tools18/bin/sqlcmd /usr/local/bin/sqlcmd

# Limpieza para reducir el peso de la imagen
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces

CMD ["tail", "-f", "/dev/null"]