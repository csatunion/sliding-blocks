import sys


def parseData(f):
	read = open(f)
	write = open("TEXT_"+f, "w+")
	
	for line in read:
		string = line.strip().split(',')
		info = string[len(string)-1].split(':')

                if(info[0] == "msent"):
                        write.write("msent:"+info[1]+"\n")
                elif(info[0] == "mreceived"):
                        write.write("mreceived:"+info[1]+"\n")
                
	read.close()
	write.close()

if __name__ == '__main__':
	parseData(sys.argv[1])
