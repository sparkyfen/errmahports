#!/usr/bin/python

import nmap
import sys

nm = nmap.PortScanner()
nm.scan(str(sys.argv[1]),str(sys.argv[2]))

statuslist = ""

statuslist = statuslist + "{\"ports\": {"

portlist = str(sys.argv[2]).split(",")


for i in portlist:
  if nm[str(sys.argv[1])]['tcp'][int(i)]['state'] == "open":
    if i == portlist[-1]:
      statuslist = statuslist + "\"" + i + "\":true"
    else:
      statuslist = statuslist + "\"" + i + "\":true, "
  else:
    if i == portlist[-1]:
      statuslist = statuslist + "\"" + i + "\":false"
    else:
      statuslist = statuslist + "\"" + i + "\":false, "
statuslist = statuslist + "}}"
sys.stdout.write(statuslist)
