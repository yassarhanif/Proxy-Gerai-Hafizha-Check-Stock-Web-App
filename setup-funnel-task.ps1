$taskName = "TailscaleFunnel"
$batPath = ".\run_tailscale_funnel.bat"

# Create the action
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$batPath`""

# Create the trigger (at startup)
$trigger = New-ScheduledTaskTrigger -AtStartup

# Create the principal (highest privileges)
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -RunLevel Highest

# Settings: allow restart on failure
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1) `
  -MultipleInstances IgnoreNew

# Register the task
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger `
  -Principal $principal -Settings $settings -Force

Write-Host "✅ Task '$taskName' created successfully and will run at startup."
