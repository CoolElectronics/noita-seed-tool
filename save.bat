@echo off

FOR /F %%A IN ('WMIC OS GET LocalDateTime ^| FINDSTR \.') DO @SET B=%%A
set NOW=%B:~0,4%-%B:~4,2%-%B:~6,2%
set SOURCE=C:\Users\%USERNAME%\AppData\LocalLow\Nolla_Games_Noita\save00
set DEST=C:\Users\%USERNAME%\AppData\LocalLow\Nolla_Games_Noita\%NOW%  
robocopy /E "%SOURCE%" "%DEST%"
echo "this is now the newest file">C:\Users\%USERNAME%\AppData\LocalLow\Nolla_Games_Noita\%NOW%\%NOW%.txt