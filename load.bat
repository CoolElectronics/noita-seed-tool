cd C:\Users\%USERNAME%\AppData\LocalLow\Nolla_Games_Noita\

FOR /F "delims=|" %%I IN ('DIR "" /B /O:D') DO if NOT %%I == save00 SET NewestFile=%%I
echo The most recently created file is %NewestFile%
rmdir save00
robocopy /E "%NewestFile%/" "save00" 