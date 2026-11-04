param(
    [string]$Porta = 'COM3',
    [ValidateRange(10, 120)][int]$Segundos = 45
)

# Executar com o Monitor Serial fechado e o relógio do Windows correto.
# Não reinicia a placa, não lê config.h e não transmite credenciais.
$conexaoRelogio = [IO.Ports.SerialPort]::new($Porta, 115200)
try {
    $conexaoRelogio.DtrEnable = $false
    $conexaoRelogio.RtsEnable = $false
    $conexaoRelogio.NewLine = "`n"
    $conexaoRelogio.Open()
    $inicioRelogio = [DateTimeOffset]::UtcNow
    $proximoHorario = $inicioRelogio
    while (([DateTimeOffset]::UtcNow - $inicioRelogio).TotalSeconds -lt $Segundos) {
        $agoraRelogio = [DateTimeOffset]::UtcNow
        if ($agoraRelogio -ge $proximoHorario -and ($agoraRelogio - $inicioRelogio).TotalSeconds -lt 12) {
            $conexaoRelogio.WriteLine('TIME ' + $agoraRelogio.ToUnixTimeSeconds())
            $proximoHorario = $agoraRelogio.AddSeconds(3)
        }
        Start-Sleep -Milliseconds 250
        $retornoRelogio = $conexaoRelogio.ReadExisting()
        if ($retornoRelogio) { Write-Output $retornoRelogio }
    }
} finally {
    if ($conexaoRelogio.IsOpen) { $conexaoRelogio.Close() }
    $conexaoRelogio.Dispose()
}
