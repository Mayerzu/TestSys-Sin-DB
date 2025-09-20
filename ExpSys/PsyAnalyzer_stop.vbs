Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd.exe /c taskkill /F /IM python.exe", 0, False
Set WshShell = Nothing
