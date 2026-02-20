# Matorral Project Setup Guide

This guide outlines the complete setup process for the **Matorral** project on a Linux environment, including cloning the repository, setting up the environment, installing dependencies, configuring environment variables, running migrations, creating a superuser, running the development server, executing tests, and running the project with Docker.

---

## 1. Clone the Repository and Switch Branch

```bash
git clone https://github.com/matorral-project/matorral.git
cd matorral
git checkout legacy-code
```

>Switching to `legacy-code` ensures you are working with the intended legacy branch.

---

## 2. Inspect the Project Files

After cloning, you can list the project structure:

```bash
ls
```

Typical project files include:

* `manage.py` – Django management script
* `config/` – Django settings and configuration
* `matorral/` – Application source code
* `pyproject.toml` – Project configuration for Hatch
* `Dockerfile`, `docker-compose.yml` – For containerization

---

## 3. Install Hatch (Python Project Manager)

Hatch is used to manage virtual environments and dependencies.

```bash
# Install pipx if not already installed
sudo apt install pipx

# Ensure pipx binaries are in your PATH
pipx ensurepath

# Install Hatch globally using pipx
pipx install hatch
```

Verify installation:

```bash
hatch --version
```

---

## 4. Inspect Hatch Environments

Check which environments and matrices are defined:

```bash
hatch env show
```

Typical output shows:

* `local` – Development environment
* `prod` – Production environment
* `test` – Testing matrices

---

## 5. Create the Local Environment

Create the virtual environment for development:

```bash
hatch env create local
```

---

## 6. Copy Configuration Files

Copy example environment configuration:

```bash
hatch run local:copy-config
```

This creates `config/.env` from `config/env.example`.

---

## 7. Configure Environment Variables

Edit `.env` to set proper values:

```bash
nano config/.env
```

Important variables to set:

* `DJANGO_SECRET_KEY` – Generate a secure key
* `DJANGO_ALLOWED_HOSTS` – Typically `127.0.0.1,localhost`
* `WATCHMAN_TOKEN` – Generate if using Watchman
* Email addresses should not contain quotes when exporting

Example `.env` snippet:

```env
DJANGO_DEBUG=1
DJANGO_DATABASE_URL=sqlite:///matorral.db
ENVIRONMENT=local
DJANGO_ADMIN_URL=admin/
DJANGO_SETTINGS_MODULE=config.settings
DJANGO_SECRET_KEY=my_secure_secret_key
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
WATCHMAN_TOKEN=my_watchman_token
CELERY_BROKER_URL=amqp://guest:guest@localhost:5672//matorral
SENTRY_ENABLED=False
SENTRY_DSN=http://example.com/123
DJANGO_EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DJANGO_DEFAULT_FROM_EMAIL=matorral@noreply.local
DJANGO_EMAIL_SUBJECT_PREFIX="[matorral] "
DJANGO_SERVER_EMAIL=matorral@noreply.local
DJANGO_ACCOUNT_ALLOW_REGISTRATION=True
USER_AGENT=matorral/0.1.0
CELERY_ALWAYS_EAGER=1
```

---

## 8. Export Environment Variables

```bash
export $(grep -v '^#' config/.env | xargs)
```

> If you encounter errors with email addresses, remove quotes or use `export VAR=value` for individual variables.

---

## 9. Install Project Dependencies and Apply Migrations

Run the project setup script using Hatch:

```bash
hatch run local:install
```

This will:

1. Install Python dependencies
2. Apply Django migrations
3. Create a superuser

When prompted, create your superuser:

```text
Username: thomasboimah
Email: thomas.boimah@jetrowebdevelopment.org
Password: ********
```

---

## 10. Run the Development Server

Start the server in the local environment:

```bash
hatch run local:server
```

Access the application at:

```
http://127.0.0.1:8000
```

> You may see warnings about URL patterns; these do not prevent running the server.

---

## 11. Login

* Open your browser and go to `http://127.0.0.1:8000/login/`
* Use the superuser credentials created earlier

---

## 12. Running Tests

To run all project tests:

```bash
hatch run test
```

This executes the test matrix defined in `pyproject.toml`.

---

## 13. Summary

Steps completed:

1. Clone repository and checkout `legacy-code`
2. Install Hatch
3. Create virtual environment
4. Copy and configure `.env`
5. Export environment variables
6. Install dependencies and run migrations
7. Create superuser
8. Run development server
9. Test login
10. Execute automated tests

Following this guide ensures a working development setup for the **Matorral** project.

---

## 14. Running the Project with Docker

Docker can be used to run both the database and the web application in containers. This is useful for isolating the environment or if you want to test the project in a containerized setup.

### 14.1 Build and Start Containers

```bash
docker-compose up --build
```

* This will build the Docker images and start the containers for:

  * `web` – The Django application
  * `db` – PostgreSQL database

### 14.2 Stop All Containers

```bash
docker-compose down
```

* Stops and removes all running containers.

### 14.3 Start Only the Database Container

```bash
docker-compose up -d db
```

* Useful if you want to use Hatch for the web server but keep the database in Docker.

### 14.4 Reset Database Completely

```bash
docker-compose down -v
```

* Removes all containers and volumes.
* Use with caution: this will **delete all database data**.

### 14.5 Check Container Logs

```bash
docker logs -f <container_name>
```

* Follow logs for debugging.
* Example:

```bash
docker logs -f matorral_web_1
docker logs -f matorral_db_1
```

### 14.6 Combining Hatch and Docker

* You can run **Hatch for the local server** and use **Docker for the database**:

```bash
docker-compose up -d db
hatch run local:server
```

* This setup allows fast development while keeping the DB isolated in a container.

### 15.7 Quick Workflow Comparison

| Task          | Hatch                    | Docker                       |
| ------------- | ------------------------ | ---------------------------- |
| Start project | `hatch run local:server` | `docker-compose up --build`  |
| Stop project  | `CTRL+C`                 | `docker-compose down`        |
| Start DB only | —                        | `docker-compose up -d db`    |
| Check logs    | —                        | `docker logs -f <container>` |
| Reset DB      | —                        | `docker-compose down -v`     |
