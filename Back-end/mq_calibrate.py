import busio
import digitalio
import board
import time
import adafruit_mcp3xxx.mcp3008 as MCP
from adafruit_mcp3xxx.analog_in import AnalogIn

spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
cs = digitalio.DigitalInOut(board.D5)
mcp = MCP.MCP3008(spi, cs)

mq7 = AnalogIn(mcp, MCP.P0)
mq135 = AnalogIn(mcp, MCP.P1)

rl = 10 #Load resistance van de potmeter, ingesteld op 10K Ohm
vrl = 3.3 #Spanningsbereik - (0V - 3V3)

clean_rsr0_mq7 = 11.7 #Rs/R0 in de schone lucht van de MQ7 (Constante waarde, zie documentatie)
clean_rsr0_mq135 = 4.6 #Rs/R0 in de schone lucht van de MQ135 (Constante waarde, zie documentatie)

def calibrate(sensor, clean_rsr0):
    voltage = 0
    for x in range(50000):
        voltage += sensor.voltage
        time.sleep(0.01)
        percentage_complete = x/50000*100
        if x != 0 and percentage_complete % 2 == 0:
            print(str(percentage_complete) + "%")
            
    avg_voltage = voltage / 50000
    rs = ((vrl * rl) / avg_voltage) - rl #Sensorweerstand
    r0 = rs / clean_rsr0
    print("100%")
    return r0
    



print("Calibrating MQ-7, please wait...")
r0_mq7 = calibrate(mq7, clean_rsr0_mq7)
r0_mq135 = calibrate(mq135, clean_rsr0_mq135)


print("Calibrating MQ-135, please wait...")
print("De R0 van MQ7 is " + str(r0_mq7))
print("De R0 van MQ135 is " + str(r0_mq135))

