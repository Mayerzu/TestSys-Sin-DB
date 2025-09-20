Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd.exe /c ""cd /d c:\TestSys && venv\Scripts\activate && python.exe wsgi.py""", 0, False
Set WshShell = Nothing