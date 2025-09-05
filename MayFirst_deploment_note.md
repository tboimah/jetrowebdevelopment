# Complete Django Deployment Guide: May First Shared Hosting

## Overview
**Author:** Thomas Boimah  
**Project:** ToDo App Deployment  
**Date:** September 3-4, 2025  
**Status:** Production Ready

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Initial Server Investigation](#2-initial-server-investigation)
3. [Application Setup](#3-application-setup)
4. [Gunicorn Configuration](#4-gunicorn-configuration)
5. [Permanent Process Setup](#5-permanent-process-setup)
6. [Web Server Configuration](#6-web-server-configuration)
7. [Troubleshooting](#7-troubleshooting)
8. [Common Errors & Solutions](#8-common-errors--solutions)

---

## 1. Prerequisites

### Required Access
- May First Control Panel access
- SSH credentials (`username@shell.mayfirst.org`)
- Domain configured in May First panel

### Verification Steps
```bash
# Test SSH access
ssh tboimah@shell.mayfirst.org
# Expected: Successful login with server prompt

#2. Initial Server Investigation
###Directory Structure Exploration
pwd
# Expected: /home/site363865writer

ls -la
# Expected output:
# drwxr-xr-x  2 site363865writer site363865writer 4.0K Sep  3 11:20 bin
# drwxr-xr-x  2 site363865writer site363865writer 4.0K Sep  3 11:20 cgi-bin
# drwxr-xr-x  2 site363865writer site363865writer 4.0K Sep  3 11:20 files
# drwxr-xr-x  2 site363865writer site363865writer 4.0K Sep  3 11:20 include
# drwxr-xr-x  2 site363865writer site363865writer 4.0K Sep  3 11:20 logs
# drwxr-xr-x  4 site363865writer site363865writer 4.0K Sep  3 11:20 perl5
# -rw-r--r--  1 site363865writer site363865writer  351 Sep  3 11:20 README.en.txt
# drwxr-xr-x  2 site363865writer site363865writer 4.0K Sep  3 11:20 web

###Software Verification
python3 --version
# Expected: Python 3.x.x

pip3 --version
# Expected: pip x.x.x from ... (python 3.x)

git --version
# Expected: git version x.x.x

which gunicorn
# Expected: (might be empty initially)

#3. Application Setup
###Clone Repository
cd ~/include
git clone <repository-url> ToDos
cd ToDos/sharedtodo

ls -la
# Expected:
# drwxr-xr-x 2 site363865writer site363865writer 4.0K Sep  3 11:20 accounts
# -rw-r--r-- 1 site363865writer site363865writer    0 Sep  3 12:36 db.sqlite3
# -rwxr-xr-x 1 site363865writer site363865writer  666 Sep  3 11:20 manage.py
# drwxr-xr-x 3 site363865writer site363865writer 4.0K Sep  3 11:20 sharedtodo
# drwxr-xr-x 2 site363865writer site363865writer 4.0K Sep  3 11:20 tasks
# drwxr-xr-x 2 site363865writer site363865writer 4.0K Sep  3 11:20 templates
# drwxr-xr-x 3 site363865writer site363865writer 4.0K Sep  3 11:20 venv

###Virtual Environment Setup
python3 -m venv venv
source venv/bin/activate
# Expected: Prompt changes to (venv) site363865writer@...

pip install django gunicorn
# Expected: Successfully installed django-5.2 gunicorn-23.0.0 ...

###Database Setup
python manage.py migrate
# Expected:
# Operations to perform:
#   Apply all migrations: admin, auth, contenttypes, sessions, ...
# Applying migrations... 100% complete

ls -la db.sqlite3
# Expected: -rw-r--r-- 1 site363865writer site363865writer XXXX Sep  3 12:36 db.sqlite3
# (File size should be > 0 bytes)

#4. Gunicorn Configuration
###Port Discovery
# Test standard port (will fail)
gunicorn --bind 0.0.0.0:8000 sharedtodo.wsgi:application
# Expected: Error - Connection timeout or refused

# Test high port (successful)
gunicorn --bind 0.0.0.0:24681 sharedtodo.wsgi:application
# Expected:
# [2025-09-03 11:43:51 +0000] [1441765] [INFO] Starting gunicorn 23.0.0
# [2025-09-03 11:43:51 +0000] [1441765] [INFO] Listening at: http://0.0.0.0:24681 (1441765)
# [2025-09-03 11:43:51 +0000] [1441765] [INFO] Using worker: sync
# [2025-09-03 11:43:51 +0000] [1441766] [INFO] Booting worker with pid: 1441766

###Verification
# In another terminal
curl -v http://127.0.0.1:24681
# Expected: HTTP 302 Found with redirect headers

#5. Permanent Process Setup
###Scheduled Job Configuration
####Location: May First Control Panel → Scheduled Jobs
####Command: /home/sites/363865/include/ToDos/sharedtodo/venv/bin/gunicorn -b :24681 sharedtodo.wsgi:application
####Settings:    
-Schedule: forever
-Directory: /home/sites/363865/include/ToDos/sharedtodo

###Process Management
# Check running processes
ps aux | grep gunicorn
# Expected output showing your processes:
# site363+ 1459877  0.0  0.0  32980 23252 ?        S    Sep03   0:22 /media/.../gunicorn --bind 0.0.0.0:24681 sharedtodo.wsgi:application
# site363+ 1461899  0.0  0.1  57340 45600 ?        S    Sep03   0:03 /media/.../gunicorn --bind 0.0.0.0:24681 sharedtodo.wsgi:application


#6. Web Server Configuration
###Final Step Requirement
####May First support must configure Apache reverse proxy.(send email and wait for respond)

#7 May First respond with solution. Below is the solutions:

May First support provided the exact configuration needed. Here's how to implement it:

1.  **Log in** to your May First control panel.
2.  Navigate to your hosting order management.
3.  Find the **"Web Configuration"** or similar section.
4.  Look for an **"Advanced Settings"** or **"Custom Configuration"** field.
5.  **Paste the following configuration block** provided by Jaime Villarreal:

    ```apache
    ProxyPass / http://localhost:24681/
    ProxyPreserveHost On
    RequestHeader set X-Real-IP %{REMOTE_ADDR}s
    ```

#8.  **Save** the changes.

### What this configuration does:

- **`ProxyPass / http://localhost:24681/`**: Tells Apache to forward all requests (`/`) to your Gunicorn server running on port `24681`.
- **`ProxyPreserveHost On`**: Preserves the original host header from the client.
- **`RequestHeader set X-Real-IP %{REMOTE_ADDR}s`**: Passes the real client IP address to your Django application.

#9.Test the Configuration

After saving, wait a few minutes for the configuration to take effect, then test:

```bash
# Test from your local machine (this should now work!)
curl http://jetro.mayfirst.org or vist browser: 

# Or test from the server itself
curl http://localhost:24681

###Verify in Browser

Open your web browser and visit:
http://jetro.mayfirst.org