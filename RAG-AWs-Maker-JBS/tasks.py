from invoke import task
import platform



@task
def install(c):
    c.run("pip install -r requirements.txt") 

@task
def activate(c):
    # check if its windows or mac
    if platform.system() == "Windows":
        print("To activate the virtual environment, run:")
        print("   .\\venv\\Scripts\\Activate.ps1  # For PowerShell")
        print("   .\\venv\\Scripts\\activate.bat  # For Command Prompt")
    else:
        print("To activate the virtual environment, run:")
        print("   source ./venv/bin/activate")

@task
def run(c):
    c.run("python ./src/app.py")
