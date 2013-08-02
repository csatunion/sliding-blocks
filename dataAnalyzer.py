import sys

GAMEID 	  = 0
HUMANTIME = 1
TIMESTAMP = 2
PLAYERNUM = 3
TUTORIAL  = 4
MODE 	  = 5
LEVELNO	  = 6
LEVELNAME = 7
MESSAGE	  = 8

def printInfo(level, elapsedTime, P1wordCount, P2wordCount, P1messageCount, P2messageCount):
	print level + ":"
	print "\telapsed time  : " + str(elapsedTime)
	print "\tword count    : " + str(P1wordCount + P2wordCount)
	print "\tmessage count : " + str(P1messageCount + P2messageCount)
	print "\tmessage breakdown:"
	
	if  (P1messageCount == 0):
		P1breakdown = 0 
		P2breakdown = 100
	elif(P2messageCount == 0):
		P1breakdown = 100
		P2breakdown = 0
	else:
		P1breakdown = (float(P1messageCount) / (P1messageCount + P2messageCount)) * 100
		P2breakdown = (float(P2messageCount) / (P1messageCount + P2messageCount)) * 100
		
	print "\t\tplayer 1 : " + str(P1messageCount) + " msgs sent, " + str(P1breakdown) + " % of msgs sent"
	print "\t\tplayer 2 : " + str(P2messageCount) + " msgs sent, " + str(P2breakdown) + " % of msgs sent"
	
	print "\tword count breakdown:"
	
	if  (P1wordCount == 0):
		P1breakdown = 0 
		P2breakdown = 100
	elif(P2wordCount == 0):
		P1breakdown = 100
		P2breakdown = 0
	else:
		P1breakdown = (float(P1wordCount) / (P1wordCount + P2wordCount)) * 100
		P2breakdown = (float(P2wordCount) / (P1wordCount + P2wordCount)) * 100
		
	print "\t\tplayer 1 : " + str(P1wordCount) + " words sent, " + str(P1breakdown) + " % of words sent"
	print "\t\tplayer 2 : " + str(P2wordCount) + " words sent, " + str(P2breakdown) + " % of words sent"
	

def analyzeData(dataFileName):
	dataFile = open(dataFileName, "r")
	
	data = dataFile.readline().split(",")
	
	levelName = data[LEVELNAME]
	
	gameStartTime = int(data[TIMESTAMP])
	gameP1MessageCount  = 0
	gameP2MessageCount  = 0
	gameP1WordCount	    = 0
	gameP2WordCount	    = 0
	
	levelStartTime = int(data[TIMESTAMP])
	levelP1MessageCount = 0
	levelP2MessageCount = 0
	levelP1WordCount    = 0
	levelP2WordCount    = 0
	
	temp = dataFile.readline()
	
	while(temp != ""):
		data = temp.split(",")
		
		if(data[LEVELNAME] != levelName):
			printInfo(levelName, int(data[TIMESTAMP]) - levelStartTime, levelP1WordCount, levelP2WordCount, levelP1MessageCount, levelP2MessageCount)
			levelName = data[LEVELNAME]
			
			gameP1WordCount    += levelP1WordCount
			gameP1MessageCount += levelP1MessageCount
			levelP1WordCount 	= 0
			levelP1MessageCount = 0
			
			gameP2WordCount    += levelP2WordCount
			gameP2MessageCount += levelP2MessageCount
			levelP2WordCount 	= 0
			levelP2MessageCount = 0
			
			levelStartTime = int(data[TIMESTAMP]) 
		
		message = data[MESSAGE][1:-2]
		
		if(message.startswith("message:")):
			message = message[9:]
			if(data[PLAYERNUM] == "\"1\""):
				levelP1WordCount += len(message.split())
				levelP1MessageCount += 1
			else:
				levelP2WordCount += len(message.split())
				levelP2MessageCount += 1
			
		temp = dataFile.readline();
	
	printInfo(levelName, int(data[TIMESTAMP]) - levelStartTime, levelP1WordCount, levelP2WordCount, levelP1MessageCount, levelP2MessageCount)
	
	gameP1WordCount    += levelP1WordCount
	gameP1MessageCount += levelP1MessageCount
	gameP2WordCount    += levelP2WordCount
	gameP2MessageCount += levelP2MessageCount
	
	printInfo("Total", int(data[TIMESTAMP]) - gameStartTime, gameP1WordCount, gameP2WordCount, gameP1MessageCount, gameP2MessageCount)
	
if __name__ == '__main__':
	argc = len(sys.argv)
	if(argc == 1):
		print "No file to analyze\n"
	elif(argc == 2):
		analyzeData(sys.argv[1]) 
