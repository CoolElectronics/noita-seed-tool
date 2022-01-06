
$ErrorActionPreference='silentlycontinue'
$gamepath = "."
$steampath = (Get-Item "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 881100").GetValue("InstallLocation")
$gogpath = (Get-Item "HKLM:\SOFTWARE\WOW6432Node\GOG.com\Games\1310457090").GetValue("path")
if(Test-Path $gamepath\noita.exe) {
	Write-Host "Found game in $gamepath"
} elseif($steampath -ne $null) {
	Write-Host "Found game on Steam"
	$gamepath = $steampath
} elseif($gogpath -ne $null) {
	Write-Host "Found game on GOG"
	$gamepath = $gogpath
}
Push-Location $gamepath
Invoke-Expression "& `".\noita.exe`" -magic_numbers magic.txt -no_logo_splashes"
Pop-Location