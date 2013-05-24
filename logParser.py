import sys

def writeData(outputFileName, data):
        outputFile = open(outputFileName, "w+")
        
        for item in data:
                item = item[1]
                outputFile.write(item[0]+":"+item[1]+"\n")

        outputFile.close()
        

def parseData(inputFileName, outputFileName):
        data = []

        inputFile = open(inputFileName, "r")
	
	for line in inputFile:
		string = line.strip().split(',')
		info = string[len(string)-1].split(':')
		if(info[0] == "msent" or info[0] == "mreceived"):
                        data.append((string[2], info))

        inputFile.close()
        
        data = sorted(data, key=lambda index :int(index[0]))
        writeData(outputFileName, data)

if __name__ == '__main__':
        argc = len(sys.argv)
        if(argc == 1):
                print "No file to parse\n"
        elif(argc == 2):
                parseData(sys.argv[1], "TEXT_"+sys.argv[1]) 
        else:
                parseData(sys.argv[1], sys.argv[2])
