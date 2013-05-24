import sys

data = []

def insertData(time, info):
        i = 0
        while(i < len(data) and time >= data[i][0]):
                i = i + 1

        data.insert(i, (time,info))

def writeData(string):
        write = open("TEXT_"+string, "w+")
        for item in data:
                print item[1]
                info = item[1]
                
                if(info[0] == "msent"):
                        write.write("msent:"+info[1]+"\n")
                elif(info[0] == "mreceived"):
                        write.write("mreceived:"+info[1]+"\n")
        write.close()
        

def parseData(f):
	read = open(f)
	
	for line in read:
		string = line.strip().split(',')
		info = string[len(string)-1].split(':')                
		insertData(string[2], info)

        writeData(f)
	read.close()

if __name__ == '__main__':
	parseData(sys.argv[1])
