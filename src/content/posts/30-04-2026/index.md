---
title: Hacking the WiFi password of my own router
published: 2026-04-30
description: Playing around with the aircrack-ng suite
image: "./cover.jpg"
tags: ["Networking", "Cyber Security", "Wireless"]
category: Blog
draft: false
---

So I had a thought whilst reading about aircrack-ng, how hard would it be to hack my own Wi-Fi? 

My intention is to:
> 1. > Find information about my target ( My own router ) with airodump-ng
> 2. > Get a WPA handshake 
> 3. > Crack the handshake and extract a password

More sophisticated attacks are possible, but for now I just want to get familiar with the aircrack-ng suite. Surprisingly, the attack itself was the easiest part, the hardest part was everything around it.

# Setting it up
To even start sniffing out my network, I have to setup my network card to be able to do so. ``ip link`` to find the interface for the card, ``airmon-ng start [device]`` to set up monitoring. In my case ``airmon-ng start wlan0``, resulting in ``wlan0mon``. 

Now the device is ready to start snorting some data.

# Find info about the wireless environment (and hopefully my target) 
We run:
```airomon-ng wlan0mon``` 
And find some potential targets:
![airomon-ng result]("./airomon start.png")
We get some further info, that the target access point is running on channel 12 and after looking up WLAN channels we can also deduce it is running on 2.4GHz.

# Get a valid WPA handshake 
Now we can target the specific router and filter out the rest using:
```airodump-ng -w output wlan0mon --bssid B0:92[REDACTED] -c 12```
Now it's just a waiting game until a client initiates a handshake, and wait I did. I gave it 10 minutes before I intervened and starting trying to manually induce one. I started disconnecting and reconnecting my phone from the Wi-Fi a bunch of times, no dice. Even restarted the phone entirely before it occured to me I was probably doing something wrong, and indeed I was. It turned out the phone, smart as it is, was connecting to the superior connection on 5GHz which I was in fact not monitoring as shown on the airodump dashboard. 

Quick Google search turned out that the chipset of the network card I was using didn't support monitoring on the 5GHz band. Instead of dishing up 300~ DKK to pay for a network card that could do this, I just moved the goal post ever so slightly closer to myself. We'll just tempoarily disable 5GHz on the router so I can make this work.

# Router firmware derailment
Into the router settings I went, now just to find a way to disable 5GHz... Hmm. Not possible, perhaps if we change the SSID of the 5GHz channel to something else? Not allowed either. What if we disable Band Sharing to force the SSIDs to be different, it works! Or well... worked until the router realised what I was doing, reverted the setting, and locked me out of the panel to add insult to injury. No matter what I did, I could not force my router into doing what I wanted, even though I knew the settings were just there. Factory resetting the router showed the panel again for roughly half a minute, until the ISP-lobotomy showed up and locked me out again. I was quite close to flashing the router with OpenWRT, before realising my ISP probably want their router back at some point.

# Just use 2.4GHz on the phone dummy?
Again, a victim of the dumbing down of technology. To do this, you'd just connect to the SSID ending in 2.4... But oh wait, I can't do that can I? There's not even a setting for what band I prefer, it just assumes I prefer 5GHz and that's the final word.

# How do we continue?
Using the laws of physics of course! Whilst 5GHz is faster and arguably the superior technology, it is still bounded by the laws of physics. The shorter wavelength means it has a harder time penetrating hard materials, meaning if I can just put enough material between my router and my phone, I can force the phone to connect to the stronger signal. So I took my phone to the bathroom, reconnected to the Wi-Fi, and lo and behold, the phone MAC shows up in the list of 2.4GHz devices. 

# Back on track
Now we continue disconnecting and re-connecting the phone from the Wi-Fi until we capture a WPA handshake. And et voila, we got him... Or well, me. I pwned myself. Which is okay, I gave myself permission before attempting this.
![WPA Handshake found]("./wpa handshake.png")

# Cracking the WPA handshake
This step was easier in my head, I knew from the start I was gonna crack the password using the CUDA cores on my GPU, as they're usually better fit for the task than using a CPU. I had however underestimated the complexity of the password already on my router, so I changed it to something simpler. 9 letters alphanumeric, with one large symbol. Still, too complex, so I changed it again, to something even simpler, just 8 latin characters, no numbers, no special chars, nothing, just that. Also probably have to mention that every time I changed the password, I had to go re-capture a new WPA handshake, I did this 3 times. Anyhow, I got there in the end.

First you convert the capture file to a format usable by hashcat
![Converting .cap file to .hc22000]("./konvertering af capfil til hashcat.png")

Then you throw the file at hashcat
![Hashcat going at it]("./hashcat undervejs.png")

Also, I should mention that I gave hashcat a pattern for the password, 8 chars in a row. Still took insanely long. In the end I gave 5 known chars of the password just to finally land at the resulting terminal.
![Extracted password]("./hashcat resultat.png")